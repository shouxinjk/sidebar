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
    dataIndex: 'platformSourceId_dictText'
   },
   {
    title: '账号类型',
    align:"center",
    dataIndex: 'accountSchemeId_dictText'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
    customRender:({text}) => {
       return  render.renderSwitch(text, [{text:'是',value:'Y'},{text:'否',value:'N'}])
     },
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
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"mod_platform_source,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "账号类型",
      field: 'accountSchemeId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_platform_account_scheme,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "状态",
      field: 'status',
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
    label: '所属平台',
    field: 'platformSourceId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"mod_platform_source,name,id"
     },
  },
  {
    label: '账号类型',
    field: 'accountSchemeId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_platform_account_scheme,name,id"
     },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '访问信息',
    field: 'accessInfo',
    component: 'InputTextArea',
  },
  {
    label: '状态',
    field: 'status',
     component: 'JSwitch',
     componentProps:{
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