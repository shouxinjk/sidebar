import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '成员ID',
    align:"center",
    dataIndex: 'userId'
   },
   {
    title: '群ID',
    align:"center",
    dataIndex: 'chatId_dictText'
   },
   {
    title: '企业ID',
    align:"center",
    dataIndex: 'corpId_dictText'
   },
   {
    title: 'UnionId',
    align:"center",
    dataIndex: 'unionId'
   },
   {
    title: '加群时间',
    align:"center",
    dataIndex: 'joinTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '加入方式',
    align:"center",
    dataIndex: 'joinScene'
   },
   {
    title: '成员类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '邀请人',
    align:"center",
    dataIndex: 'invitor'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "群ID",
      field: 'chatId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"ww_group,name,chat_id"
      },
      colProps: {span: 6},
 	},
	{
      label: "成员类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"group_member_type"
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
    label: '成员ID',
    field: 'userId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入成员ID!'},
          ];
     },
  },
  {
    label: '群ID',
    field: 'chatId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ww_group,name,chat_id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入群ID!'},
          ];
     },
  },
  {
    label: '企业ID',
    field: 'corpId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ww_auth_corp_info,corp_name,corp_id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入企业ID!'},
          ];
     },
  },
  {
    label: 'UnionId',
    field: 'unionId',
    component: 'Input',
  },
  {
    label: '加群时间',
    field: 'joinTime',
    component: 'DatePicker',
  },
  {
    label: '加入方式',
    field: 'joinScene',
    component: 'InputNumber',
  },
  {
    label: '成员类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"group_member_type"
     },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '邀请人',
    field: 'invitor',
    component: 'Input',
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