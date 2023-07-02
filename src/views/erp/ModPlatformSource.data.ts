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
    title: '所属平台',
    align:"center",
    dataIndex: 'platform_dictText'
   },
   {
    title: '业务领域',
    align:"center",
    dataIndex: 'category'
   },
   {
    title: '平台大类',
    align:"center",
    dataIndex: 'platformCategory_dictText'
   },
   {
    title: '平台小类',
    align:"center",
    dataIndex: 'platformType_dictText'
   },
   {
    title: '收益类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
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
      label: "名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "所属平台",
      field: 'platform',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"source_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "业务领域",
      field: 'category',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "平台大类",
      field: 'platformCategory',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"platform_category"
      },
      colProps: {span: 6},
 	},
	{
      label: "平台小类",
      field: 'platformType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"platform_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "收益类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"profit_type"
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
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '所属平台',
    field: 'platform',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"source_type"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入所属平台!'},
          ];
     },
  },
  {
    label: '业务领域',
    field: 'category',
    component: 'Input',
  },
  {
    label: '平台大类',
    field: 'platformCategory',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"platform_category"
     },
  },
  {
    label: '平台小类',
    field: 'platformType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"platform_type"
     },
  },
  {
    label: '收益类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"profit_type"
     },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: 'URL',
    field: 'url',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "0",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"active_status"
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