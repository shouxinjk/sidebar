<template>
  <!--所有已生成内容列表-->
  <div id="contents">
    
  </div>
  <Amis :amisnode="amisnode" :amisjson="amisjson"></Amis>   
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
import { contentFormTable } from './publish.data';

const amisnode = "#contents";
const amisjson = contentFormTable;


</script>