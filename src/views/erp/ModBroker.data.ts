import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '上级达人',
    align:"center",
    dataIndex: 'parentId_dictText'
   },
   {
    title: '所属机构',
    align:"center",
    dataIndex: 'orgnizationId_dictText'
   },
   {
    title: 'OpenId',
    align:"center",
    dataIndex: 'openid'
   },
   {
    title: '对应系统用户',
    align:"center",
    dataIndex: 'sysUserId_dictText'
   },
   {
    title: '微信群激活码',
    align:"center",
    dataIndex: 'token'
   },
   {
    title: '微信昵称',
    align:"center",
    dataIndex: 'nickname'
   },
   {
    title: '头像',
    align:"center",
    dataIndex: 'avatarurl'
   },
   {
    title: '真实姓名',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '工作',
    align:"center",
    dataIndex: 'job'
   },
   {
    title: '个人优势',
    align:"center",
    dataIndex: 'description'
   },
   {
    title: '电话号码',
    align:"center",
    dataIndex: 'phone'
   },
   {
    title: '邮件',
    align:"center",
    dataIndex: 'email'
   },
   {
    title: '层级',
    align:"center",
    dataIndex: 'hierarchy'
   },
   {
    title: '身份证号码',
    align:"center",
    dataIndex: 'securityNo'
   },
   {
    title: '微信ID',
    align:"center",
    dataIndex: 'wechatId'
   },
   {
    title: '等级',
    align:"center",
    dataIndex: 'level'
   },
   {
    title: '结算账户类型',
    align:"center",
    dataIndex: 'accountType'
   },
   {
    title: '支付宝账号',
    align:"center",
    dataIndex: 'alipayAccount'
   },
   {
    title: '支付宝账户名',
    align:"center",
    dataIndex: 'alipayAccountname'
   },
   {
    title: '公司全称',
    align:"center",
    dataIndex: 'companyName'
   },
   {
    title: '公司开户行',
    align:"center",
    dataIndex: 'companyBank'
   },
   {
    title: '公司账户',
    align:"center",
    dataIndex: 'companyAccount'
   },
   {
    title: '公司联系人',
    align:"center",
    dataIndex: 'companyContact'
   },
   {
    title: '公司联系电话',
    align:"center",
    dataIndex: 'companyTelephone'
   },
   {
    title: '账户状态',
    align:"center",
    dataIndex: 'status'
   },
   {
    title: '升级状态',
    align:"center",
    dataIndex: 'upgrade'
   },
   {
    title: '二维码URL',
    align:"center",
    dataIndex: 'qrcodeurl'
   },
   {
    title: '虚拟豆',
    align:"center",
    dataIndex: 'points'
   },
   {
    title: '金币',
    align:"center",
    dataIndex: 'coins'
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createDate',
    customRender:({text}) =>{
      return !text?"":(text.length>10?text.substr(0,10):text)
    },
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
    title: '删除标记',
    align:"center",
    dataIndex: 'delFlag'
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createTime'
   },
   {
    title: '更新时间',
    align:"center",
    dataIndex: 'updateTime'
   },
   {
    title: 'UnionId',
    align:"center",
    dataIndex: 'unionid'
   },
   {
    title: '企微ID',
    align:"center",
    dataIndex: 'externalUserid'
   },
   {
    title: '企业ID',
    align:"center",
    dataIndex: 'corpid'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '上级达人',
    field: 'parentId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"mod_broker,nickname,id"
    },
  },
  {
    label: '所属机构',
    field: 'orgnizationId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_depart,depart_name,id"
    },
  },
  {
    label: 'OpenId',
    field: 'openid',
    component: 'Input',
  },
  {
    label: '对应系统用户',
    field: 'sysUserId',
    component: 'JSearchSelect',
    componentProps:{
       dict:"sys_user,username,id"
    },
  },
  {
    label: '微信群激活码',
    field: 'token',
    component: 'Input',
  },
  {
    label: '微信昵称',
    field: 'nickname',
    component: 'Input',
  },
  {
    label: '头像',
    field: 'avatarurl',
    component: 'Input',
  },
  {
    label: '真实姓名',
    field: 'name',
    component: 'Input',
  },
  {
    label: '工作',
    field: 'job',
    component: 'Input',
  },
  {
    label: '个人优势',
    field: 'description',
    component: 'Input',
  },
  {
    label: '电话号码',
    field: 'phone',
    component: 'Input',
  },
  {
    label: '邮件',
    field: 'email',
    component: 'Input',
  },
  {
    label: '层级',
    field: 'hierarchy',
    component: 'InputNumber',
  },
  {
    label: '身份证号码',
    field: 'securityNo',
    component: 'Input',
  },
  {
    label: '微信ID',
    field: 'wechatId',
    component: 'Input',
  },
  {
    label: '等级',
    field: 'level',
    component: 'InputNumber',
  },
  {
    label: '结算账户类型',
    field: 'accountType',
    component: 'Input',
  },
  {
    label: '支付宝账号',
    field: 'alipayAccount',
    component: 'Input',
  },
  {
    label: '支付宝账户名',
    field: 'alipayAccountname',
    component: 'Input',
  },
  {
    label: '公司全称',
    field: 'companyName',
    component: 'Input',
  },
  {
    label: '公司开户行',
    field: 'companyBank',
    component: 'Input',
  },
  {
    label: '公司账户',
    field: 'companyAccount',
    component: 'Input',
  },
  {
    label: '公司联系人',
    field: 'companyContact',
    component: 'Input',
  },
  {
    label: '公司联系电话',
    field: 'companyTelephone',
    component: 'Input',
  },
  {
    label: '账户状态',
    field: 'status',
    component: 'Input',
  },
  {
    label: '升级状态',
    field: 'upgrade',
    component: 'Input',
  },
  {
    label: '二维码URL',
    field: 'qrcodeurl',
    component: 'Input',
  },
  {
    label: '虚拟豆',
    field: 'points',
    component: 'InputNumber',
  },
  {
    label: '金币',
    field: 'coins',
    component: 'InputNumber',
  },
  {
    label: '创建时间',
    field: 'createDate',
    component: 'DatePicker',
  },
  {
    label: '更新时间',
    field: 'updateDate',
    component: 'DatePicker',
  },
  {
    label: '删除标记',
    field: 'delFlag',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入删除标记!'},
          ];
     },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
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
  {
    label: 'UnionId',
    field: 'unionid',
    component: 'Input',
  },
  {
    label: '企微ID',
    field: 'externalUserid',
    component: 'Input',
  },
  {
    label: '企业ID',
    field: 'corpid',
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