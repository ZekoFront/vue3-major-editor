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
            isShowContents: false,
            headingLevel: 7,
            headingContent: ''
        }
    },
    actions: {
        updateIsShowContents() {
            this.isShowContents = !this.isShowContents
        },
        updateHeadingLevel(level:number = 7) {
            this.headingLevel = level
        },
        updateHeadingContent(content:string = '') {
            this.headingContent = content
        }
    }
})

