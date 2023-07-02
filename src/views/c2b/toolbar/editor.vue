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
</style>

<script setup lang="ts">
import Amis from "../../amis/components/Amis.vue";
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';
import { kbForm,solutionForm, aiForm, contentForm, skuForm } from './editor.data';
import { listenPostMessage } from './editor.api';

//监听post message
listenPostMessage();

const tabnode = "#itemtypes";
const tabjson = {
  "type": "page",
  "name":"helper",
  "body": {
    "type": "tabs",
    "name": "tabs",
    "className":"sticky", //固定tab表头
    "tabs": [
      {
        "title": "笔记内容",
        "tab": contentForm
      },
      {
        "title": "AI生成",
        "tab": aiForm
      },
      {
        "title": "知识库",
        "tab": kbForm
      },
      {
        "title": "方案库",
        "tab": solutionForm
      },
      {
        "title": "产品库",
        "tab": skuForm 
      },
    ]
  }
};


</script>