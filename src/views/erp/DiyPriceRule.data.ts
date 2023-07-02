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
    title: '资源类型',
    align:"center",
    dataIndex: 'itemType_dictText'
   },
   {
    title: '产品类型',
    align:"center",
    dataIndex: 'spu_dictText'
   },
   {
    title: '优先级',
    align:"center",
    dataIndex: 'priority'
   },
   {
    title: '默认加价%',
    align:"center",
    dataIndex: 'margin'
   },
   {
    title: '最小加价%',
    align:"center",
    dataIndex: 'marginMin'
   },
   {
    title: '最大加价%',
    align:"center",
    dataIndex: 'marginMax'
   },
   {
    title: '用户加价%',
    align:"center",
    dataIndex: 'marginUser'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
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
      label: "产品类型",
      field: 'spu',
      component: 'JSearchSelect',
      componentProps:{
         dict:"ope_item,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "优先级",
      field: 'priority',
      component: 'Input',
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
    label: '资源类型',
    field: 'itemType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_item_type,name,id"
     },
  },
  {
    label: '产品类型',
    field: 'spu',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ope_item,name,id"
    },
  },
  {
    label: '优先级',
    field: 'priority',
    defaultValue: 1,
    component: 'InputNumber',
  },
  {
    label: '默认加价%',
    field: 'margin',
    defaultValue: 15,
    component: 'InputNumber',
  },
  {
    label: '最小加价%',
    field: 'marginMin',
    defaultValue: 10,
    component: 'InputNumber',
  },
  {
    label: '最大加价%',
    field: 'marginMax',
    defaultValue: 30,
    component: 'InputNumber',
  },
  {
    label: '用户加价%',
    field: 'marginUser',
    defaultValue: 20,
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