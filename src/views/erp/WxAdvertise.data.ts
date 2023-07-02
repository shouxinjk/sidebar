import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '广告位名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '广告类型',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '时间段名称',
    align:"center",
    dataIndex: 'timeSlot'
   },
   {
    title: '广告位排序',
    align:"center",
    dataIndex: 'weight'
   },
   {
    title: '数量',
    align:"center",
    dataIndex: 'quantity'
   },
   {
    title: '时间段开始时间',
    align:"center",
    dataIndex: 'timeSlotFrom',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '时间段结束时间',
    align:"center",
    dataIndex: 'timeSlotTo',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
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
      label: "广告位名称",
      field: 'name',
      component: 'Input',
      colProps: {span: 6},
 	},
	{
      label: "广告类型",
      field: 'type',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"ad_type"
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
    label: '广告位名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入广告位名称!'},
          ];
     },
  },
  {
    label: '广告类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"ad_type"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入广告类型!'},
          ];
     },
  },
  {
    label: '时间段名称',
    field: 'timeSlot',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入时间段名称!'},
          ];
     },
  },
  {
    label: '广告位排序',
    field: 'weight',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入广告位排序!'},
          ];
     },
  },
  {
    label: '数量',
    field: 'quantity',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入数量!'},
          ];
     },
  },
  {
    label: '时间段开始时间',
    field: 'timeSlotFrom',
    component: 'DatePicker',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入时间段开始时间!'},
          ];
     },
  },
  {
    label: '时间段结束时间',
    field: 'timeSlotTo',
    component: 'DatePicker',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入时间段结束时间!'},
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