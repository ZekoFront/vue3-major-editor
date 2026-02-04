<template>
<NTooltip placement="top" trigger="hover">
<template #trigger>
    <button class="toolbar-icon--btn" @click="handleUploadImg()">
        <svg viewBox="0 0 1024 1024" width="200" height="200">
            <path
                d="M896 626.592a16 16 0 0 0-7.68-13.664l-172.448-105.088a16 16 0 0 0-20.704 3.52l-76 92.608-1.024 1.152a16 16 0 0 1-22.624 0.032l-252.832-252.064a16.032 16.032 0 0 0-22.08-0.512l-187.36 170.656a15.936 15.936 0 0 0-5.248 11.84V800h768v-173.408z">
            </path>
            <path d="M800 320m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"></path>
            <path d="M32 128v768h960V128H32z m896 704H96V192h832v640z"></path>
        </svg>
    </button>
</template>
<span>添加图片</span>
</NTooltip>

<UploadImageModal 
    ref="UploadImageRef"
    :editor="editor" 
    :defaultConfig="defaultConfig" 
    :urlPattern="urlPattern">
</UploadImageModal>
</template>

<script setup lang="ts" name="ImageIcon">
import { Editor } from '@tiptap/core';
import { NTooltip } from "naive-ui";
import UploadImageModal from './UploadImageModal.vue';

defineOptions({
    name: 'ImageIcon',
    inheritAttrs: false,
})

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false,
    },
    isReadonly: {
        type: Boolean,
        default: false,
    },
    colors: {
        type: Array<string>,
        default: []
    },
    tipText: {
        type: String,
        default: '暂无提示'
    },
    editor: {
      type: Editor,
      required: true,
    },
    urlPattern: {
        type: RegExp,
        required: true,
    },
    defaultConfig: {
        type: Object,
        default: () => null
    },
})

// 上传图片
interface UploadImageType {
    initialize: () => void;
}
const UploadImageRef = ref<UploadImageType | null>(null)
const handleUploadImg = () => {
    if (!props.editor.isEditable) return
    UploadImageRef.value && UploadImageRef.value.initialize()
}
</script>