import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '标题',
    align:"center",
    dataIndex: 'title'
   },
   {
    title: '资源类型',
    align:"center",
    dataIndex: 'stockType_dictText'
   },
   {
    title: '所属笔记',
    align:"center",
    dataIndex: 'solutionNoteId_dictText'
   },
   {
    title: '所属方案',
    align:"center",
    dataIndex: 'solutionId_dictText'
   },
   {
    title: '所属资源',
    align:"center",
    dataIndex: 'itemId_dictText'
   },
   {
    title: '生成模板',
    align:"center",
    dataIndex: 'templateId_dictText'
   },
   {
    title: '内容类型',
    align:"center",
    dataIndex: 'contentType_dictText'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "资源类型",
      field: 'stockType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"stock_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "生成模板",
      field: 'templateId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"mod_template,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "内容类型",
      field: 'contentType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"content_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "状态",
      field: 'status',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"gen_status"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '摘要',
    field: 'summary',
    component: 'Input',
  },
  {
    label: '资源类型',
    field: 'stockType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"stock_type"
     },
  },
  {
    label: '所属笔记',
    field: 'solutionNoteId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_note,name,id"
    },
  },
  {
    label: '所属方案',
    field: 'solutionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution,name,id"
    },
  },
  {
    label: '所属资源',
    field: 'itemId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ope_item,name,id"
    },
  },
  {
    label: '生成模板',
    field: 'templateId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"mod_template,name,id"
     },
  },
  {
    label: '内容类型',
    field: 'contentType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"content_type"
     },
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "pending",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"gen_status"
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