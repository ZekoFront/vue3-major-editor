import { v4 as uuidV4 } from 'uuid'
import { Editor } from '@tiptap/core'

export function getHeading () {
    let arr = [];
    let i = 0;
    while (i < 7) {
        if (i === 6) {
            arr.push({ label: `正文`, value: `${i + 1}`, disabled: false })
        } else {
            const num = i + 1
            arr.push({ label: `H${num} 标题 ${num}`, value: `${num}`, disabled: false })
        }
        i++;
    }
    return arr
}

export const headerData = getHeading()

/**
 * 核心修复方法：
 * 遍历 Tiptap 文档树，给没有 ID 的标题节点添加 ID
 * 这会触发 update，从而持久化保存 ID
 */
export const ensureHeadingIds = (editor: Editor) => {
    const { doc, tr } = editor.state
    const headingsToUpdate: { pos: number; id: string }[] = []

    // 遍历文档节点
    doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
            if (!node.attrs.id) {
                headingsToUpdate.push({
                    pos,
                    id: `H${node.attrs.level}_${uuidV4()}`,
                })
            }
        }
    })

    if (headingsToUpdate.length > 0) {
        headingsToUpdate.forEach(({ pos, id }) => {
            tr.setNodeMarkup(pos, undefined, {
                ...doc.nodeAt(pos)?.attrs,
                id,
            })
        })

        // 提交事务，这将触发编辑器更新和重绘
        editor.view.dispatch(tr)
        return true
    }
    
    return false
}
