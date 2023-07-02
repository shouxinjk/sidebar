import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '微信客服',
    align:"center",
    dataIndex: 'openKfid_dictText'
   },
   {
    title: '用户ID',
    align:"center",
    dataIndex: 'userid'
   },
   {
    title: '部门ID',
    align:"center",
    dataIndex: 'departmentId'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
    customRender:({text}) => {
       return  render.renderSwitch(text, [{text:'是',value:'Y'},{text:'否',value:'N'}])
     },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "微信客服",
      field: 'openKfid',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"ww_customer_service,name,open_kfid"
      },
      colProps: {span: 6},
 	},
	{
      label: "状态",
      field: 'status',
      component: 'JSwitch',
      componentProps:{
           query:true,
       },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '微信客服',
    field: 'openKfid',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"ww_customer_service,name,open_kfid"
     },
  },
  {
    label: '用户ID',
    field: 'userid',
    component: 'Input',
  },
  {
    label: '部门ID',
    field: 'departmentId',
    component: 'InputNumber',
  },
  {
    label: '状态',
    field: 'status',
     component: 'JSwitch',
     componentProps:{
     },
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