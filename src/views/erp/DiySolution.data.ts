import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '订单号',
    align:"center",
    dataIndex: 'orderId_dictText'
   },
   {
    title: '主题',
    align:"center",
    dataIndex: 'schemeId_dictText'
   },
   {
    title: '引用方案',
    align:"center",
    dataIndex: 'referId_dictText'
   },
   {
    title: '报价',
    align:"center",
    dataIndex: 'price'
   },   
   {
    title: '状态',
    align:"center",
    dataIndex: 'solutionStatus_dictText'
   },
   {
    title: '置顶',
    align:"center",
    dataIndex: 'highlight',
    customRender:({text}) => {
       return  render.renderSwitch(text, [{text:'是',value:'Y'},{text:'否',value:'N'}])
     },
   },
   {
    title: '定制师',
    align:"center",
    dataIndex: 'brokerId_dictText'
   },
   {
    title: '定制用户',
    align:"center",
    dataIndex: 'thirdUserId_dictText'
   },
   /**
   {
    title: '标签',
    align:"center",
    dataIndex: 'tags'
   },

   {
    title: '用户昵称',
    align:"center",
    dataIndex: 'forNickname'
   },
   //** */
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "主题",
      field: 'schemeId',
      component: 'Input',
      colProps: {span: 6},
 	},
  {
    label: "定制师",
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
    colProps: {span: 6},
  },
  {
    label: "定制用户",
    field: 'thirdUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_third_account,realname,id"
    },
    colProps: {span: 6},
  },  
	{
      label: "引用方案",
      field: 'referId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_solution,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "订单",
      field: 'orderId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_solution_order,original_id,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "状态",
      field: 'solutionStatus',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"solution_status"
      },
      colProps: {span: 6},
 	},
   {
    label: "置顶",
    field: 'highlight',
    component: 'JSwitch',
    componentProps:{
         query:true,
     },
    colProps: {span: 6},
 },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '订单',
    field: 'orderId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_order,original_id,id"
    },
  },
  {
    label: '主题',
    field: 'schemeId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"diy_proposal_scheme,name,id",
        pidValue:"",
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入所属主题!'},
          ];
     },
  },
  {
    label: 'LOGO',
    field: 'logo',
    component: 'Input',
  },
  {
    label: '引用方案',
    field: 'referId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution,name,id"
    },
  },
  {
    label: '定制师',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
  },  
  {
    label: '定制用户',
    field: 'thirdUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_third_account,realname,id"
    },
  }, 
  {
    label: '标签',
    field: 'tags',
    component: 'InputTextArea',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '价格',
    field: 'price',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'solutionStatus',
    defaultValue: "pending",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"solution_status"
     },
  },
  {
    label: '置顶',
    field: 'highlight',
    defaultValue: "N",
     component: 'JSwitch',
     componentProps:{
     },
  },
  /**
  {
    label: '扩展信息',
    field: 'extInfo',
    component: 'InputTextArea',
  },
  {
    label: '目标用户',
    field: 'forOpenid',
    component: 'Input',
  },
  {
    label: '用户昵称',
    field: 'forNickname',
    component: 'Input',
  },
  {
    label: '定制用户',
    field: 'byOpenid',
    component: 'Input',
  },
  {
    label: '用户昵称',
    field: 'byNickname',
    component: 'Input',
  },
  {
    label: '关联商品',
    field: 'itemIds',
    component: 'InputTextArea',
  },
  {
    label: '文章列表',
    field: 'article',
    component: 'InputTextArea',
  },
  //** */
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];



/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}