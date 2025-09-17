import type { Editor } from '@tiptap/vue-3'
import Emoji from '@tiptap/extension-emoji'
import EmojiIcon from '@/components/emoji/EmojiIcon.vue'

const Emojis = Emoji.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            bubble: true,
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: EmojiIcon,
                    componentProps: {
                        isActive: editor.isActive('bold'),
                        isReadonly: !editor.isEditable,
                        icons: 'emoji-icon',
                        tipText: '表情',
                        shortcutKeys: 'Ctrl+B',
                        editor: editor,
                        command: () => {
                            editor.commands.toggleBold()
                        }
                    }
                }
            }
        }
    },
})


export { Emojis }