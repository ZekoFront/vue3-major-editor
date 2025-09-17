import type { Editor } from '@tiptap/vue-3'
import { OrderedList as TiptapOrderedList } from '@tiptap/extension-list'
import ButtonIcon from '../components/ButtonIcon.vue'

const OrderedList = TiptapOrderedList.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive('orderedList'),
                        isReadonly: !editor.isEditable,
                        icons: 'ordered-list-icon',
                        tipText: '有序列表',
                        command: () => {
                            editor.commands.toggleOrderedList()
                        }
                    }
                }
            }
        }
    },
})


export { OrderedList }