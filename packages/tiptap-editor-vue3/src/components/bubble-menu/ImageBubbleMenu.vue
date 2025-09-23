<template>
<div v-if="editor">
<FloatingMenu
    :editor="editor"
    :options="{
        flip:true,
        arrow: true,
        placement: 'bottom'
    }"
    :should-show="shouldShowBubbleMenuImage">
    <div :class="['editor-image-bubble--menu',{ 'active': isShow }]">
        <NIcon class="bubble-icon-item" size="21" title="删除">
            <Delete20Regular @click="deleteImage"></Delete20Regular>
        </NIcon>
        <NIcon class="bubble-icon-item" size="21" title="内联元素">
            <ResizeSmall16Regular @click="handleFloat(ImageDisplay.INLINE)"/>
        </NIcon>
        <NIcon class="bubble-icon-item" size="21" title="块元素">
            <Square16Regular @click="handleFloat(ImageDisplay.BREAK_TEXT)"/>
        </NIcon>
        <NIcon class="bubble-icon-item" size="21" title="左浮动">
            <AlignLeft16Regular @click="handleFloat(ImageDisplay.FLOAT_LEFT)"/>
        </NIcon>
        <NIcon class="bubble-icon-item" size="21" title="右浮动">
            <AlignRight16Regular @click="handleFloat(ImageDisplay.FLOAT_RIGHT)"/>
        </NIcon>
    </div>
</FloatingMenu>
</div>
</template>
<script setup lang="ts" name="ImageBubbleMenu">
import { FloatingMenu } from "@tiptap/vue-3/menus";
import { NIcon } from "naive-ui";
import { AlignLeft16Regular, AlignRight16Regular, Delete20Regular, ResizeSmall16Regular, Square16Regular } from "@vicons/fluent"
import { Editor } from "@tiptap/core";
import { nodeViewProps } from "@tiptap/vue-3";
import { ImageDisplay } from '@/utils'

const props = defineProps({ 
    editor: {
        type: Editor,
        required: true,
    },
    node: nodeViewProps['node'],
    updateAttrs: nodeViewProps['updateAttributes'],
    isShow: Boolean
 });

const shouldShowBubbleMenuImage = (val:any) => {
    if (val.state) {
        const { from, to } = val.state.selection;
        return (from !== to) && val.editor.isActive('image')
    }
    return false
}

const handleFloat = (val: string) => {
   props.updateAttrs({
    display: val
   })
}

const deleteImage = () => {
    // https://tiptap.dev/docs/editor/api/commands/selection/delete-selection
    // deleteSelection 命令将定位并删除编辑器中当前选择的任何节点或内容
    props.editor.commands.deleteSelection()
}

</script>