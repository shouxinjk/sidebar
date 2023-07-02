<template>
  <!--采用图文卡片显示所有apps-->
  <div id="amispage">
    
  </div>
  <Amis :amisnode="tabnode" :amisjson="connectorsTable"></Amis>   
</template>

<style>
  svg.icon-left-arrow{
    display:inline;
  }
  svg.icon-right-arrow{
    display:inline;
  }
</style>

<script setup lang="ts">
import Amis from "../amis/components/Amis.vue";
import { getAuthInfo } from './connectors.api';
import { getTable } from './connectors.data';
import { getUrlParam } from "/@/utils";
const tabnode = "#amispage";

//检查授权信息 auth_code
let authCode = getUrlParam("auth_code");
let connectorSchemeId = getUrlParam("schemeId"); //获取schemeId
if(authCode && authCode.trim().length>0){//完成授权处理
  getAuthInfo(authCode, connectorSchemeId, function(){
    //window.location.href = window.location.href.replace(/auth_code/g,"_acode");//重新加载连接器列表，需要去掉authcode
  });
}

let dataType = null;
if(window.location.href.indexOf("/product")>0)
  dataType = "product";
else if(window.location.href.indexOf("/content")>0)
  dataType = "content";
console.log("try load connectors.",dataType);
let connectorsTable = getTable(dataType);//先加载所有连接器

</script>