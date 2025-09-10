<template>
<bubble-menu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShowBubbleMenu">
    <div class="editor-inner-bubble--menu" v-if="isText">
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
            <component is="bold-icon" class="menu-icon"></component>
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
            <component is="italic-icon" class="menu-icon"></component>
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
            <component is="strike-icon" class="menu-icon"></component>
        </button>
        
        <NTooltip placement="bottom" trigger="hover" v-if="editor.isActive('link')">
            <template #trigger>
                <button @click="openLinkUrl" :class="{ 'is-active': editor.isActive('strike') }">
                    <component is="open-link-icon" class="menu-icon"></component>
                </button>
            </template>
            <span>打开链接</span>
        </NTooltip> 
        <NTooltip placement="bottom" trigger="hover" v-if="editor.isActive('link')">
            <template #trigger>
                <button @click="cancelLinkUrl" :class="{ 'is-active': editor.isActive('strike') }">
                    <component is="cancel-link-icon" class="menu-icon"></component>
                </button>
            </template>
            <span>删除链接</span>
        </NTooltip>
    </div>
</bubble-menu>
</template>
<script setup lang="ts" name="ParagraphMenu">
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/vue-3/menus";
import { NTooltip } from "naive-ui";
import { useSelectionStore } from '@/store/selection'

const { editor } = defineProps({
    editor: {
        type: Editor,
        required: true,
    }
})

const selectionStore = useSelectionStore()

const isText = computed(() => {
    return selectionStore.selection?.typeName==="text"
})

// 打开链接
const openLinkUrl = () => {
    const link = editor.getAttributes('link')
    window.open(link.href)
}

// 取消链接
const cancelLinkUrl = () => {
    editor.commands.unsetLink()
}

// 隐藏菜单
const shouldShowBubbleMenu = (val:any) => {
    if (val.state) {
        const { from, to } = val.state.selection;
        // console.log(val.state.selection)
        // return from !== to && !editor.isActive("customize-image")||false
        return (from !== to) && val.editor.isActive('paragraph')
    }
    return true
}

</script>