import type { Editor } from '@tiptap/vue-3'
import TiptapItalic from '@tiptap/extension-italic'
import ButtonIcon from '../components/ButtonIcon.vue'

const Italic = TiptapItalic.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive('italic'),
                        isReadonly: !editor.isEditable,
                        icons: 'italic-icon',
                        shortcutKeys: 'Ctrl+I',
                        tipText: '斜体',
                        command: () => {
                            editor.commands.toggleItalic()
                        }
                    }
                }
            }
        }
    },
})


export { Italic }