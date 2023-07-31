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
import { getUrlParam } from '/@/utils';
import { kbForm,solutionForm, aiForm, contentForm, skuForm, noteForm, posterForm } from './sidebar.data';
import { listenPostMessage, getCorpJsConf, getSuiteJsConf } from './sidebar.api';
import * as ww from '@wecom/jssdk'; //引入企业微信jssdk

console.log("corpId",getUrlParam("corpId"));
console.log("agentId",getUrlParam("agentId"));

ww.register({
  corpId: getUrlParam("corpId") || "",       // 必填，当前用户企业所属企业ID
  agentId: getUrlParam("agentId") || "",                  // 必填，当前第三方应用的AgentID
  jsApiList: [
      'getExternalContact',
      'sendChatMessage',
      'getContext',
      'getCurExternalContact',
      'getCurExternalChat',
      'openEnterpriseChat',
      'shareToExternalContact',
      'shareToExternalChat',
      'previewFile',
      'shareToExternalMoments',
  ], // 必填，需要使用的JSAPI列表
  getConfigSignature,                // 必填，根据url生成企业签名的回调函数
  getAgentConfigSignature,            // 必填，根据url生成应用签名的回调函数
})


async function getConfigSignature() {
  // 根据 url 生成企业签名
  // 生成方法参考 https://open.work.weixin.qq.com/api/doc/90001/90144/93197
  let corpId = getUrlParam("corpId");
  let url = window.location.href;
  console.log("generate corp auth signature", corpId, url);
  let signature = await getCorpJsConf(corpId, url); 
  console.log("got corp auth signature", signature);
  return signature;
}

async function getAgentConfigSignature() {
  // 根据 url 生成应用签名，生成方法同上，但需要使用应用的 jsapi_ticket
  let corpId = getUrlParam("corpId");
  let url = window.location.href;
  console.log("generate corp auth signature", corpId, url);
  let signature = await getSuiteJsConf(corpId, url); 
  console.log("got suite auth signature", signature);
  return signature;
}
//** */

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
let tab = getUrlParam('tab');//从参数中获取tab类型
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