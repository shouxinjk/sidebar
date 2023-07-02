import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属笔记',
    align:"center",
    dataIndex: 'solutionNoteId_dictText'
   },
   {
    title: '方案条目',
    align:"center",
    dataIndex: 'solutionItemId_dictText'
   },
   {
    title: '所属章节',
    align:"center",
    dataIndex: 'sectionId_dictText'
   },
   {
    title: '内容名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '内容类型',
    align:"center",
    dataIndex: 'contentType_dictText'
   },
   {
    title: '笔记内容',
    align:"center",
    dataIndex: 'content',
    slots: { customRender: 'htmlSlot' },
   },
   {
    title: '位置序号',
    align:"center",
    dataIndex: 'priority'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "所属笔记",
      field: 'solutionNoteId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_solution_note,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "所属章节",
      field: 'sectionId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_proposal_section,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "内容名称",
      field: 'name',
      component: 'Input',
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
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属笔记',
    field: 'solutionNoteId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_note,name,id"
    },
  },
  {
    label: '方案条目',
    field: 'solutionItemId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_item,name,id"
    },
  },
  {
    label: '所属章节',
    field: 'sectionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_proposal_section,name,id"
    },
  },
  {
    label: '内容名称',
    field: 'name',
    component: 'Input',
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
    label: '笔记内容',
    field: 'content',
    component: 'JEditor',
  },
  {
    label: '位置序号',
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