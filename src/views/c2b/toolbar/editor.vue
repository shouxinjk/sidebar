<template>
  <!--所有资源类型列表-->
  <div id="itemtypes">
    
  </div>
  <Amis :amisnode="tabnode" :amisjson="tabjson"></Amis>   
</template>

<style>
  svg.icon-left-arrow{
    display:inline;
  }
  svg.icon-right-arrow{
    display:inline;
  }

  /**修正移动端 表单布局问题 */
  .cxd-Form{
    border: 0 !important;
  }
  .cxd-Form::before{
    border: 0 !important;
  }
  .cxd-Form::after{
    border: 0 !important;
  }
  div.cxd-Form-item{
    padding: 6px 0 !important;
    border: 0 !important;
  }
  div.cxd-Form-item::before{
    border: 0 !important;
  }
  div.cxd-Form-item::after{
    border: 0 !important;
  }
  div.cxd-Card-title {
    white-space: wrap !important;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  /* div.cxd-Select{

  } */
</style>

<!--引入AMIS扩展及iconfont-->
<style>
	@import "amis/sdk/helper.css";
</style>

<script setup lang="ts">
import Amis from "../../amis/components/Amis.vue";
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';
import { kbForm,solutionForm, aiForm, contentForm, skuForm, posterForm, kefuForm } from './editor.data';
import { listenPostMessage } from './editor.api';

// import { useUserStore } from '/@/store/modules/user';
// const userStore = useUserStore();

//监听post message
listenPostMessage();

//进入时检查用户信息，通知上层窗口
//不能工作：导致重复加载
// console.log("sxToolbar:helper");
// //通知上层窗口修改登录状态
// window.parent.postMessage({
//     action: 'sxLogin',
//     data: {
//       userInfo: JSON.parse(JSON.stringify(userStore.getUserInfo)),
//     }
// }, '*');  

const tabnode = "#itemtypes";
const tabjson = {
  "type": "page",
  "name":"editor",
  "body": {
    "type": "tabs",
    "name": "tabs",
    "className":"sticky", //固定tab表头
    "tabs": [
      {
        "title": "图文",
        "tab": contentForm
      },
      {
        "title": "海报",
        "tab": posterForm
      },
      {
        "title": "客服",
        "tab": kefuForm
      },
      {
        "title": "方案库",
        "tab": solutionForm
      },
      {
        "title": "产品库",
        "tab": skuForm 
      },
      {
        "title": "知识库",
        "tab": kbForm
      },
      {
        "title": "AI生成",
        "tab": aiForm
      },
    ]
  }
};


</script>