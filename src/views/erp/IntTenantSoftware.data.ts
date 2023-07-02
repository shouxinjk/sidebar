import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '创建日期',
    align:"center",
    dataIndex: 'createTime'
   },
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
   {
    title: 'SaaS',
    align:"center",
    dataIndex: 'softwareId_dictText'
   },
   {
    title: 'CODE',
    align:"center",
    dataIndex: 'code'
   },
   {
    title: '产品套餐',
    align:"center",
    dataIndex: 'salePackageId_dictText'
   },
   {
    title: '订阅计划',
    align:"center",
    dataIndex: 'pricePlanId_dictText'
   },
   {
    title: '生效时间',
    align:"center",
    dataIndex: 'effectiveOn'
   },
   {
    title: '截止时间',
    align:"center",
    dataIndex: 'expireOn'
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
	{
      label: "SaaS",
      field: 'softwareId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sto_software,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "产品套餐",
      field: 'salePackageId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sto_sale_package,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "订阅计划",
      field: 'pricePlanId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sto_price_plan,name,id"
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
    label: 'SaaS',
    field: 'softwareId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_software,name,id"
    },
  },
  {
    label: 'CODE',
    field: 'code',
    component: 'Input',
  },
  {
    label: '产品套餐',
    field: 'salePackageId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_sale_package,name,id"
    },
  },
  {
    label: '订阅计划',
    field: 'pricePlanId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_price_plan,name,id"
    },
  },
  {
    label: '生效时间',
    field: 'effectiveOn',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '截止时间',
    field: 'expireOn',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
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