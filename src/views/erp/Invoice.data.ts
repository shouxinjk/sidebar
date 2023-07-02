import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '发票编号',
    align:"center",
    dataIndex: 'code'
   },
   {
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
   {
    title: '金额',
    align:"center",
    dataIndex: 'amount'
   },
   {
    title: '开票时间',
    align:"center",
    dataIndex: 'issueDate'
   },
   {
    title: '开票状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: 'URL',
    align:"center",
    dataIndex: 'fileUrl'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '发票编号',
    field: 'code',
    component: 'Input',
  },
  {
    label: '租户',
    field: 'tenantId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sys_tenant,name,id"
     },
  },
  {
    label: '金额',
    field: 'amount',
    component: 'Input',
  },
  {
    label: '开票时间',
    field: 'issueDate',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '开票状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"invoice_status"
     },
  },
  {
    label: 'URL',
    field: 'fileUrl',
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