import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: 'UserID',
    align:"center",
    dataIndex: 'externalUserid'
   },
   {
    title: 'UnionId',
    align:"center",
    dataIndex: 'unionId'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '企业ID',
    align:"center",
    dataIndex: 'corpId'
   },
   {
    title: '头像',
    align:"center",
    dataIndex: 'avatar'
   },
   {
    title: '类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '性别',
    align:"center",
    dataIndex: 'gender_dictText'
   },
   {
    title: '生日',
    align:"center",
    dataIndex: 'birthday',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '企业简称',
    align:"center",
    dataIndex: 'corpName'
   },
   {
    title: '企业全称',
    align:"center",
    dataIndex: 'corpFullName'
   },
   {
    title: '职位',
    align:"center",
    dataIndex: 'position'
   },
   {
    title: '会话存档',
    align:"center",
    dataIndex: 'msgArchive_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: 'UserID',
    field: 'externalUserid',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入UserID!'},
          ];
     },
  },
  {
    label: 'UnionId',
    field: 'unionId',
    component: 'Input',
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
    label: '企业ID',
    field: 'corpId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入企业ID!'},
          ];
     },
  },
  {
    label: '头像',
    field: 'avatar',
    component: 'Input',
  },
  {
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:""
     },
  },
  {
    label: '性别',
    field: 'gender',
    defaultValue: 0,
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"corp_ext_customer_type"
     },
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
  },
  {
    label: '企业简称',
    field: 'corpName',
    component: 'Input',
  },
  {
    label: '企业全称',
    field: 'corpFullName',
    component: 'Input',
  },
  {
    label: '职位',
    field: 'position',
    component: 'Input',
  },
  {
    label: '会话存档',
    field: 'msgArchive',
    defaultValue: "inactive",
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