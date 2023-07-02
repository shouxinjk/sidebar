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
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
   {
    title: '模板',
    align:"center",
    dataIndex: 'viewTemplateId_dictText'
   },
   {
    title: '类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "租户",
      field: 'tenantId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"sys_tenant,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "模板",
      field: 'viewTemplateId',
      component: 'JSearchSelect',
      componentProps:{
         dict:"mod_view_template,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"enable_type"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '租户',
    field: 'tenantId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
    },
  },
  {
    label: '模板',
    field: 'viewTemplateId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_view_template,name,id"
    },
  },
  {
    label: '类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"enable_type"
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