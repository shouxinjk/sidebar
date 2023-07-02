<template>
  <!--采用图文卡片显示所有apps-->
  <div id="amispage">
    
  </div>
  <Amis :amisnode="tabnode" :amisjson="tableApps"></Amis>   
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
import {tableApps} from './connectorSchemes.data';
const tabnode = "#amispage";

</script>