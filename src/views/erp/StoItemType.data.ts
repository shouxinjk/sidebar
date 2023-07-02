import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { h } from 'vue';
import { Icon } from '/@/components/Icon';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '业务类型',
    align:"center",
    dataIndex: 'businessType_dictText'
   },
   {
    title: '商品类目',
    align:"center",
    dataIndex: 'categoryId_dictText'
   },
   {
    title: '资源类别',
    align:"center",
    dataIndex: 'itemMetaType_dictText'
   },
   {
    title: '资源名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
   {
    title: '库存类型',
    align:"center",
    dataIndex: 'stockType_dictText'
   },
   {
    title: '库存名称',
    align:"center",
    dataIndex: 'stockName'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "业务类型",
      field: 'businessType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sto_business_type,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "资源类别",
      field: 'itemMetaType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"item_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "库存类型",
      field: 'stockType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"stock_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "状态",
      field: 'status',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"active_status"
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '业务类型',
    field: 'businessType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sto_business_type,name,id"
     },
  },
  {
    label: '商品类目',
    field: 'categoryId',
    component: 'JTreeSelect',
    componentProps:{
        dict:"mod_item_category,name,id",
        pidValue:"1",
    },
  },
  {
    label: '资源类别',
    field: 'itemMetaType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"item_type"
     },
  },
  {
    label: '资源名称',
    field: 'name',
    component: 'Input',
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
  },
  {
    label: '库存类型',
    field: 'stockType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"stock_type"
     },
  },
  {
    label: '库存名称',
    field: 'stockName',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"active_status"
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