import { defineStore } from 'pinia'

interface UserInfo {
    name: string
    age: number
}

export const useToolsStore = defineStore('tools', {
    state: () => {
        return {
            // 用于初始化空列表
            userList: [] as UserInfo[],
            // 用于尚未加载的数据
            user: null as UserInfo | null,
            isShowContents: false
        }
    },
    actions: {
        updateIsShowContents() {
            this.isShowContents = !this.isShowContents
        }
    }
})

