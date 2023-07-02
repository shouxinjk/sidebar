<template>
  <!--表单描述-->
  <div>
    请填写表单内容：TODO 改造为查询数据库
  </div>
  <!--Amis表单-->
  <div id="amisbox">
    
  </div>  
  <Amis :amisnode="amisnode" :amisjson="amisjson"></Amis>
</template>
<script setup lang="ts">
import Amis from "./components/Amis.vue";

const amisnode = "#amisbox";
const amisjson = {
  type: 'form',
  id: "userinfo",
  data: {
    name: 'Alex Chew',
    email: 'alex_chew@msn.com'
  },
  mode: 'horizontal',
  body: [
    {
      label: 'Name',
      type: 'input-text',
      name: 'name'
    },
    {
      label: 'Email',
      type: 'input-email',
      name: 'email'
    },
    {
      type: 'button',
      label: '按钮修改',
      onClick: (e, props) => {
        console.log('消息通知');
        //props.formStore.setValues({name: 'amis'});
        doChangeForm(props);
      }
    }
  ]
}

function doChangeForm(props){
  props.formStore.setValues({name: 'amis', email: 'email'});
}

</script>