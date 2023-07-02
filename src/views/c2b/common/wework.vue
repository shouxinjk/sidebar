<template>
  <!--授权提示：在尚未授权时显示-->
  <div>
    <div v-if="hot.showAuthUrl" class="panel">
      <div class="panel-title">尚未配置企业微信</div>
      <div class="panel-body"><a href="#" @click="getPreAuthUrl()">立即配置</a></div>
    </div>
    <div v-else>
      <div class="panel">
        <div class="panel-title">授权信息：</div>
        <div class="panel-body">
          <div>
            <label>授权时间：</label>
            <input v-model="hot.authCorp.createTime" read-only/>
          </div>
          <div>
            <label>企业简称：</label>
            <input v-model="hot.authCorp.corpName" read-only/>
          </div>
          <div>
            <label>企业全称：</label>
            <input v-model="hot.authCorp.corpFullName" read-only/>
          </div>
          <div>
            <label>所属行业：</label>
            <input v-model="hot.authCorp.corpIndustry" read-only/>
          </div>
          <div>
            <label>细分行业：</label>
            <input v-model="hot.authCorp.corpSubIndustry" read-only/>
          </div>  
        </div>  
      </div>   
      <div class="panel">
        <div class="panel-title">
          企业微信侧边栏：设置后能够直接将方案、笔记、知识库、AI生成能力接入企业微信，并可直接发送到聊天对话框
        </div>
        <div v-for="(element,index) in hot.sidebar" class="panel-body">
          <div @click="copyToClipboard('text/plain',element.url)" class="flex justify-center">
            <div style="width:60px;text-align: center;"> {{ index + 1  }}</div>
            <div style="width:8%"> {{ element.name }}</div>
            <div style="width:32%"> {{ element.desc }}</div>
            <div style="width:40%"><input v-model="element.url" read-only style="width:100%;"/></div>
            <div style="flex-grow:1;text-align: center;"><span @click="copyToClipboard('text/plain',element.url)">复制</span></div>
          </div>
        </div>
      </div>   
      <div class="panel">
        <div class="panel-title">
          配置说明：根据需要选择复制相应的链接并<a href="https://work.weixin.qq.com/wework_admin/frame#apps">进入企业微信后台</a>完成。
        </div>
        <div class="panel-title">
          <img src="../../../assets/images/wework.jpg"/>
        </div>
      </div>   
    </div>  
  </div>
</template>

<style>
.panel{
  background-color: #fff;
  width:100%;
  margin: 5px;
}
.panel-title{
  padding: 5px;
  border-bottom: 1px solid silver;
}
.panel-body{
  padding: 5px;
}
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
import { getUrlParam } from '/@/utils';
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';
import { hot, checkAuthCorpInfo,checkAuthCorpInfoExt, getPreAuthUrl, getPermanentCode, copyToClipboard } from './wework.api';

checkAuthCorpInfo(); //检查corp授权信息
checkAuthCorpInfoExt(); //检查agent授权信息

let authCode = getUrlParam("auth_code");
let state = getUrlParam("state");

if( authCode && authCode.trim().length>0 ){
  hot.showAuthUrl = false;
  getPermanentCode ( authCode );
}

</script>