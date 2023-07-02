import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '分类',
    align:"center",
    dataIndex: 'knowledgeCategoryId_dictText'
   },
   {
    title: '标题',
    align:"center",
    dataIndex: 'title'
   },
   {
    title: '标签',
    align:"center",
    dataIndex: 'tags'
   },
   {
    title: '内容',
    align:"center",
    dataIndex: 'content',
    slots: { customRender: 'htmlSlot' },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "分类",
      field: 'knowledgeCategoryId',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "标题",
      field: 'title',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "标签",
      field: 'tags',
      component: 'Input',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '分类',
    field: 'knowledgeCategoryId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"knowledge_category,name,id",
        pidValue:"0",
    },
  },
  {
    label: '标题',
    field: 'title',
    component: 'Input',
  },
  {
    label: '标签',
    field: 'tags',
    component: 'Input',
  },
  {
    label: '内容',
    field: 'content',
    component: 'JEditor',
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