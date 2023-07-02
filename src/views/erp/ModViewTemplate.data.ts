import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '内容类型',
    align:"center",
    dataIndex: 'contentType_dictText'
   },
   {
    title: '模板类别',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '模板格式',
    align:"center",
    dataIndex: 'subType_dictText'
   },
   {
    title: '适用资源',
    align:"center",
    dataIndex: 'itemType_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: 'Logo图片',
    align:"center",
    dataIndex: 'logo'
   },
   {
    title: '优先级',
    align:"center",
    dataIndex: 'priority'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '价格',
    align:"center",
    dataIndex: 'price'
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
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "内容类型",
      field: 'contentType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"content_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "模板类别",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"template_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "模板格式",
      field: 'subType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"format_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "适用资源",
      field: 'itemType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"stock_type"
      },
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
	{
      label: "租户",
      field: 'tenantId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sys_tenant,name,id"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '内容类型',
    field: 'contentType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"content_type"
     },
  },
  {
    label: '模板类别',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"template_type"
     },
  },
  {
    label: '模板格式',
    field: 'subType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"format_type"
     },
  },
  {
    label: '适用资源',
    field: 'itemType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"stock_type"
     },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: 'Logo图片',
    field: 'logo',
    component: 'Input',
  },
  {
    label: '表达式',
    field: 'expression',
    component: 'InputTextArea',
  },
  {
    label: '优先级',
    field: 'priority',
    component: 'InputNumber',
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '价格',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"active_status"
     },
  },
  {
    label: '租户',
    field: 'tenantId',
    defaultValue: 0,
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sys_tenant,name,id"
     },
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