<template>
    <!-- <button @click="selectText">选择文本</button> -->
    <div class="vue3-tiptap-editor major-editor">
        <Toolkit :editor="editor" v-if="isShowToolbar" :customFileUpload="customFileUpload" :characterCount="characterCount" @onUploadImageCallBack="onUploadImageCallBack"></Toolkit>
        <div class="tiptap-editor__body">
            <EditorContent class="tiptap-editor__content" :editor="editor" @contextmenu="onContextmenu"></EditorContent>
            <ContentsNav class="tiptap-editor__navigation"></ContentsNav>
        </div>
        <BubbleMenus :editor="editor"></BubbleMenus>
        <ContextMenus ref="contextMenuRef"></ContextMenus>
    </div>
</template>

<script setup lang="ts" name="EditorTiptapVue3">
import { provide, watch } from "vue";
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent, AnyExtension } from "@tiptap/vue-3";
// 顶部工具
import Toolkit from "./components/Toolkit.vue";
// 菜单
import BubbleMenus from "@/components/bubble-menu/index.vue";
import { useEventListener } from "@/hooks/useEventListener";
import { useContextMenu } from "@/hooks/useContextMenu";
import ContextMenus from "./components/table/ContextMenu.vue";
import ContentsNav from "./components/layout/Contents.vue";

import { useSelectionStore } from '@/store/selection';
// 自定义扩展
import { extensionsArray } from './extensions';

// 过滤编辑器类容，防止xss攻击, 生产环境
import DOMPurify from 'dompurify';
import { useToolsStore } from "./store/tools";

const contents = defineModel<string>("content", {
    default: "",
    required: false,
});

// props
const props = defineProps({
    extensions: {
        type: Array<AnyExtension>,
        default: []
    },
    isEnable: {
        type: Boolean,
        default: true
    },
    isShowToolbar: {
        type: Boolean,
        default: true
    },
    customFileUpload: {
        type: Boolean,
        default: false
    },
    characterCount: {
        type: Number|| String,
        default: 10000
    },
    placeholder: {
        type: String,
        default: '请输入内容...'
    }
})

// emit
const emits = defineEmits([
    "onCreated",
    "onUpdate",
    "onSelectionUpdate",
    "onFocused",
    "onBlur",
    "onDestroyed",
    "onUploadImage",
    "update:content"
]);

const extensionSet = props.extensions.length?props.extensions:extensionsArray;

const editor:Editor = new Editor({
    content: DOMPurify.sanitize(contents.value),
    editable: props.isEnable,
    extensions: [
        ...extensionSet,
        StarterKit.configure({
            bold: false,
            italic: false,
            strike: false,
            code: false,
            codeBlock: false,
            orderedList: false,
            bulletList: false,
            horizontalRule: false,
            blockquote: false,
            underline: false,
            undoRedo: false,
            link: false
        }),
        CharacterCount.configure({
          limit: props.characterCount,
        }),
        Placeholder.configure({
            placeholder: props.placeholder,
        })
    ],
    onCreate({editor}) {
        const currentContent = editor.getHTML();
        const newContent = currentContent + '<p><br></p>';
        editor.commands.setContent(newContent, {
            emitUpdate: true
        });
    },
    onUpdate ({editor}) {
        emits('onUpdate', editor)
        const cleanHtml = DOMPurify.sanitize(editor.getHTML());
        emits('update:content', cleanHtml);
    },
    onFocus ({ editor }) {
        // console.log(editor, 999)
    },
    onSelectionUpdate ({ editor, transaction }) {
        detectHeadingType(editor as Editor)
    }
});

const selectionStore = useSelectionStore()
const toolsStore = useToolsStore()

// const selectText = () => {
//  const is = editor.commands.setTextSelection({ from: 2, to: 13 })
//  editor.commands.focus();
//  console.log(is, 6666)
// }

// 获取标题类型
function detectHeadingType (editor:Editor) {
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const nodeData = editor.state.doc.nodeAt(selection.from);
    let node = $from.node();

    selectionStore.updateSelectTion({
        from: selection.from,
        to: selection.to,
        typeName:nodeData?.type.name||""
    })
   
    // 检查当前节点是否为标题
    if (node &&['extensionHeading','heading'].includes(node.type.name)) {
        toolsStore.updateHeadingLevel(node.attrs.level)
        toolsStore.updateHeadingContent(node.textContent)
    } else {
        let depth = $from.depth;
        while (depth > 0) {
            const parentNode = $from.node(depth);
            if (parentNode &&['extensionHeading','heading'].includes(parentNode.type.name)) {
                toolsStore.updateHeadingLevel(parentNode.attrs.level)
                toolsStore.updateHeadingContent(parentNode.textContent)
                break;
            }
            depth--;
        }
    }
}

//@ts-ignore
useEventListener(editor)
//@ts-ignore
const {contextMenuRef, onContextmenu} = useContextMenu(editor)

// 实时更新内容
watch(contents,(n,o) => {
    const isSame = editor.getHTML() === contents.value
    if (isSame) return
    editor.commands.setContent(n, {
            emitUpdate: true
        });
}, { deep: true })

const onUploadImageCallBack = (file: FileList|string) => {
    emits('onUploadImage', { file, editor })
}

provide("editor", editor)
provide('props', props)

// expose
defineExpose({
    getHTML: () => DOMPurify.sanitize(editor.getHTML()),
    getJSON:() => editor.getJSON(),
    getTEXT: () => editor.getText(),
    destroy: () => editor && editor.destroy(),
    editor: editor
})

</script>

<style lang="css" src="./style/index.css"></style>