<template>
<bubble-menu v-if="editor" :editor="editor" :options="{ placement: 'bottom', offset: 8 }">
    <div class="bubble-menu editor-inner-bubble--menu" v-if="editor.isActive('paragraph')">
        <button title="粗体" class="menu-button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
            <component is="bold-icon" class="menu-icon"></component>
        </button>
        <button title="斜体" class="menu-button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
            <component is="italic-icon" class="menu-icon"></component>
        </button>
        <button title="删除线" class="menu-button" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
            <component is="strike-icon" class="menu-icon"></component>
        </button>
        
        <template v-if="editor.isActive('link')">
            <button title="打开链接" class="menu-button" @click="openLinkUrl" :class="{ 'is-active': editor.isActive('strike') }">
                <component is="open-link-icon" class="menu-icon"></component>
            </button>
            <button title="删除链接" class="menu-button" @click="cancelLinkUrl" :class="{ 'is-active': editor.isActive('strike') }">
                <component is="cancel-link-icon" class="menu-icon"></component>
            </button>
        </template>
    </div>
</bubble-menu>
</template>
<script setup lang="ts" name="ParagraphMenu">
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/vue-3/menus";

const { editor } = defineProps({
    editor: {
        type: Editor,
        required: true,
    }
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

</script>