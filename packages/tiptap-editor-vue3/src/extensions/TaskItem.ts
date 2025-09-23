import TaskIcon from '@/components/task/TaskIcon.vue';
import { Editor } from "@tiptap/vue-3";
import { TaskItem as TiptapTaskItem } from '@tiptap/extension-list';

const TaskItem = TiptapTaskItem.extend({
    content: 'block',
    name: 'customTask',
    addOptions() {
        return {
            // ...this.parent?.(),
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: TaskIcon,
                    componentProps: {
                        editor,
                        isActive: editor.isActive('taskItem'),
                        isReadonly: !editor.isEditable,
                        icons: '',
                        tipText: '任务列表',
                        command: () => {
                           
                        }
                    }
                }
            }
        }
    },
}).configure({
    nested: true,
})

export { TaskItem }
