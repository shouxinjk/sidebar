import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '资源分类',
    align:"center",
    dataIndex: 'itemType_dictText'
   },
   {
    title: '商品分类',
    align:"center",
    dataIndex: 'itemCategoryId_dictText'
   },
   {
    title: '来源平台',
    align:"center",
    dataIndex: 'source_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '关键字',
    align:"center",
    dataIndex: 'keywords'
   },
   {
    title: 'URL',
    align:"center",
    dataIndex: 'url'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "资源分类",
      field: 'itemType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_item_type,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "商品分类",
      field: 'itemCategoryId',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "来源平台",
      field: 'source',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_platform_source,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "状态",
      field: 'status',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"active_status"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '资源分类',
    field: 'itemType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_item_type,name,id"
     },
  },
  {
    label: '商品分类',
    field: 'itemCategoryId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"mod_item_category,name,id",
        pidValue:"1",
    },
  },
  {
    label: '来源平台',
    field: 'source',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_platform_source,name,id"
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '关键字',
    field: 'keywords',
    component: 'Input',
  },
  {
    label: 'URL',
    field: 'url',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "active",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"active_status"
     },
  },
  {
    label: '扩展信息',
    field: 'extInfo',
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