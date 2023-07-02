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
    title: '用户',
    align:"center",
    dataIndex: 'thirdUserId_dictText'
   },
   {
    title: '行程方案',
    align:"center",
    dataIndex: 'solutionId_dictText'
   },
   {
    title: '出发日期',
    align:"center",
    dataIndex: 'scheduleDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
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
    title: '订单状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '支付状态',
    align:"center",
    dataIndex: 'tradeState_dictText'
   },
   {
    title: '商户订单号',
    align:"center",
    dataIndex: 'tradeNo'
   },
   {
    title: '支付时间',
    align:"center",
    dataIndex: 'paymentTime'
   },
   {
    title: '支付流水号',
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
    label: "定制方案",
    field: 'solutionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution,id,name"
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
    label: "用户",
    field: 'thirdUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_third_account,id,realname"
    },
    colProps: {span: 6},
 },
	{
      label: "原始订单ID",
      field: 'originalId',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "订单状态",
      field: 'status',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"solution_order_status"
      },
      colProps: {span: 6},
 	},
  {
    label: "支付状态",
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
    label: '定制方案',
    field: 'solutionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution,id,name"
    },
  },
  {
    label: '出行日期',
    field: 'scheduleDate',
    component: 'DatePicker',
  },
  {
    label: '来源类型',
    field: 'channelType',
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
    label: '用户',
    field: 'thirdUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_third_account,id,realname"
    },
  },
  {
    label: '原始订单ID',
    field: 'originalId',
    component: 'Input',
  },
  {
    label: '金额',
    field: 'price',
    component: 'Input',
  },
  {
    label: '数量',
    field: 'amount',
    component: 'Input',
  },
  {
    label: '订单状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"solution_order_status"
     },
  },
  {
    label: '支付状态',
    field: 'tradeState',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"trade_status"
     },
  },
  {
    label: '商户订单号',
    field: 'tradeNo',
    component: 'Input',
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
    label: '支付流水号',
    field: 'transactionId',
    component: 'Input',
  },
  {
    label: '用户信息',
    field: 'userInfo',
    component: 'InputTextArea',
  },
  {
    label: '扩展信息',
    field: 'extInfo',
    component: 'InputTextArea',
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