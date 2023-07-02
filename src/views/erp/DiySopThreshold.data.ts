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
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: 'SOP类型',
    align:"center",
    dataIndex: 'sopType_dictText'
   },
   {
    title: 'SOP事件',
    align:"center",
    dataIndex: 'eventType_dictText'
   },
   {
    title: '触发类型',
    align:"center",
    dataIndex: 'triggerType_dictText'
   },
   {
    title: '阈值',
    align:"center",
    dataIndex: 'threshold'
   },
   {
    title: '响应类型',
    align:"center",
    dataIndex: 'actionType_dictText'
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
      label: "SOP类型",
      field: 'sopType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sop_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "SOP事件",
      field: 'eventType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sop_event_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "触发类型",
      field: 'triggerType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sop_trigger_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "响应类型",
      field: 'actionType',
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
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: 'SOP类型',
    field: 'sopType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sop_type"
     },
  },
  {
    label: 'SOP事件',
    field: 'eventType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sop_event_type"
     },
  },
  {
    label: '触发类型',
    field: 'triggerType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sop_trigger_type"
     },
  },
  {
    label: '阈值',
    field: 'threshold',
    component: 'InputNumber',
  },
  {
    label: '响应类型',
    field: 'actionType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sop_action_type"
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