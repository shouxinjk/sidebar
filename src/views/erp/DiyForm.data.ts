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
    title: '适用资源',
    align:"center",
    dataIndex: 'itemType_dictText'
   },
   /**
   {
    title: '适用页面',
    align:"center",
    dataIndex: 'pageType_dictText'
   },
   {
    title: '适用终端',
    align:"center",
    dataIndex: 'clientType_dictText'
   },
   //** */
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "适用资源",
      field: 'itemType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_item_type,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "适用页面",
      field: 'pageType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"page_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "适用终端",
      field: 'clientType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"client_type"
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
    label: '适用资源',
    field: 'itemType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_item_type,name,id"
     },
  },
  {
    label: '适用页面',
    field: 'pageType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"page_type"
     },
  },
  {
    label: '适用终端',
    field: 'clientType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"client_type"
     },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入名称!'},
          ];
     },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: 'JSON',
    field: 'json',
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