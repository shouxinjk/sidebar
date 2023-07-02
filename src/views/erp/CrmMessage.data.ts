import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '发送用户',
    align:"center",
    dataIndex: 'fromUser'
   },
   {
    title: '接收用户',
    align:"center",
    dataIndex: 'toUser'
   },
   {
    title: '渠道类型',
    align:"center",
    dataIndex: 'channelType_dictText'
   },
   {
    title: '渠道名称',
    align:"center",
    dataIndex: 'channelName'
   },
   {
    title: '消息内容',
    align:"center",
    dataIndex: 'content'
   },
   {
    title: '内容类型',
    align:"center",
    dataIndex: 'contentType_dictText'
   },
   {
    title: '关联订单',
    align:"center",
    dataIndex: 'orderId_dictText'
   },
   {
    title: '超时秒数',
    align:"center",
    dataIndex: 'timeout'
   },
   {
    title: '回复时间',
    align:"center",
    dataIndex: 'createTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "渠道类型",
      field: 'channelType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"channel_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "渠道名称",
      field: 'channelName',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "内容类型",
      field: 'contentType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"content_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "关联订单",
      field: 'orderId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"diy_solution_order,original_id,id"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '发送用户',
    field: 'fromUser',
    component: 'Input',
  },
  {
    label: '发送用户ID',
    field: 'fromUserId',
    component: 'Input',
  },
  {
    label: '接收用户',
    field: 'toUser',
    component: 'Input',
  },
  {
    label: '接收用户ID',
    field: 'toUserId',
    component: 'Input',
  },
  {
    label: '渠道类型',
    field: 'channelType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"channel_type"
     },
  },
  {
    label: '渠道名称',
    field: 'channelName',
    component: 'Input',
  },
  {
    label: '消息内容',
    field: 'content',
    component: 'Input',
  },
  {
    label: '内容类型',
    field: 'contentType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"content_type"
     },
  },
  {
    label: '关联订单',
    field: 'orderId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution_order,original_id,id"
    },
  },
  {
    label: '超时秒数',
    field: 'timeout',
    component: 'InputNumber',
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