import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '客服ID',
    align:"center",
    dataIndex: 'openKfid'
   },
   {
    title: '头像',
    align:"center",
    dataIndex: 'avatar'
   },
   {
    title: '场景值',
    align:"center",
    dataIndex: 'scene'
   },
   {
    title: 'URL',
    align:"center",
    dataIndex: 'url'
   },
   {
    title: '管理权限',
    align:"center",
    dataIndex: 'managePrivilege',
    customRender:({text}) => {
       return  render.renderSwitch(text, [{text:'是',value:'Y'},{text:'否',value:'N'}])
     },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '客服ID',
    field: 'openKfid',
    component: 'Input',
  },
  {
    label: '头像',
    field: 'avatar',
    component: 'Input',
  },
  {
    label: '场景值',
    field: 'scene',
    component: 'Input',
  },
  {
    label: 'URL',
    field: 'url',
    component: 'Input',
  },
  {
    label: '管理权限',
    field: 'managePrivilege',
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