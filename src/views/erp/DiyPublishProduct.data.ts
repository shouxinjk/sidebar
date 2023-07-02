import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '类型',
    align:"center",
    dataIndex: 'stockType_dictText'
   },
   {
    title: '方案',
    align:"center",
    dataIndex: 'solutionId_dictText'
   },
   {
    title: '产品',
    align:"center",
    dataIndex: 'productId_dictText'
   },
   {
    title: '发布平台',
    align:"center",
    dataIndex: 'platformSourceId_dictText'
   },
   {
    title: '发布状态',
    align:"center",
    dataIndex: 'publishStatus_dictText'
   },
   {
    title: '发布ID',
    align:"center",
    dataIndex: 'publishId'
   },
   {
    title: 'URL',
    align:"center",
    dataIndex: 'publishUrl'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "类型",
      field: 'stockType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"stock_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "发布平台",
      field: 'platformSourceId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"mod_platform_source,platform,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "发布状态",
      field: 'publishStatus',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"publish_status"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '类型',
    field: 'stockType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"stock_type"
     },
  },
  {
    label: '方案',
    field: 'solutionId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"diy_solution,name,id"
    },
  },
  {
    label: '产品',
    field: 'productId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"ope_item,name,id"
    },
  },
  {
    label: '发布平台',
    field: 'platformSourceId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"mod_platform_source,platform,id"
     },
  },
  {
    label: '发布状态',
    field: 'publishStatus',
    defaultValue: "pending",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"publish_status"
     },
  },
  {
    label: '发布ID',
    field: 'publishId',
    component: 'Input',
  },
  {
    label: 'URL',
    field: 'publishUrl',
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