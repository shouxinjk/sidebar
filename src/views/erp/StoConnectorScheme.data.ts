import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: 'LOGO',
    align:"center",
    dataIndex: 'logo',
    customRender:render.renderImage,
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '所属平台',
    align:"center",
    dataIndex: 'platformSourceId_dictText'
   },
   {
    title: '类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '授权类型',
    align:"center",
    dataIndex: 'platformGrantType_dictText'
   },
   {
    title: '参数配置',
    align:"center",
    dataIndex: 'platformAccountId_dictText'
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
      field: 'platformSourceId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_platform_source,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"connector_type"
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
    label: 'LOGO',
    field: 'logo',
     component: 'JImageUpload',
     componentProps:{
      },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '所属平台',
    field: 'platformSourceId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_platform_source,name,id"
    },
  },
  {
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"connector_type"
     },
  },
  {
    label: '授权类型',
    field: 'platformGrantType',
    defaultValue: "none",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"oauth_grant_type"
     },
  },
  {
    label: '参数配置',
    field: 'platformAccountId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_platform_account_scheme,name,id"
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '价格',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "inactive",
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