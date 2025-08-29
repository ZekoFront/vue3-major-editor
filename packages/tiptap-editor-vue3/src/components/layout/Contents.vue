<template>
<div 
   :class="[
      'tiptap-editor__navigation', 
      { 'is-active': toolsStore.isShowContents }
   ]">
   <div class="navigation-header">
      <span>文章目录</span>
      <NIcon class="close-nav" size="25" @click="closeContents">
           <Dismiss20Filled></Dismiss20Filled>
      </NIcon>
   </div>
   <div>是粉红色的和佛山的红色的回复</div>
</div>    
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { Dismiss20Filled } from '@vicons/fluent'
import { useToolsStore } from '@/store/tools'

const toolsStore = useToolsStore()

const closeContents = () => {
   toolsStore.updateIsShowContents()   
}

</script>

<style lang="css">
 .tiptap-editor__navigation {
   width: 0px;
   flex: 0 0 0px;
   transition: all 0.3s ease-out;
   overflow: hidden;
   white-space: nowrap;
   /* height: 100%; */
 }
.tiptap-editor__navigation > .navigation-header {
   display: flex;
   justify-content: space-between;
   padding: 10px 0;      
}
.navigation-header > .close-nav {
   cursor: pointer;
}
.navigation-header > .close-nav:hover {
   background-color: #dddcdc;
}
.tiptap-editor__navigation.is-active {
   width: 318px;
   flex: 0 0 318px;
   padding: 0 10px;
   border-left: 1px solid #f2f2f2;
}
</style>