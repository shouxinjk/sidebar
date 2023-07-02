import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '关联品类',
    align:"center",
    dataIndex: 'categoryId_dictText'
   },
   {
    title: '关联达人',
    align:"center",
    dataIndex: 'brokerId_dictText'
   },
   {
    title: '勋章等级',
    align:"center",
    dataIndex: 'badgeId_dictText'
   },
   {
    title: '申请者姓名',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '申请者公司',
    align:"center",
    dataIndex: 'company'
   },
   {
    title: '申请者职位',
    align:"center",
    dataIndex: 'job'
   },
   {
    title: '申请者描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status'
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '删除标记',
    align:"center",
    dataIndex: 'delFlag'
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createTime'
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
      label: "关联品类",
      field: 'categoryId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_item_category,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "关联达人",
      field: 'brokerId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_broker,nickname,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "勋章等级",
      field: 'badgeId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_badge,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "申请者姓名",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '关联品类',
    field: 'categoryId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_item_category,name,id"
    },
  },
  {
    label: '关联达人',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入关联达人!'},
          ];
     },
  },
  {
    label: '勋章等级',
    field: 'badgeId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_badge,name,id"
    },
  },
  {
    label: '申请者姓名',
    field: 'name',
    component: 'Input',
  },
  {
    label: '申请者公司',
    field: 'company',
    component: 'Input',
  },
  {
    label: '申请者职位',
    field: 'job',
    component: 'Input',
  },
  {
    label: '申请者描述',
    field: 'description',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'Input',
  },
  {
    label: '创建时间',
    field: 'createDate',
    component: 'DatePicker',
  },
  {
    label: '更新时间',
    field: 'updateDate',
    component: 'DatePicker',
  },
  {
    label: '删除标记',
    field: 'delFlag',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入删除标记!'},
          ];
     },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '更新时间',
    field: 'updateTime',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
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