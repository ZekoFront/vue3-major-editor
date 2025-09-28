## vue3-tiptap-editor 

vue3-tiptap-editor是基于最新tiptap框架开发的vue3富文本组件，非法内容过滤以及防止XSS攻击、插入图片、插入表格等功能。

![](https://raw.githubusercontent.com/qiunanya/vue3-major-editor/main/asset/image/20250923.png)

### 功能清单
- 撤回/重做"
- 清空文档
- 加粗
- 斜体
- 字体背景色和字体颜色
- 下划线
- 删除线
- 代码背景块和代码块
- 引用
- 上标和下标
- 链接
- 有序列表
- 无序列表
- 水平分割线
- 标题
- 段落间距
- 任务列表
- 插入图片
- 插入表格，表格列和行操作
- 表情
- 目录
- 行拖拽
....待开发更多功能....


### 安装
```js
pnpm add tiptap-editor-vue3
-or-
yarn add tiptap-editor-vue3
-or-
npm install tiptap-editor-vue3
```

### 配置说明
```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// 引入组件
import TiptapEditorVue3 from "tiptap-editor-vue3";
import "tiptap-editor-vue3/dist/es/css/style.css";

const app = createApp(App)
app.use(TiptapEditorVue3)
app.use(router)

app.mount("#app")


```
### 使用组件

```vue
<template>
    <div class="app_wrapper">
        <section class="cus-header">
            <h2 class="h2" style="margin-right: 0.2em;">TiptapEditorVue3</h2>
            <button style="margin: 0 10px;" @click="getHtml">获取HTML</button>
            <button style="margin-right:10px;" @click="getJson">获取Json</button>
            <button style="margin-right:10px;" @click="getText">获取Text</button>
            <button style="margin-right:10px;" @click="previews">预览</button>
            <button style="margin-right:10px;" @click="router.go(-1)">返回</button>
        </section>
        <!-- v-model:content="htmlContent" -->
        <TiptapEditorVue3
            ref="vue3TiptapEditorRef" 
            v-model:content="htmlContent" 
            :customImageUpload="customImageUpload"
            :isEditable="true"
            :extensions="extensions"
            :isShowToolbar="true"
            @onUploadImage="onUploadImage">
        </TiptapEditorVue3>

        <n-drawer v-model:show="isVisible" :width="502" placement="right">
            <n-drawer-content title="预览" closable>
                <div v-html="previewContent"></div>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { NDrawerContent, NDrawer } from "naive-ui";
    import { AnyExtension, Editor, Bold, Italic } from "tiptap-editor-vue3"
    import { useRouter } from 'vue-router'

    const router = useRouter();
    // true:不自动转化数据，需要外部处理后添加到编辑器, false: 图片内部处理，默认转化为base64
    const customImageUpload = ref(false)
    const isVisible = ref(false)
    const previewContent = ref('')
    // 自定义工具栏，不需要可以不用传递参数即可显示全部工具栏
    const extensions = ref<AnyExtension[]>([Bold, Italic])
    // 按需引入Button组件
    // import { Button } from '@majoreditor/ui'

    interface Vue3TiptapEditorOptions {
        getHTML: () => string
        getJSON: () => object
        getTEXT: () => string
    }

    const vue3TiptapEditorRef = ref<Vue3TiptapEditorOptions | null>(null)
    const htmlContent = ref(`
        <p>欢迎使用vue3-tiptap-editor编辑器 🎉</p>欢迎订阅交流,
        <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>
        <a href="https://www.baidu.con">66666</a>`)

    interface FileOpions {
        file: FileList
        editor: Editor
    }

    // 仅支持base64和URL两种模式
    const onUploadImage = ({ file, editor }:FileOpions) => {
        console.log(editor, 3333)
        const formData = new FormData()
        // 此处可以自定义上传图片逻辑，这里需要调用 editor.commands.insertCustomImage 来插入图片
        for (let i = 0; i < file.length; i++) {
            if (file[i]) {
                formData.append('file', file[i])
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target?.result as string;
                    const image = new Image()
                    image.src = base64
                    image.onload = () => {
                        // 图片加载完成后再插入，记得传入图片宽高
                        editor.commands.setImage({ 
                            src: base64, 
                            alt: '占位图片', 
                            width: image.width, 
                            height: image.height,
                            title: file[i].name 
                        });
                    }
                    
                    // 监听错误事件
                    image.onerror = () => {
                        console.error('图片加载失败');
                    }
                }

                reader.readAsDataURL(file[i])
            }
        }
    }

    function getHtml() {
        if (vue3TiptapEditorRef.value) {
            console.log(vue3TiptapEditorRef.value.getHTML(), 'HTML');
        }
    }
    function getJson() {
        if (vue3TiptapEditorRef.value) {
            console.log(vue3TiptapEditorRef.value.getJSON(), 'JSON');
        }
    }
    function getText() {
        if (vue3TiptapEditorRef.value) {
            console.log(vue3TiptapEditorRef.value.getTEXT(), 'TEXT');
        }
    }
    function previews() {
        if (!vue3TiptapEditorRef.value) return
        previewContent.value = vue3TiptapEditorRef.value.getHTML()
        isVisible.value = !isVisible.value
    }
</script>
```

### 组件传递参数

| 参数             | 类型    | 描述                                                    |
| ---------------- | ------- | ------------------------------------------------------- |
| isEditable         | boolean | 启用编辑器                                              |
| isShowToolbar    | boolean | 启用工具栏                                              |
| characterCount   | number  | 字数提示                                                |
| customFileUpload | boolean | 自定义上传，开启后通过onUploadImage事件监听上传文件内容 |
| extensions      | AnyExtension[] | 自定义工具栏，比如加粗，倾斜等到                    |
| placeholder      | string  | 输入提示文本                                            |


### 工具栏清单
- History 撤回/重做
- Bold  加粗
- Italic 倾斜
- Strike 删除线
- Underline 下划线
- Highlight 高亮
- Color 颜色
- BackgroundColor 背景颜色
- Heading 标题
- TextAlign 对齐方式
- LineHeight 行高
- Code 代码背景
- CodeBlockLowlight 代码块
- Subscript 上标
- Superscript 下标
- OrderedList 有序列表
- BulletList 无序列表
- HorizontalRule 水平线
- Blockquote 引用
- Table 表格
- Link 链接
- Image 图片
- TaskItem 任务列表
- Clear 清空文档内容
- Emojis 表情
