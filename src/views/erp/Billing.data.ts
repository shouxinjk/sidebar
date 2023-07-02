import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '创建人',
    align:"center",
    dataIndex: 'createBy'
   },
   {
    title: '创建日期',
    align:"center",
    dataIndex: 'createTime'
   },
   {
    title: '内容类型',
    align:"center",
    dataIndex: 'subjectType_dictText'
   },
   {
    title: '计费内容',
    align:"center",
    dataIndex: 'subjectName'
   },
   {
    title: '计费类型',
    align:"center",
    dataIndex: 'billingType_dictText'
   },
   {
    title: '金额',
    align:"center",
    dataIndex: 'amount'
   },
   {
    title: '计费摘要',
    align:"center",
    dataIndex: 'summary'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "内容类型",
      field: 'subjectType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"billing_subject_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "计费类型",
      field: 'billingType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"billing_type"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '内容类型',
    field: 'subjectType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"billing_subject_type"
     },
  },
  {
    label: '计费内容',
    field: 'subjectName',
    component: 'Input',
  },
  {
    label: '计费类型',
    field: 'billingType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"billing_type"
     },
  },
  {
    label: '金额',
    field: 'amount',
    component: 'InputNumber',
  },
  {
    label: '计费摘要',
    field: 'summary',
    component: 'InputTextArea',
  },
  {
    label: '计费详情',
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