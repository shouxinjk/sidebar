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
    title: '类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: 'LOGO',
    align:"center",
    dataIndex: 'logo',
    customRender:render.renderImage,
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
    title: '企微套件',
    align:"center",
    dataIndex: 'suiteId'
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
      label: "类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"app_type"
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
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"app_type"
     },
  },
  {
    label: 'LOGO',
    field: 'logo',
     component: 'JImageUpload',
     componentProps:{
      },
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
    label: '企微票据',
    field: 'suiteTicket',
    component: 'Input',
  },
  {
    label: '企微套件',
    field: 'suiteId',
    component: 'Input',
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