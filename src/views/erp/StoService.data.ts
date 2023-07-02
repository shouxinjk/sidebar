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
    title: '大类',
    align:"center",
    dataIndex: 'category_dictText'
   },
   {
    title: '小类',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: 'LOGO',
    align:"center",
    dataIndex: 'logo'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '编码',
    align:"center",
    dataIndex: 'code'
   },
   {
    title: '版本',
    align:"center",
    dataIndex: 'version'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '体验',
    align:"center",
    dataIndex: 'demo',
    slots: { customRender: 'htmlSlot' },
   },
   {
    title: '购买价格',
    align:"center",
    dataIndex: 'pricePurchase'
   },
   {
    title: '使用价格',
    align:"center",
    dataIndex: 'priceCost'
   },
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "大类",
      field: 'category',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"service_category"
      },
      colProps: {span: 6},
 	},
	{
      label: "小类",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"service_type"
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
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '大类',
    field: 'category',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"service_category"
     },
  },
  {
    label: '小类',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"service_type"
     },
  },
  {
    label: 'LOGO',
    field: 'logo',
    component: 'Input',
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
    label: '编码',
    field: 'code',
    component: 'Input',
  },
  {
    label: '版本',
    field: 'version',
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '体验',
    field: 'demo',
    component: 'JEditor',
  },
  {
    label: '购买价格',
    field: 'pricePurchase',
    component: 'InputNumber',
  },
  {
    label: '使用价格',
    field: 'priceCost',
    component: 'InputNumber',
  },
  {
    label: '租户',
    field: 'tenantId',
    defaultValue: 0,
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
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