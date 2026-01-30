<template>
    <div class="app_wrapper">
        <section class="cus-header">
            <h2 class="h2" style="margin-right: 0.2em;">TiptapEditorVue3</h2>
            <a href="https://github.com/qiunanya/vue3-major-editor.git" target="_blank">
                <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle color-fg-default">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
            </a>
            <button style="margin: 0 10px;" @click="getHtml">获取 HTML</button>
            <button style="margin-right:10px;" @click="getJson">获取 Json</button>
            <button style="margin-right:10px;" @click="getText">获取 Text</button>
            <button style="margin-right:10px;" @click="clearText">清空文档</button>
            <button style="margin-right:10px;" @click="setCustomString">自定义字符串</button>
            <button style="margin-right:10px;" @click="previews">预览</button>
        </section>
        <TiptapEditorVue3
            ref="vue3TiptapEditorRef"
            v-model:content="htmlContent" 
            :isEditable="true"
            :extensions="[]"
            :defaultConfig="defaultConfig"
            @onCreated="onCreated"
            @onUpdate="onUpdate"
        >
        </TiptapEditorVue3>
    </div>
    <n-drawer v-model:show="isVisible" :width="800" placement="right">
        <n-drawer-content title="预览" closable>
            <div v-html="previewContent"></div>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
    import { nextTick, onBeforeUnmount, ref } from "vue";
    import { Editor, HTMLVue3TiptapEditorElement, AnyExtension, Bold, Italic } from "tiptap-editor-vue3";
    import { NDrawerContent, NDrawer } from "naive-ui";

    const extensions = ref<AnyExtension[]>([Bold, Italic])
    const isVisible = ref(false)
    const previewContent = ref('')
    const vue3TiptapEditorRef = ref<HTMLVue3TiptapEditorElement | null>(null)
    let editors: Editor;
    const defaultConfig = {
        uploadImage: {
            imageLink: (link: string) => {
                console.log(link, editors, 'imageLink')
                editors.commands.setImage({ src: link })
            },
            customUpload: (file: FileList) => {
                console.log(file, editors, 'customUpload')
                for (let i = 0; i < file.length; i++) {
                    if (file[i]) {
                        setImageOne(file[i])
                    }
                }
            }
        }
    }

    const setImageOne = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            editors.commands.setImage({ src: base64 })
        }
        reader.readAsDataURL(file)
    }

    // 清空文档
    const clearText = () => {
        if (editors) {
            editors.commands.clearContent()
        }
    }

    nextTick(() => {
        // console.log('vue3TiptapEditorRef:', vue3TiptapEditorRef.value)
    })
    // <img src='https://placehold.co/800x400'/>
    const htmlContent = ref(`<h2 id="H2-5f9571ca-c94a-4c04-ba98-80f41ed698f6"><span data-type="emoji" data-name="3rd">🥉</span>vue3-tiptap-editor</h2><p>vue3-tiptap-editor是基于最新tiptap框架开发的vue3富文本组件，非法内容过滤以及防止XSS攻击、插入图片、插入表格等功能。</p><h2 id="H2-b46bb0d0-ed0f-4e51-b011-0c8f8603ddd6"><br><span data-type="emoji" data-name="sports_medal">🏅</span>安装&amp;配置11</h2><blockquote><p>pnpm add tiptap-editor-vue3</p><p>-or-</p><p>npm install tiptap-editor-vue3</p></blockquote><pre><code class="language-javascript">import { createApp } from "vue";
import App from "./App.vue";
// 引入组件
import TiptapEditorVue3 from "tiptap-editor-vue3";
import "tiptap-editor-vue3/dist/css/style.css";

const app = createApp(App)
app.use(TiptapEditorVue3)
app.mount("#app")</code></pre><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><p></p><h2 id="H2-44c3d9f5-5754-40a2-b2cd-839b47e5c425">防核辐射的反对66</h2><p><br></p>`)

    function getHtml() {
        if (editors) {
            console.log('HTML:',editors.getHTML());
        }
    }
    function getJson() {
        if (editors) {
            console.log('JSON:',editors.getJSON());
        }
    }
    function getText() {
        if (editors) {
            console.log('TEXT:',editors.getText());
        }
    }
    function previews() {
        if (!editors) return
        previewContent.value = editors.getHTML()
        isVisible.value = !isVisible.value
    }

    const onCreated = (editor:Editor) => {
        editors = editor as Editor
    }

    const onUpdate = (val:Editor) => {
        // console.log("update:",val.getHTML())
        // console.log("update")
    }

    const setCustomString = () => {
        if (editors) {
            editors.commands.insertContent('${setCustomString}')
        }
    }

    onBeforeUnmount(() => {
        editors.destroy()
        vue3TiptapEditorRef.value&&vue3TiptapEditorRef.value.destroy()
    })
</script>

<style lang="scss">
.n-dialog.n-modal {
    width: 600px;
}
.app_wrapper {
    padding:15px;
    margin: 0;
    height: 100vh;
    box-sizing: border-box;
    .h2 {
        margin: 5px 0;
        color: #646cff;
    }
    .cus-header {
        display: flex;
        align-items: center;
    }
}
.vue3-tiptap-editor {
    height: calc(100vh - 99px) !important;
}
</style>