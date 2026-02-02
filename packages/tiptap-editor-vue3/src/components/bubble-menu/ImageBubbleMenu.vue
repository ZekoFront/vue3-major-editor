<template>
<div :class="['editor-image-bubble--menu']" v-if="editor">
    <NIcon class="bubble-icon-item" size="21" :title="item.title" :color="displayState===item.state?ThemeColor:''" v-for="(item, index) in displayList" :key="item.title+index">
        <component :is="item.icon" @click="handleFloat(item.state)"></component>
    </NIcon>
</div>
<n-modal v-model:show="showCropModal" class="crop-image-modal">
    <n-card
      style="width: 700px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
        <div class="crop-preview-box">
            <vue-cropper
                class="crop-image"
                ref="cropperRef"
                :img="cropOption.img"
                :outputSize="cropOption.outputSize"
                :outputType="cropOption.outputType"
                :info="cropOption.info"
                :canScale="cropOption.canScale"
                :autoCrop="cropOption.autoCrop"
                :autoCropWidth="cropOption.autoCropWidth"
                :autoCropHeight="cropOption.autoCropHeight"
                :fixed="cropOption.fixed"
                :fixedNumber="cropOption.fixedNumber"
                :full="cropOption.full"
                :fixedBox="cropOption.fixedBox"
                :canMove="cropOption.canMove"
                :canMoveBox="cropOption.canMoveBox"
                :original="cropOption.original"
                :centerBox="cropOption.centerBox"
                :height="cropOption.height"
                :infoTrue="cropOption.infoTrue"
                :maxImgSize="cropOption.maxImgSize"
                :enlarge="cropOption.enlarge"
                :mode="cropOption.mode"
                @realTime="realTimeCrop">
            </vue-cropper>
            <div class="preview-image" v-if="previewImage" v-html="previewImage?.html">
            </div>
        </div>
    
        <template #footer>
            <div style="display: flex; justify-content: flex-end;">
                <n-button @click="handleCrop('confirm')" style="margin-right: 10px;">确定</n-button>
                <n-button @click="handleCrop('cancel')">取消</n-button>
            </div>
        </template>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts" name="ImageBubbleMenu">
import { NIcon, NModal, NCard, NButton } from "naive-ui";
import { AlignLeft16Regular, AlignRight16Regular, Delete20Regular, ResizeSmall16Regular, Square16Regular, Crop24Regular } from "@vicons/fluent"
import { Editor } from "@tiptap/core";
import { nodeViewProps } from "@tiptap/vue-3";
import { ImageDisplay, ThemeColor, resolveImageURL} from '@/utils'
import { VueCropper }  from "vue-cropper";
import 'vue-cropper/dist/index.css'

const props = defineProps({ 
    editor: {
        type: Editor,
        required: true,
    },
    node: nodeViewProps['node'],
    updateAttrs: nodeViewProps['updateAttributes'],
 });

const displayList = ref([
    { title: '裁剪', state: "crop", icon: markRaw(Crop24Regular) },
    { title: '删除', state: "del", icon: markRaw(Delete20Regular) },
    { title: '内联元素', state: ImageDisplay.INLINE, icon: markRaw(ResizeSmall16Regular) },
    { title: '块元素', state: ImageDisplay.BREAK_TEXT, icon: markRaw(Square16Regular) },
    { title: '左浮动', state: ImageDisplay.FLOAT_LEFT, icon: markRaw(AlignRight16Regular) },
    { title: '右浮动', state: ImageDisplay.FLOAT_RIGHT, icon: markRaw(AlignLeft16Regular) },
 ])
const displayState = ref<string>(props.node?.attrs.display)
const showCropModal = ref(false)

const cropperRef = useTemplateRef<{
    getCropBlob: (callback: any) => void
}>('cropperRef')
const previewImage = ref<any>(null)
const cropOption = ref({
    img: props.node?.attrs.src,             // 裁剪图片的地址
    outputSize: 1,       // 裁剪生成图片的质量(可选0.1 - 1)
    outputType: 'png',  // 裁剪生成图片的格式（jpeg || png || webp）
    info: true,          // 图片大小信息
    canScale: true,      // 图片是否允许滚轮缩放
    autoCrop: true,      // 是否默认生成截图框
    autoCropWidth: 200,  // 默认生成截图框宽度
    autoCropHeight: 200, // 默认生成截图框高度
    fixed: true,         // 是否开启截图框宽高固定比例
    fixedNumber: [1, 1], // 截图框的宽高比例
    full: false,         // false按原比例裁切图片，不失真
    fixedBox: false,      // 固定截图框大小，不允许改变
    canMove: true,      // 上传图片是否可以移动
    canMoveBox: true,    // 截图框能否拖动
    original: false,     // 上传图片按照原始比例渲染
    centerBox: false,    // 截图框是否被限制在图片里面
    height: true,        // 是否按照设备的dpr 输出等比例图片
    infoTrue: false,     // true为展示真实输出图片宽高，false展示看到的截图框宽高
    maxImgSize: 3000,    // 限制图片最大宽度和高度
    enlarge: 1,          // 图片根据截图框输出比例倍数
    mode: '200px 200px'  // 图片默认渲染方式
})

const realTimeCrop = (data: any) => {
    previewImage.value = data
}

const handleFloat = (val: string) => {
    if (val === 'del') {
        deleteImage()
    } else if (val === 'crop') {
        // 裁剪图片
        showCropModal.value = true
    } else {
        displayState.value = val
        props.updateAttrs({
            display: val
        })
    }
    
}

const handleCrop = (val: string) => {
    if (val === 'cancel') {
        showCropModal.value = false
    } else {
        showCropModal.value = false
        // 裁剪图片
        cropperRef.value&&cropperRef.value.getCropBlob(async (data: any) => {
            const cropUrl = URL.createObjectURL(new Blob([data]))
            props.updateAttrs({
                src: cropUrl
            })
        })
    }
}

const deleteImage = () => {
    // https://tiptap.dev/docs/editor/api/commands/selection/delete-selection
    // deleteSelection 命令将定位并删除编辑器中当前选择的任何节点或内容
    props.editor.commands.deleteSelection()
}

</script>

<style lang="scss">
.crop-preview-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .crop-image {
        flex: 1;
        height: 300px;
    }
    .preview-image {
        flex: 1;
        height: 300px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
    }
    .show-preview {
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        justify-content: center;
        border:1px solid #67c23a;
        background: #cccccc;
        .preview{
            overflow: hidden;
            background: #cccccc;
        }
    }
}
</style>