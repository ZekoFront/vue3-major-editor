<template>
    <div v-if="editor" :class="['vue3-tiptap-editor major-editor', editorWrapperClass]">
        <!-- <button @click="selectText">选择文本</button> -->
        <Toolkit
            v-if="isShowToolbar" 
            :class="[editorToolkitClass]" 
            :editor="editor" 
            :characterCount="characterCount"
            :headingLevel="headingLevel"
            :defaultConfig="defaultConfig"
            @onIsShowContent="onIsShowContent"/>
        <drag-handle :editor="editor">
            <div class="custom-drag-handle"></div>
        </drag-handle>    
        <div class="tiptap-editor__body">
            <EditorContent :class="['tiptap-editor__content', editorContentClass]" :editor="editor" @contextmenu="onContextmenu"></EditorContent>
            <ContentsNav v-if="isEnabledContent" :class="['tiptap-editor__navigation', editorContentsNavClass]" :editor="editor" v-model:isShowContent="isShowContent"></ContentsNav>
        </div>
        <BubbleMenus :editor="editor"></BubbleMenus>
        <ContextMenus :editor="editor" ref="contextMenuRef"></ContextMenus>
    </div>
</template>

<script setup lang="ts" name="EditorTiptapVue3">
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { AnyExtension, Editor, EditorContent } from '@tiptap/vue-3'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import StarterKit from "@tiptap/starter-kit";
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3'
import NodeRange from '@tiptap/extension-node-range'
// 顶部工具
import Toolkit from "./components/Toolkit.vue";
// 菜单
import BubbleMenus from "@/components/bubble-menu/index.vue";
import { useContextMenu } from "@/hooks/useContextMenu";
import ContextMenus from "./components/table/ContextMenu.vue";
import ContentsNav from "./components/layout/Contents.vue";

// import { useSelectionStore } from '@/store/selection';
// 自定义扩展
import { extensionsArray } from './extensions';

// 过滤编辑器类容，防止xss攻击, 生产环境
import DOMPurify from 'dompurify';
import { Slice } from '@tiptap/pm/model'
import { EditorView } from '@tiptap/pm/view'

const contents = defineModel<string>("content", {
    default: "",
    required: false,
});

// props
const props = defineProps({
    defaultConfig: {
        type: Object,
        default: null
    },
    extensions: {
        type: Array<AnyExtension>,
        default: []
    },
    isEditable: {
        type: Boolean,
        default: true
    },
    isShowToolbar: {
        type: Boolean,
        default: true
    },
    isEnabledContent: {
        type: Boolean,
        default: true
    },
    characterCount: {
        type: Number|| String,
        default: 10000
    },
    placeholder: {
        type: String,
        default: '请输入内容...'
    },
    editorWrapperClass: {
      type: [String, Array, Object],
      default: undefined,
    },
    editorToolkitClass: {
      type: [String, Array, Object],
      default: undefined,
    },
    editorContentClass: {
        type: [String],
        default: "custom-tiptap-content",
    },
    editorContentsNavClass: {
        type: [String, Array, Object],
        default: undefined,
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

const isShowContent = ref<boolean>(true)
const headingLevel = ref<number>(7)

const extensionSet = props.extensions.length?props.extensions:extensionsArray;
// TaskList任务插件需要直接注入，如果扩展后任务插件，新增内容将会报错2025-9-19
const editor = new Editor({
    editorProps: {
        attributes: {
            spellcheck: 'false',
            class: props.editorContentClass
        },
        // 自定义处理粘贴图片功能
        handlePaste: (view, event, slice) => onHandlePaste(view, event, slice),
        // 自定义处理拖放图片功能
        handleDrop: (view, event, slice, moved) => onHandleDrop(view, event, slice, moved),
    },
    extensions: [
        Document, 
        Paragraph, 
        Text,
        TaskList,
        TaskItem,
        NodeRange.configure({
          key: null,
        }),
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
            link: false,
            document: false,
            text: false,
            paragraph: false,
            heading: false
        }),
        CharacterCount.configure({
          limit: props.characterCount,
        }),
        Placeholder.configure({
            placeholder: props.placeholder,
        })
    ],
    content: DOMPurify.sanitize(contents.value),
    editable: props.isEditable,
    onCreate({editor}) {
        const currentContent = editor.getHTML();
        const newContent = currentContent + '<p><br></p>';
        editor.commands.setContent(newContent, {
            emitUpdate: true
        });
        emits('onCreated', editor)
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
    },
    onPaste(event: ClipboardEvent, slice: Slice) {
        // The editor is being pasted into.
    }
})

const { contextMenuRef, onContextmenu } = useContextMenu(editor)

const selectText = () => {
    //  const is = editor.commands.setTextSelection({ from: 2, to: 13 })
    //  editor.commands.focus();
    // editor.commands.insertContent('<h1>Example Text</h1>')
    editor
    .chain()
    .focus()
    .insertContent(
        '<ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p>New Task</p></li></ul>'
    )
    .run();
}

const onHandlePaste = (view: EditorView, event: ClipboardEvent, slice: Slice) => {
    const files = Array.from(event.clipboardData?.files || [])
    const images = files.filter(file => file.type.startsWith('image/'))

    if (images.length === 0) return false

    event.preventDefault()

    const customUpload = props.defaultConfig?.uploadImage?.customUpload
    if (typeof customUpload === 'function') {
        customUpload(files)
    } else {
        const promises = images.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = (e) => resolve(e.target?.result as string)
                reader.readAsDataURL(file)
            })
        })

        Promise.all(promises).then(srcs => {
            let tr = view.state.tr
            let pos = tr.selection.from 

            srcs.forEach(src => {
                const node = view.state.schema.nodes.image.create({ src })
                tr = tr.insert(pos, node)
                pos += node.nodeSize 
            })
            
            view.dispatch(tr)
        })
    }
    
    return false
}

const onHandleDrop = (view: EditorView, event: DragEvent, slice: Slice, moved: boolean) => {
    const hasFiles = event.dataTransfer?.files?.length
    if (moved || !hasFiles) {
        return false
    }
    const images = Array.from(event.dataTransfer.files).filter(file => /image/i.test(file.type))
    if (images.length === 0) {
        return false
    }

    event.preventDefault()

    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
    
    if (!coordinates) return false

    const customUpload = props.defaultConfig?.uploadImage?.customUpload
    if (typeof customUpload === 'function') {
        customUpload(event.dataTransfer?.files)
    } else {
        const promises = images.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = (e) => resolve(e.target?.result as string)
                reader.readAsDataURL(file)
            })
        })

        Promise.all(promises).then(srcs => {
            insertImagesAtPos(view, srcs, coordinates.pos)
        })
    }

    return false
}

function insertImagesAtPos(view: any, imageUrls: string[], pos: number) {
    if (!imageUrls || imageUrls.length === 0) return

    let tr = view.state.tr
    
    // 记录当前插入位置，随着图片插入不断后移
    let currentPos = pos

    imageUrls.forEach(src => {
        const node = view.state.schema.nodes.image.create({ src })
        tr = tr.insert(currentPos, node)
        // 更新下一次插入的位置（当前位置 + 新节点的尺寸）
        currentPos += node.nodeSize
    })

    // 可选：插入后将光标移动到最后一张图片后面，方便用户继续输入
    // tr = tr.setSelection(TextSelection.create(tr.doc, currentPos))

    view.dispatch(tr)
}

// 获取标题类型
function detectHeadingType (editor:Editor) {
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const nodeData = editor.state.doc.nodeAt(selection.from);
    let node = $from.node();
    // 检查当前节点是否为标题
    if (node &&['heading'].includes(node.type.name)) {
        headingLevel.value = Number(node.attrs.level)
    } else {
        let depth = $from.depth;
        while (depth > 0) {
            const parentNode = $from.node(depth);
            if (parentNode &&['heading'].includes(parentNode.type.name)) {
                headingLevel.value = Number(node.attrs.level)
                break;
            } else {
                headingLevel.value = 7
            }
            depth--;
        }
    }
}

const onIsShowContent = (val:boolean) => {
    isShowContent.value = !isShowContent.value
}

// expose
defineExpose({
    getHTML: () => DOMPurify.sanitize(editor.getHTML()),
    getJSON:() => editor.getJSON(),
    getTEXT: () => editor.getText(),
    destroy: () => editor && editor.destroy()
})

onBeforeUnmount (() => {
    editor.destroy()
})
</script>

<style lang="css" src="./style/index.css"></style>