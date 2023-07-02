<template>
  <!--采用图文卡片显示所有apps-->
  <div id="amispage">
    
  </div>
  <Amis :amisnode="tabnode" :amisjson="table"></Amis>   
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
import { getUrlParam } from '/@/utils';
import Amis from "../amis/components/Amis.vue";
import { getTable } from './templates.data';
const tabnode = "#amispage";

const table = getTable( "poster" );

</script>