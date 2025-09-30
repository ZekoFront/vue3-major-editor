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
        <NIcon class="bubble-icon-item" size="21" :title="item.title" :color="displayState===item.state?ThemeColor:''" v-for="(item, index) in displayList" :key="item.title+index">
            <component v-if="item.icon" :is="item.icon" @click="handleFloat(item.state)"></component>
            <Delete20Regular v-else @click="deleteImage"></Delete20Regular>
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
import { ImageDisplay, ThemeColor } from '@/utils'

const props = defineProps({ 
    editor: {
        type: Editor,
        required: true,
    },
    node: nodeViewProps['node'],
    updateAttrs: nodeViewProps['updateAttributes'],
    isShow: Boolean
 });

const displayList = ref([
    { title: '删除', state: "del", icon: "" },
    { title: '内联元素', state: ImageDisplay.INLINE, icon: markRaw(ResizeSmall16Regular) },
    { title: '块元素', state: ImageDisplay.BREAK_TEXT, icon: markRaw(Square16Regular) },
    { title: '左浮动', state: ImageDisplay.FLOAT_LEFT, icon: markRaw(AlignLeft16Regular) },
    { title: '右浮动', state: ImageDisplay.FLOAT_RIGHT, icon: markRaw(AlignRight16Regular) },
 ])
const displayState = ref<string>(props.node?.attrs.display)

const shouldShowBubbleMenuImage = (val:any) => {
    if (val.state) {
        const { from, to } = val.state.selection;
        return (from !== to) && val.editor.isActive('image')
    }
    return false
}

const handleFloat = (val: string) => {
    displayState.value = val
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