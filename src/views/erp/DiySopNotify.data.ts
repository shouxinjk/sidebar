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
    title: '适用部门',
    align:"center",
    dataIndex: 'departmentId_dictText'
   },
   {
    title: '事件类型',
    align:"center",
    dataIndex: 'sopActionType_dictText'
   },
   {
    title: 'Webhook',
    align:"center",
    dataIndex: 'webhook'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "适用部门",
      field: 'departmentId',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "事件类型",
      field: 'sopActionType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sop_action_type"
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
    label: '适用部门',
    field: 'departmentId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"sys_depart,depart_name,id",
        pidValue:"",
    },
  },
  {
    label: '事件类型',
    field: 'sopActionType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sop_action_type"
     },
  },
  {
    label: 'Webhook',
    field: 'webhook',
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