import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '昵称',
    align:"center",
    dataIndex: 'nickName'
   },
   {
    title: '原始ID',
    align:"center",
    dataIndex: 'userName'
   },
   {
    title: '头像',
    align:"center",
    dataIndex: 'headImg'
   },
   {
    title: '类型',
    align:"center",
    dataIndex: 'serviceType_dictText'
   },
   {
    title: '认证类型',
    align:"center",
    dataIndex: 'verifyType_dictText'
   },
   {
    title: '二维码',
    align:"center",
    dataIndex: 'qrcodeUrl'
   },
   {
    title: '主体名称',
    align:"center",
    dataIndex: 'principalName'
   },
   {
    title: '账号介绍',
    align:"center",
    dataIndex: 'signature'
   },
   {
    title: '账号状态',
    align:"center",
    dataIndex: 'accountStatus_dictText'
   },
   {
    title: 'APPID',
    align:"center",
    dataIndex: 'authorizerAppid'
   },
   {
    title: '刷新令牌',
    align:"center",
    dataIndex: 'authorizerRefreshToken'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "类型",
      field: 'serviceType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"wx_miniprog_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "认证类型",
      field: 'verifyType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"wx_miniprog_verify_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "主体名称",
      field: 'principalName',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "账号状态",
      field: 'accountStatus',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"wx_account_status"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '昵称',
    field: 'nickName',
    component: 'Input',
  },
  {
    label: '原始ID',
    field: 'userName',
    component: 'Input',
  },
  {
    label: '头像',
    field: 'headImg',
    component: 'Input',
  },
  {
    label: '类型',
    field: 'serviceType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"wx_miniprog_type"
     },
  },
  {
    label: '认证类型',
    field: 'verifyType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"wx_miniprog_verify_type"
     },
  },
  {
    label: '二维码',
    field: 'qrcodeUrl',
    component: 'Input',
  },
  {
    label: '主体名称',
    field: 'principalName',
    component: 'Input',
  },
  {
    label: '账号介绍',
    field: 'signature',
    component: 'InputTextArea',
  },
  {
    label: '账号状态',
    field: 'accountStatus',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"wx_account_status"
     },
  },
  {
    label: 'APPID',
    field: 'authorizerAppid',
    component: 'Input',
  },
  {
    label: '刷新令牌',
    field: 'authorizerRefreshToken',
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