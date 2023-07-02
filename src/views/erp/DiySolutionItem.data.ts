import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属方案',
    align:"center",
    dataIndex: 'solutionId_dictText'
   },
   {
    title: '所属章节',
    align:"center",
    dataIndex: 'sectionId_dictText'
   },
   {
    title: '指南规则',
    align:"center",
    dataIndex: 'guideTermItemId_dictText'
   },
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '描述',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '标签',
    align:"center",
    dataIndex: 'tags'
   },
   {
    title: '类别',
    align:"center",
    dataIndex: 'type_dictText'
   },
   {
    title: '排序',
    align:"center",
    dataIndex: 'priority'
   },
   {
    title: '关联商品',
    align:"center",
    dataIndex: 'itemIds'
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '扩展信息',
    align:"center",
    dataIndex: 'extInfo'
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属方案',
    field: 'solutionId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"diy_solution,name,id"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入所属方案!'},
          ];
     },
    //dynamicDisabled:true
  },
  {
    label: '所属章节',
    field: 'sectionId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"diy_solution_section,name,id"
     },
  },
  {
    label: '指南规则',
    field: 'guideTermItemId',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"diy_guide_term,name,id"
     },
    dynamicDisabled:true
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入名称!'},
          ];
     },
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
  {
    label: '标签',
    field: 'tags',
    component: 'InputTextArea',
  },
  {
    label: '类别',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"diy_proposal_subtype,name,id"
     },
  },
  {
    label: '排序',
    field: 'priority',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入排序!'},
          ];
     },
  },
  {
    label: '关联商品',
    field: 'itemIds',
    component: 'InputTextArea',
  },
  {
    label: '扩展信息',
    field: 'extInfo',
    component: 'InputTextArea',
  },
  {
    label: '更新时间',
    field: 'updateTime',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
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