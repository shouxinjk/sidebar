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
    title: '类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '连接器定义',
    align:"center",
    dataIndex: 'schemeId_dictText'
   },
   {
    title: '数据源',
    align:"center",
    dataIndex: 'platformSourceId_dictText'
   },
   {
    title: '参数配置',
    align:"center",
    dataIndex: 'platformAccountId_dictText'
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
      label: "类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"connector_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "连接器定义",
      field: 'schemeId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sto_connector_scheme,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "数据源",
      field: 'platformSourceId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_platform_source,name,id"
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
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"connector_type"
     },
  },
  {
    label: '连接器定义',
    field: 'schemeId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_connector_scheme,name,id"
    },
  },
  {
    label: '数据源',
    field: 'platformSourceId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_platform_source,name,id"
    },
  },
  {
    label: '参数配置',
    field: 'platformAccountId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_platform_account,name,id"
    },
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
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
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