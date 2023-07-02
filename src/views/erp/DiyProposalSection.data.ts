import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属类目',
    align:"center",
    dataIndex: 'categoryId_dictText'
   },
   {
    title: '所属主题',
    align:"center",
    dataIndex: 'schemeId_dictText'
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
    title: '排序先后',
    align:"center",
    dataIndex: 'priority'
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
      label: "所属类目",
      field: 'categoryId',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "所属主题",
      field: 'schemeId',
      component: 'Input',
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
    label: '所属类目',
    field: 'categoryId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"mod_item_category,name,id",
        pidValue:"1",
    },
  },
  {
    label: '所属主题',
    field: 'schemeId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"diy_proposal_scheme,name,id",
        pidValue:"",
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入所属主题!'},
          ];
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
    component: 'Input',
  },
  {
    label: '排序先后',
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