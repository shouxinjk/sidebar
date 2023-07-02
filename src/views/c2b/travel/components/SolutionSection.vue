<template>
  <div id="box"></div>
</template>

<!--引入扩展css-->
<style>
	@import "amis/sdk/helper.css";
</style>

<script lang="ts" setup>
import {  onMounted } from "vue";
const props= defineProps({
  amisnode: {
      type: String,
      required: true
  },
  amisjson: {
      type: Object,
      required: true
  }
})

onMounted(() => {
  // @ts-ignore
  var amis = amisRequire('amis/embed');
  //let amisScoped = amis.embed('#amisbox', props.amisjson);
  let amisScoped = amis.embed(props.amisnode, props.amisjson);
})
</script>