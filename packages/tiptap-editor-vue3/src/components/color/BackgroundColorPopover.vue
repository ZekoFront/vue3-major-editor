<template>
<n-popover trigger="click" placement="bottom" content-class="toolbar-color-picker__popover" style="max-height: 270px;max-width: 300px;">
<template #trigger>
    <n-tooltip placement="top" trigger="hover">
        <template #trigger>
            <button class="toolbar-icon--btn" @click="showPopover = !showPopover">
                <svg viewBox="0 0 1024 1024" width="200" height="200">
                    <path d="M0 0m56.888889 0l910.222222 0q56.888889 0 56.888889 56.888889l0 910.222222q0 56.888889-56.888889 56.888889l-910.222222 0q-56.888889 0-56.888889-56.888889l0-910.222222q0-56.888889 56.888889-56.888889Z" fill="#05AFC8"></path>
                    <path d="M284.444444 853.333333H227.555556L483.555556 170.666667h56.888888L284.444444 853.333333z" fill="#FFFFFF"></path>
                    <path d="M540.444444 170.666667h-56.888888L739.555556 853.333333h56.888888L540.444444 170.666667z" fill="#FFFFFF"></path>
                    <path d="M341.333333 625.777778h341.333334v56.888889H341.333333z" fill="#FFFFFF"></path>
                </svg>
            </button>
        </template>
        <span>{{ tipText }}</span>
    </n-tooltip>
</template>
<div class="color-picker__wrap">
    <p class="color-picker-name flex-wrap">
        <span>颜色面板</span>
        <button class="color-default__button" @click.stop="handlebgColorPicker('')">恢复默认1</button>
    </p>
    
    <div class="color-picker-list">
        <span 
            class="color-list-item" 
            v-for="(item, index) in colors" 
            :key="index" 
            :style="{background: item}"
            @click.stop="handlebgColorPicker(item)">
        </span>
        <span class="color-list-item disabled-icon" @click.stop="handlebgColorPicker('')">
            <component is="disabled-icon"></component>
        </span>
    </div>
    <p class="color-picker-name">颜色选择器</p>
    <n-color-picker v-model:value="selectColor" :on-update:value="colorPickerUpdate" :swatches="[
        '#FFFFFF',
        '#18A058',
        '#2080F0',
        '#F0A020',
        'rgba(208, 48, 80, 1)',
        ]" :show-alpha="true" />
</div>
</n-popover>
</template>
<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import { NTooltip, NPopover, NColorPicker } from "naive-ui";
defineOptions({ name: 'BackgroundColorPopover', inheritAttrs: false })

const npopoverCLRef = ref<InstanceType<typeof NPopover> | null>(null)
    
const { editor } = defineProps({
    editor: {
      type: Editor,
      required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isReadonly: {
        type: Boolean,
        default: false,
    },
    colors: {
        type: Array<string>,
        default: []
    },
    tipText: {
        type: String,
        default: '暂无提示'
    }
})

const showPopover = ref(false)

const selectColor = ref('#94ddde')
const colorPickerUpdate = (value: string):void => {
    selectColor.value = value
    editor.commands.setBackgroundColor(value)
}

const handlebgColorPicker = (color: string) => {
    if (color) editor.commands.setBackgroundColor(color)
    else {
        editor.commands.unsetBackgroundColor()
    }
   
    if (!npopoverCLRef.value) return 
    npopoverCLRef.value.setShow(false)
}
</script>

<style lang="scss" scoped>
.toolbar-color-picker__popover {
    .flex-wrap {
        display: flex;
        justify-content: space-between;
    }
    .color-picker__wrap {
        .color-picker-name {
            margin: 5px 0;
        }
        .color-picker__input {
            border: none;
            border-radius: 4px;
        }
        .color-default__button {
            // height: 27px;
            background-color: #f0f0f0;
            border: none;
            color: #18a058;
            border-radius: 4px;
        }
        .color-picker-list {
            display: flex;
            flex-wrap: wrap;
            .color-list-item {
                width: 25px;
                height: 25px;
                margin: 2px;
                border-radius: 0.2rem;
                &.disabled-icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #eee;
                    color: #ff4500;
                }
            }
        }
    }
}
</style>