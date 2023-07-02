import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '名称',
    align: 'left',
    dataIndex: 'name'
   },
   {
    title: '描述',
    align: 'center',
    dataIndex: 'description'
   },
   {
    title: '图标',
    align: 'center',
    dataIndex: 'icon'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "父分类",
      field: "pid",
      component: 'JTreeSelect',
      componentProps:{
         dict:"knowledge_category,name,id",
         pidField:"pid",
         hasChildField:"has_child",
         pidValue:"0",
     },
      colProps: {span: 6},
     },
	{
      label: "名称",
      field: "name",
      component: 'Input',
      colProps: {span: 6},
     },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '父分类',
    field: 'pid',
    component: 'JTreeSelect',
    componentProps: {
      dict: "knowledge_category,name,id",
      pidField: "pid",
      pidValue: "0",
      hasChildField: "has_child",
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
    label: '图标',
    field: 'icon',
    component: 'Input',
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
