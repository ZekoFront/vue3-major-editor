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
        <NIcon size="21" title="删除" style="cursor: pointer;">
            <Delete20Regular></Delete20Regular>
        </NIcon>
    </div>
</FloatingMenu>
</div>
</template>
<script setup lang="ts" name="ImageBubbleMenu">
import { FloatingMenu } from "@tiptap/vue-3/menus";
import { NIcon } from "naive-ui";
import { Delete20Regular } from "@vicons/fluent"
import { Editor } from "@tiptap/core";
import { nodeViewProps } from "@tiptap/vue-3";

const props = defineProps({ 
    editor: {
        type: Editor,
        required: true,
    },
    node: nodeViewProps['node'],
    isShow: Boolean
 });

const shouldShowBubbleMenuImage = (val:any) => {
    if (val.state) {
        const { from, to } = val.state.selection;
        return (from !== to) && val.editor.isActive('image')
    }
    return false
};

</script>