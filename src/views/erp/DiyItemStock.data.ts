import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '资源',
    align:"center",
    dataIndex: 'spu_dictText'
   },
   {
    title: '产品',
    align:"center",
    dataIndex: 'sku_dictText'
   },
   {
    title: '日期',
    align:"center",
    dataIndex: 'stockDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '价格',
    align:"center",
    dataIndex: 'price'
   },
   {
    title: '数量',
    align:"center",
    dataIndex: 'amount'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "资源",
      field: 'spu',
      component: 'JSearchSelect',
      componentProps:{
         dict:"ope_item,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "产品",
      field: 'sku',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_item_specific,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "日期",
      field: 'stockDate',
      component: 'DatePicker',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '资源',
    field: 'spu',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ope_item,name,id"
    },
    dynamicDisabled:true
  },
  {
    label: '产品',
    field: 'sku',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_item_specific,name,id"
    },
    dynamicDisabled:true
  },
  {
    label: '日期',
    field: 'stockDate',
    component: 'DatePicker',
  },
  {
    label: '价格',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: '数量',
    field: 'amount',
    component: 'InputNumber',
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