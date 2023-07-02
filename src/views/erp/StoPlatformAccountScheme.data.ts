import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属平台',
    align:"center",
    dataIndex: 'platformSourceId_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '访问入口',
    align:"center",
    dataIndex: 'endpoint'
   },
   {
    title: '配置表单',
    align:"center",
    dataIndex: 'configForm_dictText'
   },
   {
    title: '配置指南',
    align:"center",
    dataIndex: 'configGuide',
    slots: { customRender: 'htmlSlot' },
   },
   {
    title: '参考链接',
    align:"center",
    dataIndex: 'configUrl'
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
      label: "所属平台",
      field: 'platformSourceId',
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
    label: '所属平台',
    field: 'platformSourceId',
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
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '访问入口',
    field: 'endpoint',
    component: 'Input',
  },
  {
    label: '配置表单',
    field: 'configForm',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_form,name,id"
    },
  },
  {
    label: '配置指南',
    field: 'configGuide',
    component: 'JEditor',
  },
  {
    label: '参考链接',
    field: 'configUrl',
    component: 'Input',
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