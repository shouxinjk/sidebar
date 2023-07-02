<template>
  <!--所有SKU列表-->
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
</style>

<script setup lang="ts">
import Amis from "../../amis/components/Amis.vue";
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';
import {getForm} from './sku.data.rw';

const tabnode = "#itemtypes";
const tabjson = {
  "type": "page",
  "body": {
    "type": "tabs",
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


</script>