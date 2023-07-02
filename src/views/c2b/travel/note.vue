<!-- 笔记界面：包含四列：section列表、solutionItem列表、noteItem列表、操作界面-->
<template>
  <div class="solution-head">
    <div class="solution-head-logo">
      <img src="../../../assets/images/c2b/travel.png" style="width:28px;height:28px;object-fit: cover;border-radius: 5px;margin:2px;"/>
    </div>
    <div class="solution-head-summary">
      <label>出发地：</label><input id="from" type="text" placeholder="出发地"  class="input-xs" v-model="hot.solution.extJson.from" />
      <label>目的地：</label><input id="destination" type="text" placeholder="目的地"  class="input-xs" v-model="hot.solution.extJson.region" />
      <label>人数：</label><input type="text" placeholder="人数" class="input-xs" v-model="hot.solution.extJson.persons"  style="width:24px;"/>
      <label>天数：</label><input type="text" placeholder="天数" class="input-xs" v-model="hot.solution.extJson.days"  style="width:24px;" />
      <label>出行日期：</label><a-date-picker valueFormat="YYYY-MM-DD" v-model:value="hot.solution.extJson.startDate" aria-readonly="true"/>
      <br/>
      <label>标题：</label><input id="name" type="text" placeholder="笔记名称"  class="input-lg" v-model="hot.note.name" @change="saveNote()"/>
      <label>标签：</label><input id="tags" type="text" placeholder="标签"  class="input-md" v-model="hot.note.tags" @change="saveNote()"/>
    </div>
    <!--
    <div class="solution-head-btn-img">
      <div class="solution-head-logo">
        <img src="../../../assets/images/ai.png" style="width:26px;height:26px;object-fit: cover;"/>
      </div>
      <div class="solution-head-btn" style="width: 60px;min-width: 20px;">AI规划</div>
    </div>
    -->
    <div @click="goSolution()" class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary">查看方案</div>
    <div class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary">复制笔记</div>
    <div @click="showTemplateList()" class="cxd-Button cxd-Button--default cxd-Button--size-default cxd-Button--primary bg-primary">内容生成</div>
  </div>
  <div class="solution-panel">
    <!--section列表-->
    <div class="solution-panel-section" style="width:15%;">
      <div v-for="(element,index) in solutionSections">
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
          </div>
        </div>
    </div>

    <!--solutionItem 列表-->
    <div class="solution-panel-section">
      <div class="solution-body-head">
        <div class="solution-body-head-summary">
          <div style="font-size:12px;">{{ hot.section.date }}</div>
        </div>
      </div>      
      <div v-for="(element,index) in solutionItems">
        <div class="solution-item-wrapper" v-bind:class="{ active: hot.item.id === element.id }" style="width:100%;">
            <div class="solution-item" @click="changeSolutionItem(element) ">
              <div class="solution-item-logo-wrapper">
                <img class="solution-item-logo" :src="getItemTypeLogo(element.type)"/>
              </div>
              <div class="solution-item-summary">
                {{ element.name }}
              </div>
            </div>
          </div>
      </div>
    </div>

    <!--笔记条目列表：可拖动排序，可删除或修改-->
    <div class="solution-panel-body" style="width:35%;">
      <div class="solution-body-head">
        <div class="solution-body-head-summary">
          <div style="font-size:12px;">{{ hot.section.extJson.region }} 行程笔记</div>
        </div>
      </div>
      <draggable
        :list="noteItems"
        item-key="id"
        class="list-group"
        ghost-class="ghost"
        :disable-transitions="false"
        :move="moveNoteItem"
        @start="itemDragging = true"
        @end="itemDragging = false"
      >
          <template #item="{ element, index }">
            <div class="solution-item-wrapper" style="width:100%;">
              <div class="note-item" @click="changeNoteItem(element) ">
                <div class="solution-item-logo-wrapper">
                  <div style="text-align: center;width:100%;">
                    <img class="content-type-logo" :src="getContentTypeLogo(element.contentType)"/>
                  </div>
                  <div style="text-align: center;width:100%;">
                    <span @click="removeNoteItem($event, element)" class="iconfont icon-shanchu sxbtn" style="width:60px;"></span>
                  </div>
                </div>
                <!--
                <div  v-html="element.content" class="solution-note-content">
                </div>
                -->
                <div class="solution-note-content">
                  <div v-if=" element.solutionItemId_dictText && element.solutionItemId_dictText.length>2 && itemTypes.indexOf(element.contentType) > -1 ">
                    <span class="iconfont icon-lianjie1 sxbtn" style="width:100%;font-size: 12px;color:grey;">{{ element.solutionItemId_dictText }}</span>
                  </div>
                  <div v-html="element.content">
                  </div>
                </div>
              </div>
            </div>
          </template>
      </draggable>
    </div>

    <!--所有笔记类型列表-->
    <div id="notetypes" class="solution-panel-option"  style="width: 30%;">
      
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
  @import 'note.less';
</style>

<!--引入AMIS扩展及iconfont-->
<style>
	@import "amis/sdk/helper.css";
</style>

<script setup lang="ts">
import {  onMounted } from "vue";
//import Amis from "../../amis/components/Amis.vue";
import {hot,solutionSections,solutionItems,noteItems, loadNote, changeSection, changeSolutionItem, 
  moveNoteItem, changeNoteItem, removeNoteItem, saveNote } from './note.api';
import { showTemplateList } from './content.api';
import draggable from 'vuedraggable'

import {spuForm,manualForm,materialForm,kbForm,aiForm} from './note.data.rw';
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';

import { useRouter } from 'vue-router' 
const { currentRoute, replace  } = useRouter();
//const id = this.$route.query.id;

const sectionDragging = false;
const itemDragging = false;

//提示文字颜色
const tipColors = {
  "error":"red",
  "warn":"orange",
  "success":"green"
};

const tabnode = "#notetypes";
const tabjson = {
  "type": "page",
  "name":"travel",
  "body": {
    "type": "tabs",
    "name": "sputabs",
    "tabs": [
      {
        "title": "资源库",
        "tab": spuForm
      },
      {
        "title": "素材库",
        "tab": materialForm
      },
      {
        "title": "知识库",
        "tab": kbForm
      },
      {
        "title": "AI生成",
        "tab": aiForm
      },
      {
        "title": "手动录入",
        "tab": manualForm
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

  console.log("got note id ...", currentRoute.value.query.id);
  //根据id加载note
  loadNote(currentRoute.value.query.id);

})

//显示方案详情
function goSolution(){
  console.log("try go solution.");
  replace({ path: '/c2b/travel/solution', query: { id: hot.solution.id } });
}

function getItemTypeLogo(type) {
  return new URL('../../../assets/images/c2b/travel/'+type+'.png', import.meta.url).href
}

let itemTypes = ["hotel","car","vehicle","scene","show","activity","tour","visa","guide","service","goods","ticket","restaurant"];
function getContentTypeLogo(type) {
  if(itemTypes.indexOf(type)>=0)
    return getItemTypeLogo(type);
  return new URL('../../../assets/images/c2b/content/'+type+'.png', import.meta.url).href
}
</script>