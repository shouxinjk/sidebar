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
    title: '产品套餐',
    align:"center",
    dataIndex: 'salePackageId_dictText'
   },
   {
    title: '订阅内容',
    align:"center",
    dataIndex: 'appId_dictText'
   },
   {
    title: '套餐计划',
    align:"center",
    dataIndex: 'planId_dictText'
   },
   {
    title: '订阅类型',
    align:"center",
    dataIndex: 'subscribeType_dictText'
   },
   {
    title: '生效时间',
    align:"center",
    dataIndex: 'effectiveOn'
   },
   {
    title: '失效时间',
    align:"center",
    dataIndex: 'expireOn'
   },
   {
    title: '支付金额',
    align:"center",
    dataIndex: 'paymentAmount'
   },
   {
    title: '支付时间',
    align:"center",
    dataIndex: 'paymentTime'
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
    dataIndex: 'transactionCode'
   },
   {
    title: '发票',
    align:"center",
    dataIndex: 'invoiceId_dictText'
   },
   {
    title: '付款达人',
    align:"center",
    dataIndex: 'brokerId_dictText'
   },
   {
    title: '付款人',
    align:"center",
    dataIndex: 'payerOpenid'
   },
   {
    title: '业务类型',
    align:"center",
    dataIndex: 'businessType_dictText'
   },
   {
    title: '用户类型',
    align:"center",
    dataIndex: 'userType_dictText'
   },
   {
    title: '用户全称',
    align:"center",
    dataIndex: 'userName'
   },
   {
    title: '用户电话',
    align:"center",
    dataIndex: 'userPhone'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "产品套餐",
      field: 'salePackageId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sto_sale_package,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "订阅内容",
      field: 'appId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sto_software,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "套餐计划",
      field: 'planId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sto_price_plan,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "订阅类型",
      field: 'subscribeType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"subscribe_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "交易状态",
      field: 'tradeState',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"order_status"
      },
      colProps: {span: 6},
 	},
	{
      label: "付款人",
      field: 'payerOpenid',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "业务类型",
      field: 'businessType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_business_type,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "用户类型",
      field: 'userType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"subscribe_user_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "用户全称",
      field: 'userName',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "用户电话",
      field: 'userPhone',
      component: 'Input',
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '产品套餐',
    field: 'salePackageId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_sale_package,name,id"
    },
  },
  {
    label: '订阅内容',
    field: 'appId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_software,name,id"
    },
  },
  {
    label: '套餐计划',
    field: 'planId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sto_price_plan,name,id"
    },
  },
  {
    label: '订阅类型',
    field: 'subscribeType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"subscribe_type"
     },
  },
  {
    label: '生效时间',
    field: 'effectiveOn',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '失效时间',
    field: 'expireOn',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '支付金额',
    field: 'paymentAmount',
    component: 'InputNumber',
  },
  {
    label: '支付时间',
    field: 'paymentTime',
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
    field: 'transactionCode',
    component: 'Input',
  },
  {
    label: '发票',
    field: 'invoiceId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"invoice,code,id"
     },
    dynamicDisabled:true
  },
  {
    label: '付款达人',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
  },
  {
    label: '付款人',
    field: 'payerOpenid',
    component: 'Input',
  },
  {
    label: '业务类型',
    field: 'businessType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_business_type,name,id"
     },
  },
  {
    label: '用户类型',
    field: 'userType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"subscribe_user_type"
     },
  },
  {
    label: '用户全称',
    field: 'userName',
    component: 'Input',
  },
  {
    label: '用户电话',
    field: 'userPhone',
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