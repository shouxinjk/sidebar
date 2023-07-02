import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '企业ID',
    align:"center",
    dataIndex: 'corpId'
   },
   {
    title: 'SuiteID',
    align:"center",
    dataIndex: 'suiteId'
   },
   {
    title: 'AgentID',
    align:"center",
    dataIndex: 'agentId'
   },
   {
    title: '应用名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '方形头像',
    align:"center",
    dataIndex: 'squareLogoUrl'
   },
   {
    title: '圆形头像',
    align:"center",
    dataIndex: 'roundLogoUrl'
   },
   {
    title: '授权模式',
    align:"center",
    dataIndex: 'authMode_dictText'
   },
   {
    title: '管理员ID',
    align:"center",
    dataIndex: 'authUserInfoUserid'
   },
   {
    title: '管理员openuserid',
    align:"center",
    dataIndex: 'authUserInfoOpenUserid'
   },
   {
    title: '管理员name',
    align:"center",
    dataIndex: 'authUserInfoName'
   },
   {
    title: '管理员头像',
    align:"center",
    dataIndex: 'authUserInfoAvatar'
   },
   {
    title: '服务商企业ID',
    align:"center",
    dataIndex: 'dealerCorpInfoCorpId'
   },
   {
    title: '服务商企业名称',
    align:"center",
    dataIndex: 'dealerCorpInfoCorpName'
   },
   {
    title: '注册码',
    align:"center",
    dataIndex: 'registerCodeInfoRegisterCode'
   },
   {
    title: '推广包ID',
    align:"center",
    dataIndex: 'registerCodeInfoTemplateId'
   },
   {
    title: 'STATE',
    align:"center",
    dataIndex: 'registerCodeInfoState'
   },
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
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
    label: 'SuiteID',
    field: 'suiteId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入SuiteID!'},
          ];
     },
  },
  {
    label: 'AgentID',
    field: 'agentId',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入AgentID!'},
          ];
     },
  },
  {
    label: '应用名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入应用名称!'},
          ];
     },
  },
  {
    label: '方形头像',
    field: 'squareLogoUrl',
    component: 'Input',
  },
  {
    label: '圆形头像',
    field: 'roundLogoUrl',
    component: 'Input',
  },
  {
    label: '授权模式',
    field: 'authMode',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"corp_auth_mode"
     },
  },
  {
    label: '管理员ID',
    field: 'authUserInfoUserid',
    component: 'Input',
  },
  {
    label: '管理员openuserid',
    field: 'authUserInfoOpenUserid',
    component: 'Input',
  },
  {
    label: '管理员name',
    field: 'authUserInfoName',
    component: 'Input',
  },
  {
    label: '管理员头像',
    field: 'authUserInfoAvatar',
    component: 'Input',
  },
  {
    label: '服务商企业ID',
    field: 'dealerCorpInfoCorpId',
    component: 'Input',
  },
  {
    label: '服务商企业名称',
    field: 'dealerCorpInfoCorpName',
    component: 'Input',
  },
  {
    label: '注册码',
    field: 'registerCodeInfoRegisterCode',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入注册码!'},
          ];
     },
  },
  {
    label: '推广包ID',
    field: 'registerCodeInfoTemplateId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入推广包ID!'},
          ];
     },
  },
  {
    label: 'STATE',
    field: 'registerCodeInfoState',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入STATE!'},
          ];
     },
  },
  {
    label: '租户',
    field: 'tenantId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
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