import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '定制师',
    align:"center",
    dataIndex: 'brokerId_dictText'
   },
   {
    title: '类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '目的地',
    align:"center",
    dataIndex: 'region_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "定制师",
      field: 'brokerId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_broker,nickname,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"contract_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "目的地",
      field: 'region',
      component: 'JSelectMultiple',
      componentProps:{
        dictCode:"data_region,name,id",
        triggerChange: true
     },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '定制师',
    field: 'brokerId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
  },
  {
    label: '类型',
    field: 'type',
    defaultValue: "outsourcing",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"contract_type"
     },
  },
  {
    label: '目的地',
    field: 'region',
    component: 'JSelectMultiple',
    componentProps:{
        dictCode:"data_region,name,id"
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