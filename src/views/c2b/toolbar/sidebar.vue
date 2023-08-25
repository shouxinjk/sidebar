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

  div.cxd-Form-item{
    padding-top: 0;
    padding-bottom: 0;
  }

  .cxd-Form .cxd-Form-item{
    padding: 3px !important;
  }

  /**修正卡片标题自动换行 */
  div.cxd-Card-title {
    white-space: normal !important;
    word-break: break-all;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .cxd-Transfer .cxd-Tree{
    margin-top: 0 !important;
  }
  div.cxd-Each{
    display:flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: flex-start !important;
    justify-items: center !important;
    align-items: center !important;
  }

  div.cxd-Each .cxd-Form-item {
    margin-bottom: 0 !important;
  }

</style>

<script setup lang="ts">
import Amis from "../../amis/components/Amis.vue";
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';
import { getUrlParam } from '/@/utils';
import { kbForm,solutionForm, aiForm, contentForm, skuForm, noteForm, posterForm } from './sidebar.data';
import { listenPostMessage, loadAuthMiniprogs, registerWecom } from './sidebar.api';

console.log("corpId",getUrlParam("corpId"));
console.log("agentId",getUrlParam("agentId"));

//准备wecom jssdk
registerWecom( getUrlParam("corpId"), getUrlParam("agentId") );

//装载已授权小程序
loadAuthMiniprogs();

//监听post message
listenPostMessage();

const tabnode = "#itemtypes";
let tabjson = {
  "type": "page",
  "name":"helper",
  "body": {
    "type": "tabs",
    "name": "tabs",
    "className":"sticky", //固定tab表头
    "collapseOnExceed": 5,
    "draggable": true, 
    "tabs": [
      {
        "title": "方案",
        "tab": solutionForm
      },
      {
        "title": "产品",
        "tab": skuForm 
      },
      {
        "title": "笔记",
        "tab": noteForm
      },
      {
        "title": "图文",
        "tab": contentForm 
      },
      {
        "title": "海报",
        "tab": posterForm
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

//根据tab类型区分内容显示
let tab = "";
if (getUrlParam('tab') && getUrlParam('tab').trim().length>0){ //直接从URL获取指定tab
  tab = getUrlParam('tab');//从参数中获取tab类型
}else if( localStorage.getItem("sxLoginState") && localStorage.getItem("sxLoginState").trim().length>0 ){ //尝试从localStorage获取指定的信息
  tab = localStorage.getItem("sxLoginState");
}
  
if( tab && tab == "note"){
  tabjson = noteForm;
}else if( tab && tab == "ai"){
  tabjson = aiForm;
}else if( tab && tab == "kb"){
  tabjson = kbForm;
}else if( tab && tab == "solution"){
  tabjson = solutionForm;
}else if( tab && tab == "product"){
  tabjson = skuForm;
}else if( tab && tab == "content"){
  tabjson = contentForm;
}else if( tab && tab == "poster"){
  tabjson = posterForm;
}

</script>