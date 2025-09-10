<template>
<node-view-wrapper as="span" class="image">
    <div ref="dragModifiedImageRef" :class="[
        'image-single__body drag-modified-image-size',
        { 'image-single__body--actived': isSelected }
    ]">
        <img 
            :src="imageURL" 
            :alt="node.attrs.alt" 
            :width="imageWidth" 
            :height="imageHeight" 
            ref="imageElement" 
            :title="title"
            @click="selectedImage"
        />
        <div v-if="isUploading" class="upload-status">upload...</div>
        <template v-if="isSelected">
            <div :class="['resize-handle-btn', item]" @mousedown="onHandleBtnDrag" v-for="(item, index) in directionList" :key="index"></div> 
        </template>

        <ImageBubbleMenu :editor="editor" :node="node" :is-show="isSelected"></ImageBubbleMenu>
    </div>
</node-view-wrapper>
</template>

<script setup lang="ts" name="ImageNodeViewWrapper">
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { NodeViewProps } from "@tiptap/core";
// 图片菜单
import ImageBubbleMenu from "@/components/bubble-menu/ImageBubbleMenu.vue";
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH, resolveImg } from "@/utils";

defineOptions({
    name: 'ImageNodeViewWrapper'
})

const props = defineProps({ ...nodeViewProps });

const emits = defineEmits(["updateAttributes"]);

const directionList = ref(['top-left','top','top-right','right','bottom-right','bottom','bottom-left','left'])

const imageElement = ref<HTMLImageElement>();
const dragModifiedImageRef = ref<HTMLDivElement>()
const isUploading = ref(false);
const originalWidth = ref(0);
const originalHeight = ref(0);
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

const selectedImage = () => {
    props.editor.commands.setNodeSelection(Number(props.getPos()));
    isSelected.value = !isSelected.value
}

// 八个点位拖拽修改图片尺寸
const onHandleBtnDrag = (event:MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const currentHandle = event.target as HTMLElement;
    const direction = currentHandle.className.split(" ")[1];

    const startX = event.clientX;
    const startY = event.clientY;
    let startWidth = 0,
        startHeight = 0,
        startLeft = 0,
        startTop = 0;

    if (dragModifiedImageRef.value) {
        const rect = dragModifiedImageRef.value.getBoundingClientRect()
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;
    }
    
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
    function resize(event:MouseEvent) {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        let width = startWidth,
        height = startHeight,
        left = startLeft,
        top = startTop;
        if (direction.includes("left")) {
            width = startWidth - dx;
            left = startLeft + dx / 2;
        }
        if (direction.includes("right")) {
            width = startWidth + dx;
            left = startLeft + dx / 2;
        }
        if (direction.includes("top")) {
            height = startHeight - dy;
            top = startTop + dy / 2;
        }
        if (direction.includes("bottom")) {
            height = startHeight + dy;
            top = startTop + dy / 2;
        }
        if (width <= 0 || height <= 0) return;

        if (dragModifiedImageRef.value) {
            const iw = Math.max(100, width);
            const ih = Math.max(100, height)
            dragModifiedImageRef.value.style.width = iw+'px';
            dragModifiedImageRef.value.style.height = ih+'px';

            // 调用当前节点updateAttributes
            props.updateAttributes({
                width: iw,
                height: ih,
            });
        }
    }
    function stopResize() {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
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
const MIN_SIZE = 20;
const init = async () => {
    // const result = await resolveImg(imageURL.value);

    // if (!result.complete) {
    //   result.width = MIN_SIZE;
    //   result.height = MIN_SIZE;
    // }
    // originalWidth.value = result.width
    // originalHeight.value = result.height

    nextTick(() => {
        if (dragModifiedImageRef.value) {
            dragModifiedImageRef.value.style.width = DEFAULT_IMAGE_WIDTH+'px';
            dragModifiedImageRef.value.style.height = DEFAULT_IMAGE_HEIGHT+'px';
        }
    })
}

init()

// 初始化时处理图片属性
onMounted(() => {
    if (props.node.attrs.file) {
        handleUpload(props.node.attrs.file);
    }
});
</script>
<style lang="scss">
.image {
    margin: 1rem 0;
}

.image-single__body {
    position: relative;
    display: inline-block;
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

.drag-modified-image-size {
    border: 2px solid transparent;
    &.image-single__body--actived {
        border: 2px solid var(--theme-color);
    }
}

/* 八个调整大小的控制点样式 */
.resize-handle-btn { 
    position: absolute;
    background: var(--theme-color);
    width: 8px;
    height: 8px;
    z-index: 5;
    font-size: 0;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 2px rgba(0,0,0,0.3);
    transition: transform 0.2s ease;
} 
.resize-handle-btn:hover {
    transform: scale(1.2);
    background: var(--theme-color);
}
.top-left {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
}

.top {
    top: -5px;
    left: calc(50% - 5px);
    cursor: ns-resize;
}

.top-right {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
}

.right {
    top: calc(50% - 5px);
    right: -5px;
    cursor: ew-resize;
}

.bottom-right {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
}

.bottom {
    bottom: -5px;
    left: calc(50% - 5px);
    cursor: ns-resize;
}

.bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
}

.left {
    top: calc(50% - 5px);
    left: -5px;
    cursor: ew-resize;
}
</style>
