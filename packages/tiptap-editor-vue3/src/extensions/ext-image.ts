// 自定义图片插件
// 创建一个新节点image
import { Editor, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNodeViewWrapper from '@/components/image/ImageNodeViewWrapper.vue'
import { Image as TiptapImage } from '@tiptap/extension-image'
import ImageIcon from '@/components/image/ImageIcon.vue'
import { DEFAULT_IMAGE_DISPLAY, DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_URL_REGEX, DEFAULT_IMAGE_WIDTH, ImageDisplay } from '@/utils'

export const ExtensionImage = TiptapImage.extend({
    inline () {
        return true
    },
    group() {
        return 'inline';
    },
    addAttributes() {
        return {
            ...this.parent?.(),
            // 这样配置后，更新属性，才会触发编辑器update事件
            width: { 
                default: DEFAULT_IMAGE_WIDTH,
                parseHTML: (element) =>  {
                    const width = element.style.width||element.getAttribute('width')||null
                    return width===null?null:parseInt(width, 10)
                },
                renderHTML: (attributes) => {
                    return { width: attributes.width }
                },
            },
            height: { 
                default: DEFAULT_IMAGE_HEIGHT,
                parseHTML: (element) => {
                    const height = element.style.height || element.getAttribute('height') || null;
                    return height == null ? null : parseInt(height, 10);
                },
                renderHTML: (attributes) => {
                    return {
                        height: attributes.height
                    };
                },
            },
            display: {
                default: DEFAULT_IMAGE_DISPLAY,
                parseHTML: (element) => {
                    const { cssFloat, display } = element.style;
                    let dp =
                        element.getAttribute('data-display') ||
                        element.getAttribute('display');
                    if (dp) {
                        dp = /(inline|block|left|right)/.test(dp)
                        ? dp
                        : ImageDisplay.INLINE;
                    } else if (cssFloat === 'left' && !display) {
                        dp = ImageDisplay.FLOAT_LEFT;
                    } else if (cssFloat === 'right' && !display) {
                        dp = ImageDisplay.FLOAT_RIGHT;
                    } else if (!cssFloat && display === 'block') {
                        dp = ImageDisplay.BREAK_TEXT;
                    } else {
                        dp = ImageDisplay.INLINE;
                    }

                    return dp;
                },
                renderHTML: (attributes) => {
                    return {
                        ['data-display']: attributes.display,
                    };
                },
            },
        }
    },
    addOptions () {
        return {
            ...this.parent?.(),
            inline: true,
            onClick: ({ editor }:{ editor: Editor }) => {
                return {
                    component: ImageIcon,
                    componentProps: {
                        isActive: editor.isActive('image'),
                        isReadonly: !editor.isEditable,
                        icons: 'image-icon',
                        tipText: '添加图片',
                        editor: editor,
                        urlPattern: DEFAULT_IMAGE_URL_REGEX,
                    }
                }
            }
        }
    },
    parseHTML() {
        return [{ tag: 'img[src]' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['img', HTMLAttributes]
    },
    addNodeView() {
        return VueNodeViewRenderer(ImageNodeViewWrapper)
    }
})