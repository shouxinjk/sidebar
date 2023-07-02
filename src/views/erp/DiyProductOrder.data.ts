import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '来源类型',
    align:"center",
    dataIndex: 'channelType_dictText'
   },
   {
    title: '来源平台',
    align:"center",
    dataIndex: 'channelSource_dictText'
   },

   {
    title: '产品',
    align:"center",
    dataIndex: 'spuId_dictText'
   },
   {
    title: '规格',
    align:"center",
    dataIndex: 'skuId_dictText'
   },
   {
    title: '订单总额',
    align:"center",
    dataIndex: 'price'
   },
   {
    title: '数量',
    align:"center",
    dataIndex: 'amount'
   },
   {
    title: '预约日期',
    align:"center",
    dataIndex: 'scheduleDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },

   {
    title: '订单状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '用户',
    align:"center",
    dataIndex: 'thirdUserId_dictText'
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
    title: '支付时间',
    align:"center",
    dataIndex: 'paymentTime'
   },
   {
    title: '交易流水号',
    align:"center",
    dataIndex: 'transactionId'
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "产品",
      field: 'spuId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"ope_item,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "规格",
      field: 'skuId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_item_specific,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "来源类型",
      field: 'channelType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"channel_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "来源平台",
      field: 'channelSource',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_platform_source,name,platform"
      },
      colProps: {span: 6},
 	},
	{
      label: "终端类型",
      field: 'clientType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"client_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "订单状态",
      field: 'status',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"order_status"
      },
      colProps: {span: 6},
 	},
	{
      label: "用户",
      field: 'thirdUserId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sys_third_account,realname,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "交易状态",
      field: 'tradeState',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"trade_status"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '产品',
    field: 'spuId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ope_item,name,id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入SPU!'},
          ];
     },
  },
  {
    label: '规格',
    field: 'skuId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_item_specific,name,id"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入SKU!'},
          ];
     },
  },
  {
    label: '订单总额',
    field: 'price',
    component: 'InputNumber',
  },
  {
    label: '数量',
    field: 'amount',
    component: 'InputNumber',
  },
  {
    label: '预约日期',
    field: 'scheduleDate',
    component: 'DatePicker',
  },
  {
    label: '来源类型',
    field: 'channelType',
    defaultValue: "miniprog",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"channel_type"
     },
  },
  {
    label: '来源平台',
    field: 'channelSource',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_platform_source,name,platform"
    },
  },
  {
    label: '终端类型',
    field: 'clientType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"client_type"
     },
  },
  {
    label: '订单状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"order_status"
     },
  },
  {
    label: '用户',
    field: 'thirdUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_third_account,realname,id"
    },
  },
  {
    label: '扩展信息',
    field: 'extInfo',
    component: 'InputTextArea',
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
        dictCode:"trade_status"
     },
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
    label: '交易流水号',
    field: 'transactionId',
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