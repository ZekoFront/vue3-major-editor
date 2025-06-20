import type { Editor } from '@tiptap/vue-3'
import TiptapUnderline from '@tiptap/extension-underline'
import ButtonIcon from '../components/ButtonIcon.vue'

const ExtensionUnderline = TiptapUnderline.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive('underline'),
                        isReadonly: !editor.isEditable,
                        icons: 'underline-icon',
                        tipText: '下划线',
                        shortcutKeys: 'Ctrl+U',
                        command: () => {
                            editor.commands.toggleUnderline()
                        }
                    }
                }
            }
        }
    },
})


export { ExtensionUnderline }