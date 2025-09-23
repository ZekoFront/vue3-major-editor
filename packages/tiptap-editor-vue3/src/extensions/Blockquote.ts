import type { Editor } from '@tiptap/vue-3'
import TiptapBlockquote from '@tiptap/extension-blockquote'
import ButtonIcon from '../components/ButtonIcon.vue'

const Blockquote = TiptapBlockquote.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive('blockquote'),
                        isReadonly: !editor.isEditable,
                        icons: 'blockquote-icon',
                        tipText: '引用',
                        command: () => {
                            editor.commands.toggleBlockquote()
                        }
                    }
                }
            }
        }
    },
})


export { Blockquote }