import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '适用类目',
    align:"center",
    dataIndex: 'categoryId_dictText'
   },
   {
    title: '适用类型',
    align:"center",
    dataIndex: 'type_dictText'
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
   {
    title: '优先级',
    align:"center",
    dataIndex: 'priority'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "适用类目",
      field: 'categoryId',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "适用类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_item_type,name,id"
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
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '适用类目',
    field: 'categoryId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"mod_item_category,name,id",
        pidValue:"1",
    },
  },
  {
    label: '适用类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_item_type,name,id"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入适用类型!'},
          ];
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
  {
    label: '适用条件',
    field: 'criteria',
    component: 'InputTextArea',
  },
  {
    label: '脚本模板',
    field: 'expression',
    component: 'InputTextArea',
  },
  {
    label: '优先级',
    field: 'priority',
    component: 'InputNumber',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"active_status"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入状态!'},
          ];
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