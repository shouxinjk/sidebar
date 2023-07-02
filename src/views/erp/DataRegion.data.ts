import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '上级',
    align: 'center',
    dataIndex: 'pid_dictText'
   },
   {
    title: '中文名称',
    align: 'left',
    dataIndex: 'name'
   },
   {
    title: '英文名称',
    align: 'center',
    dataIndex: 'nameEn'
   },
   {
    title: '中文拼音',
    align: 'center',
    dataIndex: 'namePinyin'
   },
   {
    title: '代码',
    align: 'center',
    dataIndex: 'code'
   },
   {
    title: '层级',
    align: 'center',
    dataIndex: 'level'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "上级",
      field: "pid",
      component: 'JTreeSelect',
      componentProps:{
         dict:"data_region,name,id",
         pidField:"pid",
         hasChildField:"has_child",
         pidValue:"0",
     },
      colProps: {span: 6},
     },
	{
      label: "中文名称",
      field: "name",
      component: 'Input',
      colProps: {span: 6},
     },
	{
      label: "英文名称",
      field: "nameEn",
      component: 'Input',
      colProps: {span: 6},
     },
	{
      label: "代码",
      field: "code",
      component: 'Input',
      colProps: {span: 6},
     },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '上级',
    field: 'pid',
    component: 'JTreeSelect',
    componentProps: {
      dict: "data_region,name,id",
      pidField: "pid",
      pidValue: "0",
      hasChildField: "has_child",
    },
  },
  {
    label: '中文名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '英文名称',
    field: 'nameEn',
    component: 'Input',
  },
  {
    label: '中文拼音',
    field: 'namePinyin',
    component: 'Input',
  },
  {
    label: '代码',
    field: 'code',
    component: 'Input',
  },
  {
    label: '层级',
    field: 'level',
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
