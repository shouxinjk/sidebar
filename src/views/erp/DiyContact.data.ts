import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '创建日期',
    align:"center",
    dataIndex: 'createTime'
   },
   {
    title: '姓名',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '联系电话',
    align:"center",
    dataIndex: 'phone'
   },
   {
    title: '所属租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
   {
    title: 'OpenId',
    align:"center",
    dataIndex: 'openid'
   },
   {
    title: 'UnionId',
    align:"center",
    dataIndex: 'unionid'
   },
   {
    title: '登录用户',
    align:"center",
    dataIndex: 'username'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "姓名",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "联系电话",
      field: 'phone',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "所属租户",
      field: 'tenantId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sys_tenant,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "登录用户",
      field: 'username',
      component: 'Input',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '姓名',
    field: 'name',
    component: 'Input',
  },
  {
    label: '联系电话',
    field: 'phone',
    component: 'Input',
  },
  {
    label: '所属租户',
    field: 'tenantId',
    defaultValue: -1,
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
    },
  },
  {
    label: 'OpenId',
    field: 'openid',
    component: 'Input',
  },
  {
    label: 'UnionId',
    field: 'unionid',
    component: 'Input',
  },
  {
    label: 'ExtUserId',
    field: 'externalUserId',
    component: 'Input',
  },
  {
    label: 'CorpId',
    field: 'corpid',
    component: 'Input',
  },
  {
    label: '登录用户',
    field: 'username',
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