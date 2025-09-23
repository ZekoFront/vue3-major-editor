import { defineStore } from 'pinia'

export interface ISelection {
    from: number
    to: number
    typeName: string
}
interface SelectionState {
  selection: ISelection | null;
}

export const useSelectionStore = defineStore('selection', {
    state: (): SelectionState => ({
        selection: {
            from: 0,
            to: 0,
            typeName: ''
        }
    }),
    getters: {
        getSelectTion (state) {
            return state.selection
        }
    },
    actions: {
        updateSelectTion(val:ISelection) {
            this.selection = val
        }
    }
})