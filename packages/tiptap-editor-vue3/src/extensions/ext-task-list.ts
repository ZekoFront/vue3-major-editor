import TaskIcon from '@/components/task/TaskIcon.vue';
import { Editor } from "@tiptap/vue-3";
import { TaskList, TaskItem} from '@tiptap/extension-list';

const ExtensionTaskItem = TaskItem.extend({
    content: 'inline*',
    
    addOptions() {
        return {
            // ...this.parent?.(),
            onClick: ({ editor }:{editor:Editor}) => {
                return {
                    component: TaskIcon,
                    componentProps: {
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
    addExtensions() {
        return [TaskList]
    }
})

export { ExtensionTaskItem }
