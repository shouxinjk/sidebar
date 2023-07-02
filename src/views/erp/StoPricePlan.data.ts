import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '业务类型',
    align:"center",
    dataIndex: 'businessType_dictText'
   },
   {
    title: '订阅内容',
    align:"center",
    dataIndex: 'appId_dictText'
   },
   {
    title: '套餐名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '订阅时长',
    align:"center",
    dataIndex: 'durationType_dictText'
   },
   {
    title: '套餐价格',
    align:"center",
    dataIndex: 'price'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '级别',
    align:"center",
    dataIndex: 'priority'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "业务类型",
      field: 'businessType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_business_type,name,id"
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
      label: "套餐名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "订阅时长",
      field: 'durationType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"duration_type"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '业务类型',
    field: 'businessType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_business_type,name,id"
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
    label: '套餐名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '订阅时长',
    field: 'durationType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"duration_type"
     },
  },
  {
    label: '套餐价格',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '级别',
    field: 'priority',
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