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
    title: '购买类型',
    align:"center",
    dataIndex: 'purchaseType_dictText'
   },
   {
    title: '购买内容',
    align:"center",
    dataIndex: 'subjectName'
   },
   {
    title: '金额',
    align:"center",
    dataIndex: 'price'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '购买类型',
    field: 'purchaseType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"purchase_type"
     },
  },
  {
    label: '购买内容',
    field: 'subjectName',
    component: 'Input',
  },
  {
    label: '金额',
    field: 'price',
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