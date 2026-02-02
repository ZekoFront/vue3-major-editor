<template>
<node-view-wrapper as="span" :class="imageViewClass">
    <div class="tiptap-image-view__body">
        <img 
            :src="String(imageURL)" 
            :alt="node.attrs.alt" 
            :width="Number(imageWidth)" 
            :height="Number(imageHeight)" 
            class="tiptap-image-element" 
            :title="String(title)"
            @click="selectedImage"
        />
        <div v-if="isUploading" class="upload-status">upload...</div>
        <div class="image-view-resizer" v-if="selected||isDragging">
            <div :class="['resize-handle-btn', item]" @mousedown="onHandleBtnDrag" v-for="(item, index) in directionList" :key="index"></div> 
        </div>

        <!--
            当图片出现滚动时，BubbleMenu菜单定位错位，
            出现多张图片时，BubbleMenu只会显示最后一张图片操作按钮，
            用n-popover替换BubbleMenu 
        -->
        <n-popover trigger="manual" :show="selected" placement="bottom">
            <template #trigger>
                <div></div>
            </template>
            <ImageBubbleMenu :updateAttrs="updateAttributes" :editor="editor" :node="node"></ImageBubbleMenu>
        </n-popover>
    </div>
</node-view-wrapper>
</template>

<script setup lang="ts" name="ImageNodeViewWrapper">
import { clamp, useResizeObserver } from '@vueuse/core'
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { NodeViewProps } from "@tiptap/core";
// 图片菜单
import ImageBubbleMenu from "@/components/bubble-menu/ImageBubbleMenu.vue";
import { MAX_SIZE, MIN_SIZE, resolveImageURL } from "@/utils";
import type { CSSProperties } from 'vue';
import { NPopover } from 'naive-ui'

const props = defineProps({ ...nodeViewProps });

const directionList = ref(['tl','tr','br','bl'])

const isUploading = ref(false);
const title = ref(props.node.attrs.title || "");
// tiptap3.0选中状态自定义
const isSelected = ref(false)
// tiptap2.0选中状态selected不会因为拖拽而取消, 3.0selected会取消选中
// const isActiveImage = computed(() => {
//     return props.selected
// })
const imageURL = computed(() => props.node.attrs.src)
const imageWidth = computed(() => props.node.attrs.width)
const imageHeight = computed(() => props.node.attrs.height)
const display = computed(() => props.node.attrs.display)
const imageViewClass = computed(() => {
    return ['tiptap-image-view', `tiptap-image-view--${display.value}`]
})

// watch(() => props.selected, (newValue) => {
//     console.log('selected', newValue)
// })

const selectedImage = () => {
    props.editor.commands.setNodeSelection(Number(props.getPos()));
    isSelected.value = !isSelected.value
}

// 八个点位拖拽修改图片尺寸
const isDragging = ref(false)
const resizerParams = ref<{
    x: number,
    y: number,
    w: number,
    h: number,
    dir: string
}>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dir: '',
})
const originalSize = ref<CSSProperties>({
    width: 0,
    height: 0
})
const maxSize = ref<CSSProperties>({
    width: MAX_SIZE,
    height: MAX_SIZE
})
const resizeObserver = ref<ResizeObserver>()
let direction:string = '';

const onHandleBtnDrag = (event:MouseEvent) => {
    isDragging.value = true
    event.preventDefault()
    event.stopPropagation()
    const currentHandle = event.target as HTMLElement;
    direction = currentHandle.className.split(" ")[1];

    resizerParams.value.x = event.clientX;
    resizerParams.value.y = event.clientY;

    const originalWidth = Number(originalSize.value.width);
    const originalHeight = Number(originalSize.value.height);
    const aspectRatio = originalWidth / originalHeight;

    let { width, height } = props.node!.attrs;
    const maxWidth = Number(maxSize.value.width);

    if (width && !height) {
        width = width > maxWidth ? maxWidth : width;
        height = Math.round(width / aspectRatio);
    } else if (height && !width) {
        width = Math.round(height * aspectRatio);
        width = width > maxWidth ? maxWidth : width;
    } else if (!width && !height) {
        width = originalWidth > maxWidth ? maxWidth : originalWidth;
        height = Math.round(width / aspectRatio);
    } else {
        width = width > maxWidth ? maxWidth : width;
    }

    resizerParams.value.w = width;
    resizerParams.value.h = height;
    resizerParams.value.dir = direction;

    onEvents()
}

function resizeImage(event:MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isDragging.value) return

    const { x, y, w, h, dir } = resizerParams.value;

    const dx = (event.clientX - x) * (/l/.test(dir) ? -1 : 1);
    const dy = (event.clientY - y) * (/t/.test(dir) ? -1 : 1);

    props.updateAttributes?.({
        width: clamp(w + dx, MIN_SIZE, Number(maxSize.value.width)),
        height: Math.max(h + dy, MIN_SIZE),
    });
}

const onMouseUp = (e:MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging.value) return
    
    selectedImage();
    isDragging.value = false
    resizerParams.value = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        dir: '',
    };
    offEevents()
}

const onEvents = () => {
    document.addEventListener("mousemove", resizeImage, true);
    document.addEventListener("mouseup", onMouseUp, true);
}
const offEevents = () => {
    document.removeEventListener("mousemove", resizeImage, true);
    document.removeEventListener("mouseup", onMouseUp, true);
} 

// 图片上传处理
const handleUpload = async (file: File) => {
    isUploading.value = true;
    try {
        // 替换为实际上传接口
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/upload", { method: "POST", body: formData });
        const { url } = await response.json();
        props.editor.commands.setImage({
            src: url,
            width: imageWidth.value,
            height: imageHeight.value,
        });
    } catch (error) {
        console.error("Upload failed:", error);
    } finally {
        isUploading.value = false;
    }
};

const getMaxSize = (entry:ResizeObserverEntry) => {
    const { width, height } = entry.contentRect
    maxSize.value.width = parseInt(String(width), 10);
}


const init = async () => {
    const result = await resolveImageURL(imageURL.value);

    if (!result.complete) {
      result.width = MIN_SIZE;
      result.height = MIN_SIZE;
    }
    originalSize.value.width = result.width
    originalSize.value.height = result.height
}

init()

// 初始化时处理图片属性
onMounted(() => {
    useResizeObserver(props.editor!.view.dom, (entries) => {
        const entry = entries[0]
        getMaxSize(entry)
    })

    if (props.node.attrs.file) {
        handleUpload(props.node.attrs.file);
    }
});

onBeforeUnmount(() => {
    resizeObserver.value?.disconnect()
})

</script>
<style lang="scss">
.tiptap-image-view {
    margin: 12px 0;
    display: inline-block;
    float: none;
    user-select: none;
    vertical-align: baseline;
    // position: relative;
    &--inline {
        margin-left: 12px;
        margin-right: 12px;
    }
    &--block {
        display: block;
    }
    &--left {
        float: left;
        margin-left: 0;
        margin-right: 12px;
    }
    &--right {
        float: right;
        margin-left: 12px;
        margin-right: 0;
    }
}

.tiptap-image-view__body {
    clear: both;
    display: inline-block;
    position: relative;
    max-width: 100%;
    outline-color: transparent;
    outline-style: solid;
    outline-width: 2px;
    .tiptap-image-element {
        display: block;
        float: none;
        cursor: pointer;
        margin: 0;
        max-width: 100%;
        min-height: 20px;
        min-width: 20px;
    }
    .image-view-resizer {
        border: 1px solid var(--theme-color);
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 1;
    }
}

.resize-handle {
    position: absolute;
    right: -8px;
    bottom: -8px;
    width: 16px;
    height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: nwse-resize;
    opacity: 0;
    transition: opacity 0.2s;
}

.customize-image:hover .resize-handle {
    opacity: 1;
}

.upload-status {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

/* 八个调整大小的控制点样式 */
.resize-handle-btn { 
    position: absolute;
    background: var(--theme-color);
    width: 12px;
    height: 12px;
    z-index: 5;
    font-size: 0;
    // border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 2px rgba(0,0,0,0.3);
    transition: transform 0.2s ease;
    &.tl {
        top: -5px;
        left: -5px;
        cursor: nw-resize;
    }
    &.tr {
        top: -5px;
        right: -5px;
        cursor: ne-resize;
    }
    &.br {
        bottom: -5px;
        right: -5px;
        cursor: se-resize;
    }
    &.bl {
        bottom: -5px;
        left: -5px;
        cursor: sw-resize;
    }
} 
.resize-handle-btn:hover {
    transform: scale(1.2);
    background: var(--theme-color);
}
</style>
