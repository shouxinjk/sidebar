import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '资源类型',
    align:"center",
    dataIndex: 'itemType_dictText'
   },
   {
    title: '方案条目',
    align:"center",
    dataIndex: 'solutionItemId_dictText'
   },
   {
    title: '方案章节',
    align:"center",
    dataIndex: 'solutionSectionId_dictText'
   },   
   {
    title: 'SPU',
    align:"center",
    dataIndex: 'spu_dictText'
   },
   {
    title: 'SKU',
    align:"center",
    dataIndex: 'sku_dictText'
   },
   {
    title: '数量',
    align:"center",
    dataIndex: 'amount'
   },
   {
    title: '单价',
    align:"center",
    dataIndex: 'price'
   },
   {
    title: 'SPU排序',
    align:"center",
    dataIndex: 'priorityspu'
   },
   {
    title: 'SKU排序',
    align:"center",
    dataIndex: 'prioritysku'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "资源类型",
      field: 'itemType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_item_type,name,id"
      },
      colProps: {span: 6},
 	},
  {
    label: "方案条目",
    field: 'solutionItemId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_item,name,id"
    },
    colProps: {span: 6},
  },
  {
    label: "方案章节",
    field: 'solutionSectionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_section,name,id"
    },
    colProps: {span: 6},
  },  
	{
      label: "SPU",
      field: 'spu',
      component: 'JSearchSelect',
      componentProps:{
         dict:"ope_item,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "SKU",
      field: 'sku',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_item_specific,name,id"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '方案条目',
    field: 'solutionItemId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_item,name,id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入方案条目!'},
          ];
     },
  }, 
  {
    label: '方案章节',
    field: 'solutionSectionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_section,name,id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入方案章节!'},
          ];
     },
  },   
  {
    label: '资源类型',
    field: 'itemType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_item_type,name,id"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入资源类型!'},
          ];
     },
  }, 
  {
    label: 'SPU',
    field: 'spu',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ope_item,name,id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入SPU!'},
          ];
     },
  },
  {
    label: 'SKU',
    field: 'sku',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_item_specific,name,id"
    },
  },
  {
    label: '数量',
    field: 'amount',
    component: 'InputNumber',
  },
  {
    label: '单价',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: 'SPU排序',
    field: 'priorityspu',
    defaultValue: 10,
    component: 'InputNumber',
  },
  {
    label: 'SKU排序',
    field: 'prioritysku',
    defaultValue: 10,
    component: 'InputNumber',
  },
  {
    label: 'SPU详情',
    field: 'spuInfo',
    component: 'InputTextArea',
  },
  {
    label: 'SKU详情',
    field: 'skuInfo',
    component: 'InputTextArea',
  },  
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