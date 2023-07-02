import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属应用',
    align:"center",
    dataIndex: 'appId_dictText'
   },
   {
    title: '资源编码',
    align:"center",
    dataIndex: 'code_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "所属应用",
      field: 'appId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_software,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "资源编码",
      field: 'code',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"price_resource_type"
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
    label: '所属应用',
    field: 'appId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_software,name,id"
     },
  },
  {
    label: '资源编码',
    field: 'code',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"price_resource_type"
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