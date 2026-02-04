import { AsyncComponentLoader, defineAsyncComponent } from "vue"

const components = import.meta.glob('./*.svg');

export default function install(app: any) {
    for (const [key, value] of Object.entries(components)) {
        const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
        app.component(name, defineAsyncComponent(value as AsyncComponentLoader));
    }
}

export { default as EmojiIcon } from './emoji-icon.svg'
export { default as BackgroundColorIcon } from './background-color-icon.svg'
export { default as AddImageIcon } from './add-image-icon.svg'
export { default as TableIcon } from './table-icon.svg'

 