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
    title: '产品套餐',
    align:"center",
    dataIndex: 'salePackageId_dictText'
   },
   {
    title: '生效日期',
    align:"center",
    dataIndex: 'effectiveOn',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '到期日期',
    align:"center",
    dataIndex: 'expireOn',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
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
      label: "租户",
      field: 'tenantId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sys_tenant,name,id"
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
    label: '租户',
    field: 'tenantId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
    },
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
    label: '生效日期',
    field: 'effectiveOn',
    component: 'DatePicker',
  },
  {
    label: '到期日期',
    field: 'expireOn',
    component: 'DatePicker',
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "active",
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