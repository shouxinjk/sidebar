import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '群聊ID',
    align:"center",
    dataIndex: 'chatId'
   },
   {
    title: '群主ID',
    align:"center",
    dataIndex: 'owner'
   },
   {
    title: '企业ID',
    align:"center",
    dataIndex: 'corpId'
   },
   {
    title: '群名',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '群公告',
    align:"center",
    dataIndex: 'notice'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status'
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '群聊ID',
    field: 'chatId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入群聊ID!'},
          ];
     },
  },
  {
    label: '群主ID',
    field: 'owner',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入群主ID!'},
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
    label: '群名',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入群名!'},
          ];
     },
  },
  {
    label: '群公告',
    field: 'notice',
    component: 'InputTextArea',
  },
  {
    label: '状态',
    field: 'status',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入状态!'},
          ];
     },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'DatePicker',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入创建时间!'},
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