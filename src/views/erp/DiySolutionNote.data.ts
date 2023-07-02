import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属方案',
    align:"center",
    dataIndex: 'solutionId_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '标签',
    align:"center",
    dataIndex: 'tags'
   },
   {
    title: '笔记类型',
    align:"center",
    dataIndex: 'noteType_dictText'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '定制师',
    align:"center",
    dataIndex: 'brokerId_dictText'
   },
   {
    title: '定制用户',
    align:"center",
    dataIndex: 'thirdUserId_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "所属方案",
      field: 'solutionId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_solution,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "笔记类型",
      field: 'noteType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"note_type"
      },
      colProps: {span: 6},
 	},
   {
    label: '定制师',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
  }, 
  {
    label: '定制用户',
    field: 'thirdUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_third_account,realname,id"
    },
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
    label: '所属方案',
    field: 'solutionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution,name,id"
    },
  },
  {
    label: '定制师',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
  },  
  {
    label: '定制用户',
    field: 'thirdUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_third_account,realname,id"
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
    label: '标题图片',
    field: 'logo',
    component: 'Input',
  },
  {
    label: '标签',
    field: 'tags',
    component: 'Input',
  },
  {
    label: '笔记类型',
    field: 'noteType',
    defaultValue: "designer",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"note_type"
     },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"active_status"
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