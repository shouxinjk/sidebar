import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '企业ID',
    align:"center",
    dataIndex: 'corpId'
   },
   {
    title: '应用Id',
    align:"center",
    dataIndex: 'suiteId'
   },
   {
    title: '永久授权码',
    align:"center",
    dataIndex: 'permanentCode'
   },
   {
    title: '企业简称',
    align:"center",
    dataIndex: 'corpName'
   },
   {
    title: '认证类型',
    align:"center",
    dataIndex: 'corpType_dictText'
   },
   {
    title: '头像',
    align:"center",
    dataIndex: 'corpSquareLogoUrl'
   },
   {
    title: '用户规模',
    align:"center",
    dataIndex: 'corpUserMax'
   },
   {
    title: '应用数上限',
    align:"center",
    dataIndex: 'corpAgentMax'
   },
   {
    title: '企业全称',
    align:"center",
    dataIndex: 'corpFullName'
   },
   {
    title: '企业类型',
    align:"center",
    dataIndex: 'subjectType_dictText'
   },
   {
    title: '认证到期时间',
    align:"center",
    dataIndex: 'verifiedEndTime',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
   },
   {
    title: '二维码',
    align:"center",
    dataIndex: 'corpQrcode'
   },
   {
    title: '企业规模',
    align:"center",
    dataIndex: 'corpScale'
   },
   {
    title: '所属行业',
    align:"center",
    dataIndex: 'corpIndustry'
   },
   {
    title: '子行业',
    align:"center",
    dataIndex: 'corpSubIndustry'
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
    title: '租户',
    align:"center",
    dataIndex: 'tenantId_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
	{
      label: "认证类型",
      field: 'corpType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"corp_verify_type"
      },
      colProps: {span: 6},
 	},
	{
      label: "企业类型",
      field: 'subjectType',
      component: 'JDictSelectTag',
      componentProps:{
          dictCode:"corp_subject_type"
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
    label: '企业ID',
    field: 'corpId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入企业ID!'},
          ];
     },
  },
  {
    label: '应用Id',
    field: 'suiteId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入应用Id!'},
          ];
     },
  },
  {
    label: '永久授权码',
    field: 'permanentCode',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入永久授权码!'},
          ];
     },
  },
  {
    label: '企业简称',
    field: 'corpName',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入企业简称!'},
          ];
     },
  },
  {
    label: '认证类型',
    field: 'corpType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"corp_verify_type"
     },
  },
  {
    label: '头像',
    field: 'corpSquareLogoUrl',
    component: 'Input',
  },
  {
    label: '用户规模',
    field: 'corpUserMax',
    component: 'InputNumber',
  },
  {
    label: '应用数上限',
    field: 'corpAgentMax',
    component: 'InputNumber',
  },
  {
    label: '企业全称',
    field: 'corpFullName',
    component: 'Input',
  },
  {
    label: '企业类型',
    field: 'subjectType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"corp_subject_type"
     },
  },
  {
    label: '认证到期时间',
    field: 'verifiedEndTime',
    component: 'DatePicker',
  },
  {
    label: '二维码',
    field: 'corpQrcode',
    component: 'Input',
  },
  {
    label: '企业规模',
    field: 'corpScale',
    component: 'Input',
  },
  {
    label: '所属行业',
    field: 'corpIndustry',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入所属行业!'},
          ];
     },
  },
  {
    label: '子行业',
    field: 'corpSubIndustry',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入子行业!'},
          ];
     },
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "active",
     component: 'JSwitch',
     componentProps:{
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入状态!'},
          ];
     },
  },
  {
    label: '租户',
    field: 'tenantId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_tenant,name,id"
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