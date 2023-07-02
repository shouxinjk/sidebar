import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '产品名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '虚拟豆数量',
    align:"center",
    dataIndex: 'points'
   },
   {
    title: '价格:分',
    align:"center",
    dataIndex: 'price'
   },
   {
    title: '优惠描述',
    align:"center",
    dataIndex: 'discount'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
    customRender:({text}) => {
       return  render.renderSwitch(text, [{text:'是',value:'Y'},{text:'否',value:'N'}])
     },
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "产品名称",
      field: 'name',
      component: 'Input',
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
    label: '产品名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入产品名称!'},
          ];
     },
  },
  {
    label: '虚拟豆数量',
    field: 'points',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入虚拟豆数量!'},
          ];
     },
  },
  {
    label: '价格:分',
    field: 'price',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入价格:分!'},
          ];
     },
  },
  {
    label: '优惠描述',
    field: 'discount',
    component: 'InputTextArea',
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "inactive",
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