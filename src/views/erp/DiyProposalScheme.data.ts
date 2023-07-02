import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  /**
   {
    title: '父类型',
    align: 'center',
    dataIndex: 'pid_dictText'
   },
   {
    title: '定制方式',
    align: 'center',
    dataIndex: 'type_dictText'
   },
   //** */
   {
    title: '名称',
    align: 'left',
    dataIndex: 'name'
   },
   {
    title: '描述',
    align: 'center',
    dataIndex: 'description'
   },
   {
    title: '优先级',
    align: 'center',
    dataIndex: 'priority'
   },
   {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText'
   },
   {
    title: '更新时间',
    align: 'center',
    dataIndex: 'updateTime'
   },
   /**
   {
    title: '类目',
    align: 'center',
    dataIndex: 'categoryId_dictText'
   },
   {
    title: 'LOGO',
    align: 'center',
    dataIndex: 'logo'
   },
   {
    title: '表单',
    align: 'center',
    dataIndex: 'formId_dictText'
   },
   {
    title: '商品类别',
    align: 'center',
    dataIndex: 'category'
   },
   {
    title: '创建达人',
    align: 'center',
    dataIndex: 'brokerId_dictText'
   },
   //** */
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: "名称",
    field: "name",
    component: 'Input',
    colProps: {span: 6},
   },
   /** 
	{
      label: "父类型",
      field: "pid",
      component: 'JTreeSelect',
      componentProps:{
         dict:"diy_proposal_scheme,name,id",
         pidField:"pid",
         hasChildField:"has_child",
         pidValue:"",
     },
      colProps: {span: 6},
     },
	{
      label: "定制方式",
      field: "type",
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"solution_type"
      },
      colProps: {span: 6},
     },
	{
      label: "类目",
      field: "categoryId",
      component: 'JTreeSelect',
      componentProps:{
         dict:"mod_item_category,name,id",
         pidField:"pid",
         hasChildField:"has_child",
         pidValue:"1",
     },
      colProps: {span: 6},
     },
     //** */
];
//表单数据
export const formSchema: FormSchema[] = [
  /**
  {
    label: '父类型',
    field: 'pid',
    component: 'JTreeSelect',
    componentProps: {
      dict: "diy_proposal_scheme,name,id",
      pidField: "pid",
      pidValue: "0",
      hasChildField: "has_child",
    },
  },
  {
    label: '定制方式',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"solution_type"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入定制方式!'},
          ];
     },
  },
  {
    label: 'LOGO',
    field: 'logo',
    component: 'Input',
  },
  {
    label: '表单',
    field: 'formId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"diy_form,name,id"
     },
  },
  {
    label: '商品类别',
    field: 'category',
    component: 'Input',
  },
  {
    label: '创建达人',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
  },
    {
    label: '类目',
    field: 'categoryId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"mod_item_category,name,id",
        pidField:"pid",
        hasChildField:"has_child",
        pidValue:"1",
    },
  },
  //** */
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
    label: '优先级',
    field: 'priority',
    defaultValue: 1,
    component: 'InputNumber',
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "0",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"active_status"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入激活!'},
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
