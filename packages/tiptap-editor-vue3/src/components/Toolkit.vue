<template>
<div :class="[
        'vue3-tiptap-editor__toolbar',
        { 'vue3-tiptap-editor-enabled': !editor.isEditable }
    ]" 
    data-vue3-tiptap-editor-btn="true"
>
    <!-- 测试图标 -->
    <!-- <ErrorImage></ErrorImage> -->
     
    <component 
        v-for="(item, index) in cusComponentIcon" 
        v-bind="item.componentProps" 
        :is="item.component" 
        :key="index"
        :customImageUpload="customImageUpload"
        @onUploadImageCallBack="onUploadImageCallBack">
    </component>
    <NTooltip placement="top" trigger="hover">
        <template #trigger>
           <button class="toolbar-icon--btn" data-editor-toolbar-btn="true"  @click="closeContents">
                <NIcon size="21">
                    <ContentView32Regular></ContentView32Regular>
                </NIcon>
            </button>
        </template>
        <span >目录</span>
    </NTooltip>
    
    <button class="toolbar-icon--btn" data-editor-toolbar-btn="true">
        <span style="color: var(--theme-color);font-weight: bold;">{{ editor.storage.characterCount.characters()}}</span>
        <span>&nbsp;/&nbsp;{{ characterCount }}</span>
    </button>
    
    <!-- 自定义行高会段落冲突，暂时注释 -->
    <!-- <ParagraphUI></ParagraphUI> -->
</div>
</template>

<script lang="ts" setup name="Toolkit">
import { NIcon,NTooltip } from 'naive-ui'
import { ContentView32Regular } from '@vicons/fluent'
import { Editor } from '@tiptap/core';
// import { useToolsStore } from '@/store/tools'
// 段落
import ParagraphUI from './paragraph/index.vue';
import ErrorImage from "../icons/error-image.svg"; 

const emits = defineEmits(['onUploadImageCallBack'])
const props = defineProps({
    characterCount: {
        type:Number,
        default: 10000
    },
    editor: {
      type: Editor,
      required: true,
    },
    customImageUpload: {
        type: Boolean,
        default: false
    },
})

// const toolsStore = useToolsStore()

interface CusIconType {
    componentProps: Object,
    component: Object
}

const cusComponentIcon = computed(() => {
    const extensions = props.editor.extensionManager.extensions
    const tiptapExtensions = extensions.reduce<CusIconType[]>((pre, cur) => {
        const { onClick } = cur.options;
        if (typeof onClick !== 'function') return pre;
        const extensionData = onClick({ editor: props.editor, extension: cur });
        return Array.isArray(extensionData)
        ? [...pre, ...extensionData]
        : [...pre, extensionData];
    },[]);
    return tiptapExtensions
})

const onUploadImageCallBack = (file: FileList|string) => {
    emits('onUploadImageCallBack', file)
}

const closeContents = () => {
//    toolsStore.updateIsShowContents()   
}

</script>