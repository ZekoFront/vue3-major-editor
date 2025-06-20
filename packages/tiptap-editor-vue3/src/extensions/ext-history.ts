import type { Editor } from '@tiptap/vue-3'
import TiptapHistory from '@tiptap/extension-history'
import ButtonIcon from '../components/ButtonIcon.vue'

const ExtensionHistory = TiptapHistory.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            onClick: ({ editor }:{editor:Editor}) => {
                return [
                    {
                        component: ButtonIcon,
                        componentProps: {
                            isActive: editor && editor.can().chain().focus().redo().run() || false,
                            isReadonly: !editor.isEditable,
                            icons: 'redo-icon',
                            tipText: '重做',
                            shortcutKeys: 'Ctrl+Z',
                            command: () => {
                                editor.commands.redo()
                            }
                        }
                    },
                    {
                        component: ButtonIcon,
                        componentProps: {
                            isActive: editor && editor.can().chain().focus().undo().run() || false,
                            isReadonly: !editor.isEditable,
                            icons: 'undo-icon',
                            tipText: '撤销',
                            shortcutKeys: 'Ctrl+Shift+Z',
                            command: () => {
                                editor.commands.undo()
                            }
                        }
                    }
                ]
            }
        }
    },
})


export { ExtensionHistory }