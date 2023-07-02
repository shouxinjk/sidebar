import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属方案',
    align:"center",
    dataIndex: 'solutionId_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: 'LOGO',
    align:"center",
    dataIndex: 'logo'
   },
   {
    title: '排序',
    align:"center",
    dataIndex: 'priority'
   },
   {
    title: '详细信息',
    align:"center",
    dataIndex: 'extInfo'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "所属方案",
      field: 'solutionId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_solution,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属方案',
    field: 'solutionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution,name,id"
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: 'LOGO',
    field: 'logo',
    component: 'Input',
  },
  {
    label: '排序',
    field: 'priority',
    defaultValue: 10,
    component: 'InputNumber',
  },
  {
    label: '详细信息',
    field: 'extInfo',
    defaultValue: "{}",
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