<!-- 方案定制界面：左侧section列表，中间为方案内容条目，右侧为资源列表-->
<template>
  <div class="solution-head">
    <div class="solution-head-logo">
      <img src="../../../assets/images/c2b/travel.png" style="width:28px;height:28px;object-fit: cover;border-radius: 5px;margin:2px;"/>
    </div>
    <div class="solution-head-summary">
      <label>出发地：</label><input id="from" type="text" placeholder="出发地"  class="input-xs" v-model="hot.solution.extJson.from" @change="saveSolution()"/>
      <label>目的地：</label><input id="destination" type="text" placeholder="目的地"  class="input-xs" v-model="hot.solution.extJson.region" @change="saveSolution()"/>
      <label>人数：</label><input type="text" placeholder="人数" class="input-xs" v-model="hot.solution.extJson.persons"  style="width:24px;" @change="saveSolution()"/>
      <label>天数：</label><input type="text" placeholder="天数" class="input-xs" v-model="hot.solution.extJson.days"  style="width:24px;" @change="saveSolution()"/>
      <label>出行日期：</label><a-date-picker valueFormat="YYYY-MM-DD" v-model:value="hot.solution.extJson.startDate" @change="changeStartDate()"/>
    </div>
    <!--
    <div class="solution-head-btn-img">
      <div class="solution-head-logo">
        <img src="../../../assets/images/ai.png" style="width:26px;height:26px;object-fit: cover;"/>
      </div>
      <div class="solution-head-btn" style="width: 60px;min-width: 20px;">AI规划</div>
    </div>
    -->
    <div class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary">AI设计</div>
    <div class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary">复制方案</div>
    <div class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary">订单详情</div>
    <div class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary" @click="addNote()">生成笔记</div>
    <div class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary">发布到方案库</div>
  </div>
  <div class="solution-panel">
    <!--section列表-->
    <div class="solution-panel-section">
      <draggable
        :list="solutionSections"
        item-key="id"
        class="list-group"
        ghost-class="ghost"
        :disable-transitions="false"
        :move="moveSection"
        @start="sectionDragging = true"
        @end="sectionDragging = false"
      >
          <template #item="{ element, index }">
              <div class="solution-section" v-bind:class="{ active: hot.section.id === element.id }" @click="changeSection(element)">
                <div class="solution-section-logo-wrapper">
                  <div class="solution-section-logo">
                    D{{ index+1 }}
                  </div>
                </div>
                <div class="solution-section-summary-wrapper">
                  <div class="solution-section-summary" >{{ element.region }}</div>
                  <div class="solution-section-summary" >{{ element.date ? element.date : "第"+(index+1)+"天" }}</div>
                </div>
                <span @click="removeSection(element)" class="iconfont icon-shanchu sxbtn"></span>
              </div>
            </template>
      </draggable>
      <div class="solution-section-btn" @click="addSection">增加一天</div>
    </div>
    <!--内容列表-->
    <div class="solution-panel-body">
      <div class="solution-body-head">
        <div class="solution-body-head-summary">
          <div style="font-size:12px;">{{ hot.section.date }}</div>
          <div>
            <input type="text" v-model="hot.section.extJson.region" @change="changeRegion()" placeholder="选择目的地" style="font-size: 18px;"/>
          </div>
        </div>
          <div class="solution-head-logo">
            <img src="../../../assets/images/ai3.png" style="width:32px;height:32px;object-fit: cover;border-radius: 5px;"/>
          </div>
      </div>
      <draggable
        :list="solutionItems"
        item-key="id"
        class="list-group"
        ghost-class="ghost"
        :disable-transitions="false"
        :move="moveSolutionItem"
        @start="itemDragging = true"
        @end="itemDragging = false"
      >
          <template #item="{ element, index }">
            <div class="solution-item-wrapper" style="width:100%;">
              <div class="solution-item" @click="changeSolutionItem(element) ">
                <div class="solution-item-logo-wrapper">
                  <img class="solution-item-logo" :src="getItemTypeLogo(element.type)"/>
                </div>
                <div class="solution-item-summary">
                  {{ element.name }}
                </div>
                <div class="solution-item-action">
                  <span @click="removeSolutionItem($event, element)" class="iconfont icon-shanchu sxbtn"></span>
                  <span @click="chooseSolutionItem($event, element)" class="iconfont icon-jihuo sxbtn" v-bind:class="{ btnactive: hot.item.id === element.id }"></span>
                </div>
              </div>
              <div class="solution-item" v-for="option in element.options">
                <div class="solution-item-logo-wrapper">
                  <img class="solution-item-logo" :src="option.skuJson.logo" style="border-radius: 0;"/>
                </div>
                <div class="solution-item-summary">
                  {{ option.skuJson.name }}  {{ option.skuJson.summary }}
                </div>
                <div style="width:48px;">
                  <div style="text-align: center;"><input type="text" v-model="option.price" @change="changeOption(option)" placeholder="?" style="text-align: center;width:48px;"/></div>
                  <div :title="option.priceRuleDesc" class="sxTip" :style="{color: tipColors[option.priceStatus]}">价格</div>
                </div>    
                <div style="width:48px;">
                  <div style="text-align: center;"><input type="text" v-model="option.amount" @change="changeOption(option)"  placeholder="?" style="text-align: center;width:48px;"/></div>
                  <div style="font-size: 10px;color: silver;text-align: center;">数量</div>
                </div>            
                <div class="solution-item-action">
                  <span @click="removeOption(option)"  class="iconfont icon-shanchu sxbtn" ></span>
                </div>              
              </div>
            </div>
          </template>
      </draggable>
      <!--section价格小计-->
      <div class="solution-body-head-summary" style="width:100%;background-color: white;margin-top: 5px;border-radius: 5px;">
        <div style="width:100%;text-align: right;padding-right:5px;">
          <div>
            <span>成本小计：</span><input id="cost" type="text" :value="hot.section.priceSum.costSum" placeholder="成本小计" class="input-underline input-xs" readonly="true"/>
            <span>价格小计：</span><input id="price" type="text" :value="hot.section.priceSum.priceSum" placeholder="价格小计" class="input-underline input-xs" readonly="true"/>
          </div>
          <div>
            <span :title="hot.section.priceRuleDesc" :style="{color: tipColors[hot.section.priceStatus]}">利润率%：</span><input id="cost" type="text"  :value="hot.section.priceSum.profitRatio" placeholder="利润率" class="input-underline input-xs" readonly="true"/>
            <span>利润小计：</span><input id="price" type="text" :value="hot.section.priceSum.profitAmount" placeholder="利润小计" class="input-underline input-xs" readonly="true"/>
          </div>
        </div>
      </div>

      <!--方案价格合计-->
      <div class="solution-body-head-summary" style="width:100%;background-color: white;margin-top: 5px;border-radius: 5px;">
        <div style="width:100%;text-align: right;padding-right:5px;">
          <div>
            <label>成本合计：</label><input id="cost" type="text" :value="hot.solution.priceSum.costSum" placeholder="成本合计" class="input-underline input-xs" readonly="true"/>
            <label>价格合计：</label><input id="price" type="text" :value="hot.solution.priceSum.priceSum" placeholder="价格合计" class="input-underline input-xs" readonly="true"/>
          </div>
          <div>
            <span>利润合计：</span><input id="cost" type="text" :value="hot.solution.priceSum.profitAmount" placeholder="利润率" class="input-underline input-xs" readonly="true"/>
            <label>价格优惠：</label><input type="text" v-model="hot.solution.priceSum.priceDiscount" @change="changeSolutionPrice($event, 'discount')" placeholder="价格优惠" class="input-underline input-xs"/>
          </div>
          <div>
            <span :title="hot.solution.priceRuleDesc" :style="{color: tipColors[hot.solution.priceStatus]}">利润率%：</span><input id="price" type="text" :value="hot.solution.priceSum.profitRatio" placeholder="利润合计" class="input-underline input-xs" readonly="true"/>
            <span>方案报价：</span><input type="text" v-model="hot.solution.price" @change="changeSolutionPrice($event, 'price')"  :placeholder="''+hot.solution.priceSum.priceSum" class="input-underline input-xs"/>
          </div>
        </div>
      </div>
    </div>

    <!--所有资源类型列表-->
    <div id="itemtypes" class="solution-panel-option" >
      
    </div>
    <!--隐藏已选资源详情列表-->
    <div id="itemdrawer" class="solution-panel-option" style="display:none;">
      
    </div>
  </div>
  <!--
  <Amis :amisnode="tabnode" :amisjson="tabjson" ref="amis"></Amis>   
  -->
</template>

<!--修正amis风格冲突-->
<style>
  svg.icon-left-arrow{
    display:inline;
  }
  svg.icon-right-arrow{
    display:inline;
  }

  /**修复卡片标题及描述显示 */
  div.cxd-Card-meta{
    width:100%;
  }
  div.cxd-TplField span{
    line-height: 50rpx;
    overflow: hidden;  /** 隐藏超出的内容 **/
    word-break: break-all;
    text-overflow: ellipsis; /** 多行 **/
    display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 2; /** 显示的行数 **/
  }
  /**隐藏查询表单下的label文字 */
  .w-full>label{
    display:none;
  }
  .cxd-Card-body{
    margin:0;
  }

  input::placeholder {
    font-size:12px;
  }
</style>

<style lang="less" scoped>
  @import 'solution.less';
</style>

<!--引入AMIS扩展及iconfont-->
<style>
	@import "amis/sdk/helper.css";
</style>

<script setup lang="ts">
import {  onMounted } from "vue";
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';
//import Amis from "../../amis/components/Amis.vue";
import {hot,solutionSections,solutionItems,loadSolution,loadSections,loadPriceRules, saveSolution,
  removeOption, changeOption, changeSolutionPrice,
  addSection, removeSection, changeSection, moveSection, 
  removeSolutionItem, chooseSolutionItem, changeSolutionItem, moveSolutionItem, 
  changeStartDate,changeRegion, addNote } from './solution.api';
import draggable from 'vuedraggable'

import {getForm} from './solution.data.ro';

import { useRouter } from 'vue-router'
const { currentRoute } = useRouter();
//const id = this.$route.query.id;

const sectionDragging = false;
const itemDragging = false;

//标签个数：去掉左侧导航栏宽度
let tabCount = 6; //默认为6个
try{
  let navWidth = document.getElementsByClassName('ant-layout-sider-children')[0].clientWidth;
  tabCount = Math.floor((document.getElementsByTagName('html')[0].clientWidth - navWidth)*0.4/90);
}catch(err){}
console.log("total tabs",tabCount);

//提示文字颜色
const tipColors = {
  "error":"red",
  "warn":"orange",
  "success":"green"
};

const tabnode = "#itemtypes";
const tabjson = {
  "type": "page",
  "name":"travel",
  "body": {
    "type": "tabs",
    "name": "sputabs",
    "collapseOnExceed": tabCount,//6,//超过5个折叠
    "tabs": [
      {
        "title": "酒店",
        "tab": getForm("hotel")
      },
      {
        "title": "交通接驳",
        "tab": getForm("vehicle")
      },
      {
        "title": "景点门票",
        "tab": getForm("scene")
      },
      {
        "title": "餐饮美食",
        "tab": getForm("restaurant")
      },
      {
        "title": "观光日游",
        "tab": getForm("tour")
      },
      {
        "title": "演出赛事",
        "tab": getForm("show")
      },
      {
        "title": "休闲娱乐",
        "tab": getForm("leisure")
      },      
      {
        "title": "旅行服务",
        "tab": getForm("service")
      }, 
      {
        "title": "租车/包车",
        "tab": getForm("car")
      },
      {
        "title": "导游",
        "tab": getForm("guide")
      },      
      {
        "title": "签证",
        "tab": getForm("visa")
      },
      {
        "title": "商品",
        "tab": getForm("goods")
      },
    ]
  }
};

//启动时
onMounted(() => {
  //装载AMIS
  // @ts-ignore
  var amis = amisRequire('amis/embed');
  //let amisScoped = amis.embed('#amisbox', props.amisjson);
  let amisScoped = amis.embed(tabnode, tabjson);

  console.log("got solution id ...", currentRoute.value.query.id);
  //根据id加载solution
  loadSolution(currentRoute.value.query.id);
  loadSections(currentRoute.value.query.id);
  loadPriceRules();//加载价格策略
})

function getItemTypeLogo(type) {
  return new URL('../../../assets/images/c2b/travel/'+type+'.png', import.meta.url).href
}
</script>