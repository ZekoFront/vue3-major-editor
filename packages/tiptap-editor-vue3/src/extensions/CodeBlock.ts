import type { Editor } from '@tiptap/vue-3'
import TiptapCodeBlock from '@tiptap/extension-code-block'
import ButtonIcon from '../components/ButtonIcon.vue'

const CodeBlock = TiptapCodeBlock.extend({
    addOptions() {
        return {
            HTMLAttributes: {},
            languageClassPrefix: 'language-',
            // 是否允许按向下键跳出代码块
            exitOnArrowDown: true,
            exitOnTripleEnter: true,
            defaultLanguage: null,
            enableTabIndentation: true,
            tabSize: 4,
            ...this.parent?.(),
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: ButtonIcon,
                    componentProps: {
                        isActive: editor.isActive('codeBlock'),
                        isReadonly: !editor.isEditable,
                        icons: 'code-block-icon',
                        tipText: '代码块',
                        shortcutKeys: 'Ctrl+Alt+C',
                        command: () => {
                            editor.commands.toggleCodeBlock()
                        }
                    }
                }
            }
        }
    },
})


export { CodeBlock }