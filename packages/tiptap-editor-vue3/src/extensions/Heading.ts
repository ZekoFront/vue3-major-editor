import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { v4 as uuidV4 } from 'uuid'
import HeadingPopselect from '@/components/text/HeadingPopselect.vue'
import { headerData } from '@/utils'
import { Editor } from '@tiptap/vue-3'

/**
 * The heading level options.
 */
export type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingOptions {
    /**
     * The available heading levels.
     * @default [1, 2, 3, 4, 5, 6]
     * @example [1, 2, 3]
     */
    levels: Level[]
    id?: string
    /**
     * The HTML attributes for a heading node.
     * @default {}
     * @example { class: 'foo' }
     */
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        heading: {
            /**
             * Set a heading node
             * @param attributes The heading attributes
             * @example editor.commands.setHeading({ level: 1 })
             */
            setHeading: (attributes: { level: Level, id?: string }) => ReturnType
            /**
             * Toggle a heading node
             * @param attributes The heading attributes
             * @example editor.commands.toggleHeading({ level: 1 })
             */
            toggleHeading: (attributes: { level: Level, id?: string }) => ReturnType
        }
    }
}

/**
 * This extension allows you to create headings.
 * @see https://www.tiptap.dev/api/nodes/heading
 */
export const Heading = Node.create<HeadingOptions>({
    name: 'heading',

    addOptions() {
        return {
            levels: [1, 2, 3, 4, 5, 6],
            id: '',
            HTMLAttributes: {},
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: HeadingPopselect,
                    componentProps: {
                        isActive: editor.isActive('extensionHeading'),
                        isReadonly: !editor.isEditable,
                        editor,
                        levels: headerData,
                        tipText: '设置标题',
                    }
                }
            }
        }
    },

    content: 'inline*',

    group: 'block',

    defining: true,

    addAttributes() {
        return {
            level: {
                default: 1,
                rendered: false,
            },
            id: {
                default: '',
                rendered: false,
            },
        }
    },

    parseHTML() {
        const items = this.options.levels.map((level: Level) => ({
            tag: `h${level}`,
            attrs: { level },
        }))
        return items
    },

    renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level)
        const level = hasLevel ? node.attrs.level : this.options.levels[0]
        this.options.HTMLAttributes.id = node.attrs.id
        return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addCommands() {
        return {
            setHeading:
                (attributes) =>
                    ({ commands }) => {
                        if (!this.options.levels.includes(attributes.level)) {
                            return false
                        }
                        const id = `H${attributes.level}-${uuidV4()}`
                        return commands.setNode(this.name, { ...attributes, id })
                    },
            toggleHeading: (attributes) =>
                ({ commands }) => {
                    if (!this.options.levels.includes(attributes.level)) {
                        return false
                    }
                    const id = `H${attributes.level}-${uuidV4()}`
                    return commands.toggleNode(this.name, 'paragraph', { ...attributes, id })
                },
        }
    },

    addKeyboardShortcuts() {
        return this.options.levels.reduce(
            (items, level) => ({
                ...items,
                ...{
                    [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level }),
                },
            }),
            {},
        )
    },

    addInputRules() {
        return this.options.levels.map(level => {
            return textblockTypeInputRule({
                find: new RegExp(`^(#{${Math.min(...this.options.levels)},${level}})\\s$`),
                type: this.type,
                getAttributes: {
                    level
                },
            })
        })
    },
})