import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
   {
    title: '付款达人',
    align:"center",
    dataIndex: 'brokerId_dictText'
   },
   {
    title: '虚拟豆产品',
    align:"center",
    dataIndex: 'pointsId_dictText'
   },
   {
    title: '付款金额（分）',
    align:"center",
    dataIndex: 'amount'
   },
   {
    title: '付款时间',
    align:"center",
    dataIndex: 'paymentDate'
   },
   {
    title: '商户订单号',
    align:"center",
    dataIndex: 'tradeNo'
   },
   {
    title: '交易状态',
    align:"center",
    dataIndex: 'tradeState_dictText'
   },
   {
    title: '支付流水号',
    align:"center",
    dataIndex: 'transactionId'
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
   {
    title: '付款人',
    align:"center",
    dataIndex: 'payerOpenid'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "交易状态",
      field: 'tradeState',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"order_status"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '租户',
    field: 'tenantId',
    defaultValue: 0,
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
    },
  },
  {
    label: '付款达人',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入付款达人!'},
          ];
     },
  },
  {
    label: '虚拟豆产品',
    field: 'pointsId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"wx_points,name,id"
    },
  },
  {
    label: '付款金额（分）',
    field: 'amount',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入付款金额（分）!'},
          ];
     },
  },
  {
    label: '付款时间',
    field: 'paymentDate',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '商户订单号',
    field: 'tradeNo',
    component: 'Input',
  },
  {
    label: '交易状态',
    field: 'tradeState',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"order_status"
     },
  },
  {
    label: '支付流水号',
    field: 'transactionId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入支付流水号!'},
          ];
     },
  },
  {
    label: '付款人',
    field: 'payerOpenid',
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