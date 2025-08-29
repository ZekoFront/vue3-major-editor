<template>
<div v-if="editor">
<FloatingMenu
    :editor="editor"
    :options="{
        flip:true,
        arrow: true,
        placement: 'top'
    }"
    :should-show="shouldShowBubbleMenuImage">
    <div class="editor-inner-bubble--menu">
        <NTooltip placement="bottom" trigger="hover">
            <template #trigger>
                <NIcon size="21">
                    <Delete20Regular></Delete20Regular>
                </NIcon>
            </template>
            <span>删除链接</span>
        </NTooltip>
    </div>
</FloatingMenu>
</div>
</template>
<script setup lang="ts" name="ImageMenu">
import { Editor } from "@tiptap/vue-3";
import { FloatingMenu } from "@tiptap/vue-3/menus";
import { NTooltip,NIcon } from "naive-ui";
import { inject } from "vue";
import { Delete20Regular } from "@vicons/fluent"

const editor:Editor = inject('editor') as Editor

const shouldShowBubbleMenuImage = (val:any) => {
    if (val.state) {
        const { from, to } = val.state.selection;
        return (from !== to) && val.editor.isActive('customizeImage')
    }
    return false
};

</script>