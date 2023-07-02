<template>
  <!--按照SKU显示日历库存，并指示库存设置-->
  <div id="amispage">
    
  </div>
  <Amis :amisnode="tabnode" :amisjson="formStock"></Amis>   
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
import {formStock} from './sku.data.stock';
const tabnode = "#amispage";

</script>