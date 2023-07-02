import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
   {
    title: '虚拟豆',
    align:"center",
    dataIndex: 'points'
   },
   {
    title: '金币',
    align:"center",
    dataIndex: 'coins'
   },
   {
    title: '贡献度',
    align:"center",
    dataIndex: 'credits'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "租户",
      field: 'tenantId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sys_tenant,name,id"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '租户',
    field: 'tenantId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
    },
  },
  {
    label: '虚拟豆',
    field: 'points',
    component: 'InputNumber',
  },
  {
    label: '金币',
    field: 'coins',
    component: 'InputNumber',
  },
  {
    label: '贡献度',
    field: 'credits',
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