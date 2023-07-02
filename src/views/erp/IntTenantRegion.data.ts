import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '地区',
    align:"center",
    dataIndex: 'regionId_dictText'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: 'LOGO',
    align:"center",
    dataIndex: 'logo'
   },
   {
    title: '更新日期',
    align:"center",
    dataIndex: 'updateTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '地区',
    field: 'regionId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"data_region,name,id",
        pidValue:"0",
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: 'LOGO',
    field: 'logo',
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