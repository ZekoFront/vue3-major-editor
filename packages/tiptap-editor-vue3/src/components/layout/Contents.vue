<template>
<div 
   :class="[
      'vue3-tiptap-editor__navigation', 
      { 'is-active': isShowContent }
   ]">
   <div class="navigation-header">
      <span>文档目录</span>
      <NIcon class="close-nav" size="25" @click="closeContents">
           <Dismiss20Filled></Dismiss20Filled>
      </NIcon>
   </div>
   <div class="navigation-directory">
      <!-- <p>文档目录：</p> -->
      <ul id="directory-container" class="directory-container"></ul>
   </div>
</div>    
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { Dismiss20Filled } from '@vicons/fluent'
import { Editor } from '@tiptap/vue-3'

const props = defineProps({
   editor: {
      type: Editor,
      required: true,
   }
})

const isShowContent = defineModel<boolean>("isShowContent", {
   default: true,
   required: true,
});

props.editor.on('update', ({ editor }) => {
   nextTick(() => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;
      let node = $from.node();
      if (node.type.name === 'heading') {
         updateDirectory()
      }
   })
})

const updateDirectory = () => {
   const container = document.querySelector('.tiptap-editor__content')
   if (!container) return
   // 标题 DOM 容器
   const headerContainer = document.getElementById('directory-container') as HTMLElement
   const headers = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))

   if (headers&&headers.length === 0) {
      headerContainer.innerHTML = `<li>暂无数据</li>`
   } else {
      headerContainer.innerHTML = headers.map((item, index) => {
         item.setAttribute('id', item.getAttribute('id')||"")
         const type = parseInt(item.tagName.slice(1));
         return `<li id="${item.getAttribute('id')||''}" class="directory-item__cell" type="header${type}">${removeBrTags(item.innerHTML)}</li>`
      }).join('')
   }

   headerContainer.addEventListener('mousedown', (event:any) => {
      if (event.target&&event.target.tagName !== 'LI') return
      event.preventDefault()
      const id = event.target.id
      // 滚动到标题
      const targetElement = document.querySelector(`#${id}`);
      if (targetElement) {
         targetElement.scrollIntoView({
            behavior: "smooth",
            block: 'start',
            inline: 'nearest'
         });
      }
   })

   // @ts-ignore
   const li = headerContainer.childNodes
   for (let i = 0; i < li.length; i++) {
      // @ts-ignore
      li[i].onclick = () => {
         // @ts-ignore
         li.forEach(item => {
            // @ts-ignore
            item.setAttribute('class', 'directory-item__cell')
         })
         // @ts-ignore
         li[i].setAttribute('class', 'directory-item__cell active')
      }
   }
}


const closeContents = () => {
   isShowContent.value = !isShowContent.value
}

function removeBrTags(html:string) {
    // 匹配各种形式的br标签：<br>、<br/>、<br />等
    const brRegex = /<br\s*\/?>/gi;
    // 用空字符串替换所有匹配到的br标签
    return html.replace(brRegex, '');
}

onMounted(() => {
   nextTick(() => {
      updateDirectory()
   })
})
</script>

<style lang="scss">
 .vue3-tiptap-editor__navigation {
   width: 0px;
   flex: 0 0 0px;
   transition: all 0.3s ease-out;
   overflow: hidden;
   white-space: nowrap;
   /* height: 100%; */
   &.is-active {
      width: 318px;
      flex: 0 0 318px;
      padding: 0 10px;
      border-left: 1px solid #f2f2f2;
   }
   .navigation-header {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      .close-nav:hover {
         background-color: #dddcdc;
      } 
      .close-nav {
         cursor: pointer;
      }
   }
   .navigation-directory {
      overflow-y: scroll;
      .directory-container {
         list-style-type: none;
         // padding-left: 10px;
         position: relative;
         &:after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 2px;
            background-color: #e5e8ed;
         }
         .directory-item__cell {
            color: #333;
            padding: 0;
            margin: 0;
            height: 20px;
            cursor: pointer;
            &:hover {
               text-decoration: underline;
               color: #2b4bf3 !important;
            }
         }
      
         .directory-item__cell[type="header1"] {
            font-weight: bold;
            font-size: 14px;
         }
         .directory-item__cell[type="header2"] {
            padding-left: 2px;
            color: #666;
            font-size: 13px;
            font-weight: bold;
         }
         .directory-item__cell[type="header3"],
         .directory-item__cell[type="header4"],
         .directory-item__cell[type="header5"],
         .directory-item__cell[type="header6"] {
            color: #999;
            font-size: 12px;
            padding-left: 15px;
         }

         .active {
            color: #2b4bf3 !important;
            position: relative;
            &:after {
               position: absolute;
               top: 0;
               left: -16px;
               content: "";
               width: 2px;
               height: 100%;
               z-index: 2;
               background: #2b4bf3;
            }
         }
      }
   }
}
</style>