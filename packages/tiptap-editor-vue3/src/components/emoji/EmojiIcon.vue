<template>
<NPopover content-class="toolbar-emoji-picker__popover" ref="npopoverCLRef" style="width: 300px;background: transparent;" :on-update:show="onUpdatePopoverShow" trigger="click" placement="bottom" scrollable>
<template #trigger>
    <NTooltip placement="top" trigger="hover">
        <template #trigger>
            <button class="toolbar-icon--btn" data-editor-toolbar-btn="true">
               <component :is="icons"></component>
            </button>
        </template>
        <span>{{ tipText }}</span>
    </NTooltip>
</template>
<div class="emoji-picker__wrap">
    <EmojiPicker :native="true" display-recent @select="onSelectEmoji"/>
</div>
</NPopover>
</template>
<script setup lang="ts" name="EmojiIcon">
import { Editor } from "@tiptap/vue-3";
import { NTooltip, NPopover } from "naive-ui";
import EmojiPicker, { EmojiExt } from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const npopoverCLRef = ref<InstanceType<typeof NPopover> | null>(null)
const props = defineProps({
    editor: {
      type: Editor,
      required: true,
    },
    tipText: {
        type: String,
        default: '暂无提示'
    },
    icons: {
      type: String,
      default: ''
    },
})

function onSelectEmoji(emoji:EmojiExt) {
    props.editor.commands.insertContent(emoji.i)
}

const onUpdatePopoverShow = (value: boolean):void => {
    // console.log('value:', value)
}
</script>

<style lang="scss">
.toolbar-emoji-picker__popover {
    &.n-popover__content {
        padding: 0px !important;
    }
    .v3-emoji-picker {
        margin: 0px !important;
        width: 300px;
    }
}
</style>