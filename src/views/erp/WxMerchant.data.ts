import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '业务申请编号',
    align:"center",
    dataIndex: 'businessCode'
   },
   {
    title: '微信支付申请单号',
    align:"center",
    dataIndex: 'applymentId'
   },
   {
    title: '申请状态',
    align:"center",
    dataIndex: 'applymentState'
   },
   {
    title: '申请状态描述',
    align:"center",
    dataIndex: 'applymentStateMsg'
   },
   {
    title: '驳回原因',
    align:"center",
    dataIndex: 'auditDetail'
   },
   {
    title: '管理员信息',
    align:"center",
    dataIndex: 'contactInfo'
   },
   {
    title: '主体资料',
    align:"center",
    dataIndex: 'subjectInfo'
   },
   {
    title: '经营资料',
    align:"center",
    dataIndex: 'businessInfo'
   },
   {
    title: '结算规则',
    align:"center",
    dataIndex: 'settlementInfo'
   },
   {
    title: '银行账户',
    align:"center",
    dataIndex: 'bankAccountInfo'
   },
   {
    title: '补充材料',
    align:"center",
    dataIndex: 'additionInfo'
   },
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId'
   },
   {
    title: '特约商户号',
    align:"center",
    dataIndex: 'subMchid'
   },
   {
    title: '超管签约链接',
    align:"center",
    dataIndex: 'signUrl'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '业务申请编号',
    field: 'businessCode',
    component: 'Input',
  },
  {
    label: '微信支付申请单号',
    field: 'applymentId',
    component: 'InputNumber',
  },
  {
    label: '申请状态',
    field: 'applymentState',
    component: 'Input',
  },
  {
    label: '申请状态描述',
    field: 'applymentStateMsg',
    component: 'Input',
  },
  {
    label: '驳回原因',
    field: 'auditDetail',
    component: 'Input',
  },
  {
    label: '管理员信息',
    field: 'contactInfo',
    component: 'Input',
  },
  {
    label: '主体资料',
    field: 'subjectInfo',
    component: 'Input',
  },
  {
    label: '经营资料',
    field: 'businessInfo',
    component: 'Input',
  },
  {
    label: '结算规则',
    field: 'settlementInfo',
    component: 'Input',
  },
  {
    label: '银行账户',
    field: 'bankAccountInfo',
    component: 'Input',
  },
  {
    label: '补充材料',
    field: 'additionInfo',
    component: 'Input',
  },
  {
    label: '租户',
    field: 'tenantId',
    component: 'InputNumber',
  },
  {
    label: '特约商户号',
    field: 'subMchid',
    component: 'Input',
  },
  {
    label: '超管签约链接',
    field: 'signUrl',
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