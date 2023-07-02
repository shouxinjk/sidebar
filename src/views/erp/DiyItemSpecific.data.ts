import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '资源类别',
    align:"center",
    dataIndex: 'spuId_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '卖家',
    align:"center",
    dataIndex: 'seller'
   },
   {
    title: '套餐类型',
    align:"center",
    dataIndex: 'optionCode'
   },
   {
    title: '规格编码',
    align:"center",
    dataIndex: 'specificCode'
   },
   {
    title: '成本价',
    align:"center",
    dataIndex: 'priceCost'
   },
   {
    title: '供货价',
    align:"center",
    dataIndex: 'priceSale'
   },
   {
    title: '市场价',
    align:"center",
    dataIndex: 'priceBid'
   },
   {
    title: '库存类别',
    align:"center",
    dataIndex: 'skuType_dictText'
   },
   {
    title: '商品类目',
    align:"center",
    dataIndex: 'categoryId_dictText'
   },
   {
    title: '商品URL',
    align:"center",
    dataIndex: 'url'
   },
   {
    title: '上架状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '扩展信息',
    align:"center",
    dataIndex: 'extInfo'
   },
   {
    title: 'LOGO',
    align:"center",
    dataIndex: 'logo'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "资源类别",
      field: 'spuId',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"ope_item,name,id"
      },
      colProps: {span: 6},
 	},
	{
      label: "套餐类型",
      field: 'optionCode',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "规格编码",
      field: 'specificCode',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "库存类别",
      field: 'skuType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sku_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "商品类目",
      field: 'categoryId',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "上架状态",
      field: 'status',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"sell_status"
      },
      colProps: {span: 6},
 	},
	{
      label: "商品来源",
      field: 'origin',
      component: 'JDictSelectTag',
      componentProps:{
      },
      colProps: {span: 6},
 	},
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '资源类别',
    field: 'spuId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"ope_item,name,id"
     },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '卖家',
    field: 'seller',
    component: 'Input',
  },
  {
    label: '套餐类型',
    field: 'optionCode',
    component: 'Input',
  },
  {
    label: '规格编码',
    field: 'specificCode',
    component: 'Input',
  },
  {
    label: '成本价',
    field: 'priceCost',
    component: 'InputNumber',
  },
  {
    label: '供货价',
    field: 'priceSale',
    component: 'InputNumber',
  },
  {
    label: '市场价',
    field: 'priceBid',
    component: 'InputNumber',
  },
  {
    label: '库存类别',
    field: 'skuType',
    defaultValue: "contract",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sku_type"
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
    label: '商品URL',
    field: 'url',
    component: 'Input',
  },
  {
    label: '上架状态',
    field: 'status',
    defaultValue: "in-sell",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"sell_status"
     },
  },
  {
    label: '扩展信息',
    field: 'extInfo',
    component: 'InputTextArea',
  },
  {
    label: 'LOGO',
    field: 'logo',
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