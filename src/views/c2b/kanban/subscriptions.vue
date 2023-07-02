<template>
  
  <div>
    <!-- 顶部显示摘要：订阅类型、账户余额、租户信息、商户信息 -->
    <div style="display: flex; flex-direction: row; flex-wrap: nowrap;margin:16px;margin-right:0;">
      <div class="kanban-block  panel">
        <div class="panel-title">
          <div>订阅类型</div>
          <div>
            <a-button @click="showSalePackagesDrawer">续费/升级</a-button>
          </div>
        </div>
        <div class="panel-body">
          <div class="card-head">{{ hot.salePackage?hot.salePackage.name:"-" }}</div>
          <div>生效日期：{{ hot.tenantSalePackage?hot.tenantSalePackage.effectiveOn:"-" }}</div>
          <div>到期日期：{{ hot.tenantSalePackage?hot.tenantSalePackage.expireOn:"-" }}</div>
        </div>
      </div>
      <div class="kanban-block  panel">
        <div class="panel-title">
          <div>账户余额</div>
          <div>
            <a-button @click="showPointsDrawer">充值</a-button>
          </div>
        </div>
        <div class="panel-body">
          <div class="card-head">{{ hot.tenantPoints ? hot.tenantPoints.points: 0 }} 云豆</div>
          <div>可用于所有内容模板、AI生成、内容服务、商品发布等</div>
        </div>    
      </div>
      <div class="kanban-block  panel">
        <div class="panel-title">
          <div>公司信息</div>
          <div>
            <a-button style="border:0;">&nbsp;</a-button>
          </div>
        </div>
        <div class="panel-body">
          <div class="card-head">{{ hot.tenant.name }}</div>
          <div>注册时间：{{ hot.tenant.createTime }}</div>
          <div>用户数量：{{ hot.tenantUsers }}</div>
        </div> 
      </div>
      <div class="kanban-block  panel">
        <div class="panel-title">
          <div>特约商户</div>
          <div>
            <a-button @click="navToMerchantPage">申请</a-button>
          </div>
        </div>
        <div class="panel-body" v-if=" hot.merchant && hot.merchant.subMchid">
          <div class="card-head">费率：0.38%</div>
          <div>{{ hot.merchant ? "商户名称："+ hot.merchant.subMchid:"尚未开通" }}</div>
          <div>{{ hot.merchant ? "商户号："+ hot.merchant.subMchid:"尚未开通" }}</div>
        </div>
        <div class="panel-body" v-else>
          <div class="card-head">费率：0.38%</div>
          <div>特约商户用于接收小程序内的用户订单，能够享受优惠费率</div>
        </div>        
      </div>
    </div>

    <!-- 显示订阅明细，包括SaaS、小程序、企微等，包含额度及用量，提供升级及续费能力 -->
    <div style="margin:16px;">

      <!--根据software显示订阅详情-->
      <div class="panel-bar" v-for="(software,index) in hot.softwares">
        <div class="panel-title">
          <div>{{ software.name }}</div>
          <div>
            <a-button @click="showPricePlanDrawer(software)">续费/升级</a-button>
          </div>          
        </div>
        <div style="display: flex;flex-direction: row;width:100%;">
          <div class="panel-logo">
            <img :src="'/src/assets/images/'+ software.type+'.png'" style="height:80px;object-fit: cover;"/>
          </div>
          <div class="panel-desc">
            {{ software.description }}
          </div>
          <!--有pricePlan则显示-->
            <div class="panel-data" v-if="software.resources">
              <div class="panel-grid">
                <div>功能/资源</div>
                <div>数量/额度</div>
                <div>已使用</div>
                <div></div>
              </div>
              <!--显示所有资源配置-->
              <div class="panel-grid" v-for="(pricePlanResource,idx) in software.resources">
                <div>{{ pricePlanResource.resourceName }}</div>
                <div>{{ pricePlanResource.amount }}</div>
                <div></div>
                <div>加购</div>
              </div>  

            </div>

        </div>

      </div>        

      <!--
      <div class="panel-bar">
        <label>More+分销</label>
      </div>   
      -->
    </div>  

    <!--采用侧边栏显示salePackage及pricePlan列表-->
    <div id="amispage"></div>
    <Amis :amisnode="tabnode" :amisjson="tableApps"></Amis>     
  </div>
</template>

<style>

  .card-head {
    margin: 10px 0;
    font-size:16px;
    font-weight:bold;
    color:#555;
    line-height: 28px;
  }
  .panel-logo{
    width:20%;
    padding:5px;
  }
  .panel-desc{
    width:30%;
    padding:5px;
  }
  .panel-data{
    width:50%;
    padding:5px;
  }

  .panel-grid{
    display:flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    width:100%;
  }
  .panel-grid > div{
    flex: 1;
  }

  .kanban-block {
    width: calc((100% - 48px)/4);
    margin-right: 16px;
  }

  .kanban-block :last-of-type{
    margin-right:0;
  }  

  .panel-bar{
    background-color: #fff;
    width:100%;
    margin-top:16px;
    padding:5px;
  }
  .panel{
    background-color: #fff;
    width:100%;
  }
  .panel-title{
    padding: 5px;
    border-bottom: 1px solid silver;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
import { getUrlParam } from '/@/utils';
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';
import { hot, checkTenantMetricsInfo } from './subscriptions.api';
import Amis from "../../amis/components/Amis.vue";
import {tableApps} from './subscriptions.data';
import { useRouter, useRoute } from 'vue-router'

const { currentRoute, replace } = useRouter();
const tabnode = "#amispage";

let authCode = getUrlParam("auth_code");
checkTenantMetricsInfo(); //检查订阅详情

//显示套餐续费侧边栏
function showSalePackagesDrawer(){
  //设置当前salePackage
  hot.currentSalePackage = hot.salePackage;
  let amisBtn = document.querySelector('.__sx__btn__showPkgDrawer>span');
  if(amisBtn){
    amisBtn.click();
  }
}

//显示充值侧边栏
function showPointsDrawer(){
  let amisBtn = document.querySelector('.__sx__btn__showPointsDrawer>span');
  if(amisBtn){
    amisBtn.click();
  }
}

//显示PricePlan侧边栏
function showPricePlanDrawer( software ){
  //设置当前选中software
  hot.currentSoftware = software;
  let amisBtn = document.querySelector('.__sx__btn__showPricePlanDrawer>span');
  if(amisBtn){
    amisBtn.click();
  }
}

//跳转到特约商户表单界面
function navToMerchantPage() {
  //直接跳转编辑界面
  replace({ path: '/settings/merchant', query: {} });
}

</script>