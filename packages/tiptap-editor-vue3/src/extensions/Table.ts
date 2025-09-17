import {  h  } from "vue";
import { Editor } from "@tiptap/core";
import { Table as TiptapTable,TableCell,TableHeader, TableRow } from "@tiptap/extension-table";
import TableUI from "@/components/table/Table.vue";
import { ITableContextMenuItem } from '@/typings/index'

function renderCustomHeader() {
    return h('div',{ style: { fontWeight: 'bold', textAlign: 'center'}}, '操作表格')
}
const Table = TiptapTable.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            onClick: ({ editor }: { editor: Editor }) => {
                const menuOptions:ITableContextMenuItem[] = [
                    {
                        key: 'header',
                        type: 'render',
                        render: renderCustomHeader
                    },
                    {
                        key: 'header-divider',
                        type: 'divider'
                    },
                    {
                        label: "删除表格",
                        key: "deleteTable",
                        command: function () {
                            editor.commands.deleteTable()
                        }
                    },
                    {
                        label: "向前添加列",
                        key: "addColumnBefore",
                        command: function () {
                            editor.commands.addColumnBefore()
                        }
                    },
                    {
                        label: "向后添加列",
                        key: "addColumnAfter",
                        command: function () {
                            editor.commands.addColumnAfter()
                        }
                    },
                    {
                        label: "向后添加行",
                        key: "addRowBefore",
                        command: function () {
                            editor.commands.addRowBefore()
                        }
                    },
                    {
                        label: "向后添加行",
                        key: "addRowBAfter",
                        command: function () {
                            editor.commands.addRowAfter()
                        }
                    },
                    {
                        key: 'header-divider',
                        type: 'divider'
                    },
                    {
                        label: "删除列",
                        key: "deleteColumn",
                        command: function () {
                            editor.commands.deleteColumn()
                        }
                    },
                    {
                        label: "删除行",
                        key: "deleteRow",
                        command: function () {
                            editor.commands.deleteRow()
                        }
                    },
                    {
                        key: 'header-divider',
                        type: 'divider'
                    },
                    {
                        label: "合并单元格",
                        key: "mergeCells",
                        command: function () {
                            editor.commands.mergeCells()
                        }
                    },
                    {
                        label: "拆分单元格",
                        key: "splitCell",
                        command: function () {
                            editor.commands.splitCell()
                        }
                    },
                    {
                        key: 'header-divider',
                        type: 'divider'
                    },
                    {
                        label: "表格头标题",
                        key: "headerColumn",
                        children: [
                            {
                                label: "设置列标题",
                                key: "toggleHeaderColumn",
                                command: function () {
                                    editor.commands.toggleHeaderColumn()
                                }
                            },
                            {
                                label: "设置行标题",
                                key: "toggleHeaderRow",
                                command: function () {
                                    editor.commands.toggleHeaderRow()
                                }
                            },
                            {
                                label: "设置单元格标题",
                                key: "toggleHeaderCell",
                                command: function () {
                                    editor.commands.toggleHeaderCell()
                                }
                            },
                        ]
                    }
                ]
                return {
                    component: TableUI,
                    componentProps: {
                        options: menuOptions,
                        editor,
                        isReadonly: !editor.isEditable,
                        tipText: "表格",
                    },
                };
            },
        };
    },

    addExtensions() {
        // 此处扩展插件顺序：TableRow,TableHeader,TableCell，否则会影响表格选中效果
        return [TableRow,TableHeader,TableCell];
    },
}).configure({
    resizable: true,
});

export { Table };
