import TiptapHeading, { Level } from '@tiptap/extension-heading'
import HeadingPopselect from '@/components/text/HeadingPopselect.vue'
import { Editor } from '@tiptap/vue-3'
import { v4 as uuidV4 } from 'uuid'
import { headerData } from '@/utils'


declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        heading: {
            /**
             * Set a heading node
             * @param attributes The heading attributes
             * @example editor.commands.setHeading({ level: 1 })
             */
            setHeading: (attributes: {
                level: Level;
            }) => ReturnType;
            /**
             * Toggle a heading node
             * @param attributes The heading attributes
             * @example editor.commands.toggleHeading({ level: 1 })
             */
            toggleHeading: (attributes: {
                level: Level;
            }) => ReturnType;
        };
    }
}

export const Heading = TiptapHeading.extend({
    name: 'extensionHeading',
    addAttributes() {
        return {
            level: {
                type: Number,
                default: 1, // 默认级别
                required: true,
                parseHTML: (element:any) => {
                    const tagName = element.tagName.toLowerCase()
                    if (tagName.startsWith('h')) {
                        return parseInt(tagName.replace('h', ''), 10)
                    }
                    return 1
                },
                // 确保渲染HTML时正确设置
                renderHTML: (attributes:any) => {
                    return {
                        level: attributes.level
                    }
                }
            },
            id: {
                type: String,
                default: () => `H_${uuidV4()}`,
                parseHTML: (element:HTMLElement) => {
                    const ids = element.getAttribute('id')||`H_${uuidV4()}`
                    console.log(ids, 3333)
                    return ids
                },
                renderHTML: (attributes:any) => {
                    return {
                        id: attributes.id
                    }
                }
            }
        }
    },
    addOptions() {
        return {
            levels: [1, 2, 3, 4, 5, 6] as Level[],
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
    // 确保HTML渲染时包含id属性
    renderHTML({ node, HTMLAttributes }: { node: any, HTMLAttributes:any }) {
        const level = node.attrs.level as Level
        const tag = `h${level}`
        return [tag, { ...HTMLAttributes, id: `$H_${uuidV4()}` }, 0]
    },
})
