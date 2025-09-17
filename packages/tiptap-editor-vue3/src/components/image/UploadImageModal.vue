<template>
<n-modal
    v-model:show="isVisible"
    preset="dialog"
    title="上传图片"
    content="你确认?"
    positive-text="确认"
    negative-text="算了"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick"
>

<template #header>
<div>上传图片</div>
</template>
<div>
    <n-tabs type="line" animated :default-value="tabPane" :on-update:value="onUpdatedTab">
        <n-tab-pane name="link" tab="图片连接">
            <div style="padding: 12px 0px;">
                <n-input v-model:value="imageLink" placeholder="请输入图片连接"/>
            </div>
            <p v-if="!isErrorTip" style="color: var(--red);">{{ tipText }}</p>
        </n-tab-pane>
        <n-tab-pane name="upload" tab="上传图片">
            <div class="list-image-group">
                <div class="list-image-item" v-for="(item, index) in currentImages">
                    <img :src="item" :alt="item">
                    <NIcon class="delete-icon" size="21">
                        <Delete20Regular @click="removeImage(item, index)"></Delete20Regular>
                    </NIcon>
                </div>
            </div>
            <div style="padding: 20px 0px;">
                <input type="file" accept="image/*" @change="onChangeFile" multiple/>
            </div>
        </n-tab-pane>
    </n-tabs>
</div>
<template #action>
<div>
<n-button style="margin-right: 10px;" @click="onNegativeClick">取消</n-button>
<n-button type="primary" @click="onPositiveClick">立即上传图片</n-button>   
</div>
</template>
</n-modal>
</template>
<script setup lang="ts" name="UploadImageModal">
import { NTabs, NTabPane, NModal, NInput, NIcon,NButton } from "naive-ui";
import { useNaiveDiscrete } from "@/hooks/navie-ui";
import { Delete20Regular } from "@vicons/fluent"
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH, readFileDataUrl } from "@/utils";
import { Editor } from "@tiptap/core";

interface TranserType {
    file:FileList, 
    formData:FormData
}

const props = defineProps({
    editor: {
        type: Editor,
        required: true,
    },
    urlPattern: {
        type:RegExp,
        required: true,
    },
    // true：自定义上传图片，false默认上传图片
    customFileUpload: {
        type: Boolean,
        default: false
    },
})
const { message, dialog, modal } = useNaiveDiscrete();

const imageLink = ref('')
const isVisible = ref(false);
const isErrorTip = ref(true)
const tipText = ref('图片地址格式错误，请重新输入正确图片地址')
const tabPane = ref('link')
const currentImages = ref<string[]>([])
const fileList = ref<FileList>({ length: 0, item: (index) => null })
const imagesTemp:Ref<TranserType> = ref({
    file: new DataTransfer().files,
    formData: new FormData()
})

const emits = defineEmits(['onUploadImageCallBack'])

const onUpdatedTab = (val: string) => {
    tabPane.value = val
    if (val === 'link') {
        // editor.commands.setImage({ src: imageLink.value });
    }
}

const onNegativeClick = () => {
    message.success("Cancel");
    isVisible.value = false;
}

const onPositiveClick = () => {
    if (tabPane.value === 'link') {
        // 校验图片链接是否有效
        const reg = isErrorTip.value = props.urlPattern?.test(imageLink.value)
        if (!reg) {
            message.error(tipText.value);
            return
        }

        if (props.customFileUpload) {
            emits('onUploadImageCallBack', imageLink.value)
        } else {
            props.editor.commands.setImage({
                src: imageLink.value,
                alt: '',
                title: '',
                height: DEFAULT_IMAGE_HEIGHT,
                width: DEFAULT_IMAGE_WIDTH
            })
        }
    } else {
        const formData = new FormData()
        if (!fileList.value) return

        for (let i = 0; i < fileList.value.length; i++) {
            formData.append('file', fileList.value[i])
            if (!props.customFileUpload) {
                innerUploadImage(fileList.value[i])
            }
        }
        
        if (props.customFileUpload) {
            emits('onUploadImageCallBack', fileList.value)
        }
    }

    isVisible.value = false;
}

const onChangeFile = (evt: Event) => {
    const input = evt.target as HTMLInputElement;
    const files = input.files as FileList;
    fileList.value = files
    currentImages.value = []
    for (let i = 0; i < files.length; i++) {
        const ImageUrl = URL.createObjectURL(files[i])
        currentImages.value.push(ImageUrl)
        // innerUploadImage(files[i])
    }
}

const removeImage = (item:string, index:number) => {
    currentImages.value.splice(index, 1)
}

const innerUploadImage = async (file:File) => {
    const image = await readFileDataUrl(file)
    props.editor.commands.setImage({
        src: image,
        alt: '占位图片',
        title: file.name,
        height: DEFAULT_IMAGE_HEIGHT,
        width: DEFAULT_IMAGE_WIDTH
    })
}

const initialize = () => {
    currentImages.value.length = 0
    fileList.value = { length: 0, item: (index) => null }
    imageLink.value = ""
    isVisible.value = true;
};

defineExpose({
    initialize
});
</script>

<style lang="css">
.list-image-group {
    display: flex;
    flex-wrap: wrap;
}
.list-image-group > .list-image-item {
    position: relative;
    width: 130px;
    height: 60px;
    overflow: hidden;
    margin: 0px 10px 10px 0px;
}
.list-image-item > img {
    width: 130px;
    height: 60px;
    /* object-fit: contain; */
}
.list-image-item > .delete-icon {
    position: absolute;
    top: 2px;
    right: 3px;
    color: red;
    cursor: pointer;
}
</style>
