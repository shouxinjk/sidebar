import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '订阅租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
   {
    title: '订阅内容',
    align:"center",
    dataIndex: 'appId_dictText'
   },
   {
    title: '订阅资源',
    align:"center",
    dataIndex: 'resourceId_dictText'
   },
   {
    title: '使用数量',
    align:"center",
    dataIndex: 'amount'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "订阅租户",
      field: 'tenantId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sys_tenant,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "订阅内容",
      field: 'appId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_software,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "订阅资源",
      field: 'resourceId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_price_resource,name,id"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '订阅租户',
    field: 'tenantId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sys_tenant,name,id"
     },
  },
  {
    label: '订阅内容',
    field: 'appId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_software,name,id"
     },
  },
  {
    label: '订阅资源',
    field: 'resourceId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_price_resource,name,id"
     },
  },
  {
    label: '使用数量',
    field: 'amount',
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