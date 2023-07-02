import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {BIZ_CONFIG, SEARCH_API, SEARCH_CONFIG} from '/@/settings/iLifeSetting';
import {  isDebug, hot } from './merchant.api';

import { getTenantId, getToken } from "/@/utils/auth";
import { SkinOutlined } from '@ant-design/icons-vue';

const glob = useGlobSetting();

export const merchantForm = {
  "type": "form",
  "title": "特约商户",
  "data": {...hot}, //传递当前商户信息数据
  //"wrapWithPanel": false,
  "debug": isDebug,
  "debugConfig": {
    "enableClipboard": true,
    "displayDataTypes": true
  },
  "body": {
    "type": "wizard",
    "startStep":"3",
    "steps": [
      {
        "title": "主体信息",
        "body": [
          {
            "type": "tpl",
            "tpl": "请填写商家的营业执照/登记证书、经营者/法人的证件等信息",
            "inline": true,
            "wrapperComponent": "h3",
          },
          {
            "type": "select",
            "label": "主体类型",
            "name": "subject_info.subject_type",
            "options": [
              {
                "label": "企业",
                "value": "SUBJECT_TYPE_ENTERPRISE"
              },
            ],
            "multiple": false,
            "value": "",
            "required": true
          },
          {
            "type": "input-image",
            "label": "营业执照",
            "name": "licensecopy",
            "autoUpload": true,
            "proxy": true,
            "uploadType": "fileReceptor",
            "imageClassName": "r w-full",
            "id": "u:b13c06bd8022",
            "accept": ".jpeg, .jpg, .png",
            "multiple": false,
            "hideUploadButton": false,
            "required": true
          },
          {
            "type": "hidden",
            "name": "subject_info.business_license_info.license_copy",
            "id": "u:6698b2705804",
            "label": "营业执照图片mediaId"
          },
          {
            "type": "input-text",
            "label": "注册号",
            "name": "subject_info.business_license_info.license_number",
            "id": "u:eadab009a091",
            "placeholder": "与营业执照保持一致",
            "required": true
          },
          {
            "type": "input-text",
            "label": "商户名称",
            "name": "subject_info.business_license_info.merchant_name",
            "id": "u:45d588dd8401",
            "required": true
          },
          {
            "type": "input-text",
            "label": "法定代表人姓名",
            "name": "subject_info.business_license_info.legal_person",
            "id": "u:e4206018e2f0",
            "required": true
          },
          {
            "type": "select",
            "label": "证件类型",
            "name": "subject_info.identity_info.id_doc_type",
            "options": [
              {
                "label": "身份证",
                "value": "IDENTIFICATION_TYPE_IDCARD"
              },
            ],
            "id": "u:4a535336657c",
            "multiple": false,
            "value": "",
            "required": true
          },
          {
            "type": "input-image",
            "label": "身份证人像面照片",
            "name": "idcardcopya",
            "autoUpload": true,
            "proxy": true,
            "uploadType": "fileReceptor",
            "imageClassName": "r w-full",
            "id": "u:36a82acdf582",
            "accept": ".jpeg, .jpg, .png",
            "multiple": false,
            "hideUploadButton": false,
            "required": true
          },
          {
            "type": "hidden",
            "name": "subject_info.identity_info.id_card_info.id_card_copy",
            "id": "u:8ad9ca2857be",
            "label": "身份证人像面mediaId"
          },
          {
            "type": "input-image",
            "label": "身份证国徽面照片",
            "name": "idcardcopyb",
            "autoUpload": true,
            "proxy": true,
            "uploadType": "fileReceptor",
            "imageClassName": "r w-full",
            "id": "u:da100f1d7825",
            "accept": ".jpeg, .jpg, .png",
            "multiple": false,
            "hideUploadButton": false,
            "required": true
          },
          {
            "type": "hidden",
            "name": "subject_info.identity_info.id_card_info.id_card_national",
            "id": "u:7b41fade1431",
            "label": "身份证国徽面mediaId"
          },
          {
            "type": "input-text",
            "label": "身份证号码",
            "name": "subject_info.identity_info.id_card_info.id_card_number",
            "id": "u:d92c683f95e2",
            "required": true
          },
          {
            "type": "input-text",
            "label": "身份证姓名",
            "name": "subject_info.identity_info.id_card_info.id_card_name",
            "id": "u:2a74d52f28d1",
            "required": true
          },
          {
            "type": "input-text",
            "label": "身份证居住地址",
            "name": "subject_info.identity_info.id_card_info.id_card_address",
            "id": "u:5da3eff8afed",
            "required": true
          },
          // {
          //   "type": "radios",
          //   "label": "证件有效期类型",
          //   "name": "subject_info.identity_info.id_card_info.id_card_effective_type",
          //   "options": [
          //     {
          //       "label": "定期",
          //       "value": "A"
          //     },
          //     {
          //       "label": "长期",
          //       "value": "B"
          //     }
          //   ],
          //   "id": "u:9153ef3d6028",
          //   "value": "",
          //   "required": true
          // },
          {
            "type": "input-date",
            "label": "证件生效日期",
            "name": "subject_info.identity_info.id_card_info.card_period_begin",
            "id": "u:474966ccdaab",
            "required": true
          },
          {
            "type": "input-date",
            "label": "证件失效日期",
            "name": "subject_info.identity_info.id_card_info.card_period_end",
            "id": "u:c2ec6aa4ef5e",
            "required": true
          },
          {
            "type": "radios",
            "label": "是否受益人",
            "name": "subject_info.identity_info.owner",
            "options": [
              {
                "label": "是",
                "value": true
              },
              {
                "label": "否",
                "value": false
              }
            ],
            "id": "u:6c30eda3fcf2",
            "value": true,
            "required": true
          }
        ],
        "id": "u:44e257761d79",
        "mode": "normal"
      },
      {
        "title": "经营信息",
        "body": [
          {
            "type": "tpl",
            "tpl": "请填写商家的经营业务信息、售卖商品/提供服务场景信息",
            "inline": true,
            "wrapperComponent": "h3",
            "id": "u:a0b367c81807"
          },
          {
            "type": "input-text",
            "label": "商户简称",
            "name": "business_info.merchant_shortname",
            "id": "u:5bc8a191cf11",
            "required": true
          },
          {
            "type": "input-text",
            "label": "客服电话",
            "name": "business_info.service_phone",
            "id": "u:519d9523efc9",
            "required": true
          },
          {
            "type": "checkboxes",
            "label": "经营场景", //TODO 需要直接默认填写
            "name": "business_info.sales_info.sales_scenes_type",
            "multiple": true,
            "options": [
              {
                "label": "小程序",
                "value": "SALES_SCENES_MINI_PROGRAM"
              },
            ],
            "id": "u:3d16b6738cc2",
            "checkAll": false,
            "joinValues": true,
            "value": "SALES_SCENES_MINI_PROGRAM"
          }
        ],
        "mode": "normal",
        "id": "u:742b23d58f62"
      },
      {
        "title": "行业资质",
        "items": [
          {
            "type": "input-text",
            "name": "var1",
            "label": "文本"
          }
        ],
        "mode": "normal",
        "id": "u:54599d28bd0e",
        "body": [
          {
            "type": "tpl",
            "tpl": "请填写商家所属行业、特殊资质等信息",
            "inline": true,
            "wrapperComponent": "h3",
            "id": "u:9d1bf93b1be0"
          },
          {
            "type": "select",
            "label": "所属行业",
            "name": "settlement_info.qualification_type",
            "options": [
              {
                "label": "体检",
                "value": "体检"
              },
              {
                "label": "旅行社",
                "value": "旅行社"
              },
              {
                "label": "景区/酒店",
                "value": "景区/酒店"
              },
              {
                "label": "会务",
                "value": "会务"
              },
              {
                "label": "家具",
                "value": "家具"
              },
              {
                "label": "鞋服",
                "value": "鞋服"
              },
              {
                "label": "定制礼品",
                "value": "定制礼品"
              },
              {
                "label": "印制",
                "value": "印制"
              },
              {
                "label": "个性设计",
                "value": "个性设计"
              }
            ],
            "id": "u:f3da9f19ef81",
            "multiple": false,
            "required": true
          }
        ]
      },
      {
        "title": "结算账户",
        "items": [
          {
            "type": "input-text",
            "name": "var1",
            "label": "文本"
          }
        ],
        "mode": "normal",
        "id": "u:0f071fe33c76",
        "body": [
          {
            "type": "tpl",
            "tpl": "请填写商家提现收款的银行账户信息",
            "inline": true,
            "wrapperComponent": "h3",
            "id": "u:e4385d37e426"
          },
          {
            "type": "select",
            "label": "账户类型",
            "name": "bank_account_info.bank_account_type",
            "value": "BANK_ACCOUNT_TYPE_CORPORATE",
            "options": [
              {
                "label": "对公银行账户",
                "value": "BANK_ACCOUNT_TYPE_CORPORATE"
              }
            ],
            "id": "u:f3da9f19ef81",
            "multiple": false,
            "required": true
          },
          {
            "type": "input-text",
            "label": "开户名称",
            "name": "bank_account_info.account_name",
            "id": "u:b53a7ea08648",
            "value": "与企业主体同名",
            "readOnly": true,
            "required": true
          },
          {
            "type": "select",
            "label": "开户银行",
            "name": "bank_account_info.account_bank",
            "options": [
              {"label":"工商银行","value":"工商银行"},
              {"label":"交通银行","value":"交通银行"},
              {"label":"招商银行","value":"招商银行"},
              {"label":"民生银行","value":"民生银行"},
              {"label":"中信银行","value":"中信银行"},
              {"label":"浦发银行","value":"浦发银行"},
              {"label":"兴业银行","value":"兴业银行"},
              {"label":"光大银行","value":"光大银行"},
              {"label":"广发银行","value":"广发银行"},
              {"label":"平安银行","value":"平安银行"},
              {"label":"北京银行","value":"北京银行"},
              {"label":"华夏银行","value":"华夏银行"},
              {"label":"农业银行","value":"农业银行"},
              {"label":"建设银行","value":"建设银行"},
              {"label":"邮政储蓄银行","value":"邮政储蓄银行"},
              {"label":"中国银行","value":"中国银行"},
              {"label":"宁波银行","value":"宁波银行"},
              {"label":"其他银行","value":"其他银行"},
            ],
            "multiple": false,
            "required": true
          },
          {
            "name": "bank_account_info.bank_address_code",
            "type": "input-city",
            "label": "开户银行省市编码",
            //"extractValue": false
          },
          { //动态补全支行全称
            "type": "select",
            "label": "开户银行全称",
            "placeholder":"请选择",
            "required": true,
            "name": "bank_account_info.bank_name",
            // "source": "${sku.spuOptions}",//将当前选中的SPU作为默认选项
            "autoComplete":{ //只能从已经有的spu中筛选。并且是从自有库的spu中筛选
              "method": "get",
              "url": glob.domainUrl + "/erp/dataBank/list", 
              "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
              "replaceData": true,
              "autoRefresh": true,
              "adaptor": function (payload, response) {
                //转换为[{value,label}]格式
                let options = new Array();
                payload.result.records.forEach(
                  item => {
                    options.push({
                      value: item.code,
                      label: item.name,
                    });
                  }
                );
                return {
                  msg: "",
                  data: options,
                  status: 0 
                };
              },
              "headers":BIZ_CONFIG.headers,
              "data":{
                "name": "*${term}*", //传递输入的提示内容
                "pageNo": 1,
                "pageSize": 30,//默认30条
              }
            },
          },
          {
            "type": "input-text",
            "label": "银行账号",
            "name": "bank_account_info.account_number",
            "required": true
          },
        ]
      },
      {
        "title": "超级管理员",
        "items": [
          {
            "type": "input-text",
            "name": "var1",
            "label": "文本"
          }
        ],
        "mode": "normal",
        "id": "u:ed12885ef07b",
        "body": [
          {
            "type": "tpl",
            "tpl": "请填写商家的超级管理员信息， 超级管理员需在开户后进行签约，并接收日常重要管理信息和进行资金操作，请确定其为商户法定代表人或负责人",
            "inline": true,
            "wrapperComponent": "h3",
            "id": "u:e36138950d0b"
          },
          {
            "type": "radios",
            "label": "超管身份",
            "name": "contact_info.contact_type",
            "options": [
              {
                "label": "法定代表人/经营者",
                "value": "LEGAL"
              },
              {
                "label": "经办人",
                "value": "SUPER"
              }
            ],
            "id": "u:56c02aebc503",
            "value": "LEGAL",
            "required": true
          },
          {
            "type": "input-text",
            "label": "超管姓名",
            "name": "contact_info.contact_name",
            "id": "u:823c8c7c8ecc",
            "required": true
          },
          {
            "type": "radios",
            "label": "超管资料类型",
            "name": "contact_info.contact_id_doc_type",
            "options": [
              {
                "label": "身份证",
                "value": "IDENTIFICATION_TYPE_IDCARD"
              }
            ],
            "id": "u:9f7938d53d03",
            "required": true
          },
          {
            "type": "input-text",
            "label": "证件号码",
            "name": "contact_info.contact_id_number",
            "id": "u:6a53a3c6ef7f",
            "required": true
          },
          {
            "type": "input-text",
            "label": "手机号码",
            "name": "contact_info.mobile_phone",
            "id": "u:7c0d7a5a12b1",
            "required": true
          },
          {
            "type": "input-text",
            "label": "邮箱",
            "name": "contact_info.contact_email",
            "id": "u:fd91e8016771",
            "required": true
          }
        ]
      },

      // {
      //   "title": "补充材料(选填)",
      //   "items": [
      //     {
      //       "type": "input-text",
      //       "name": "var1",
      //       "label": "文本"
      //     }
      //   ],
      //   "mode": "normal",
      //   "id": "u:2b7bede9d9a3",
      //   "body": [
      //     {
      //       "type": "tpl",
      //       "tpl": "根据实际审核情况，额外要求商家提供指定的补充资料\n",
      //       "inline": true,
      //       "wrapperComponent": "h3",
      //       "id": "u:c8c4e06f5ea6"
      //     },
      //     {
      //       "type": "input-image",
      //       "label": "法人开户承诺函",
      //       "name": "image008",
      //       "autoUpload": true,
      //       "proxy": true,
      //       "uploadType": "fileReceptor",
      //       "imageClassName": "r w-full",
      //       "id": "u:458cd5a90779",
      //       "accept": ".jpeg, .jpg, .png",
      //       "multiple": false,
      //       "hideUploadButton": false
      //     },
      //     {
      //       "type": "input-image",
      //       "label": "法人开户意愿视频",
      //       "name": "image009",
      //       "autoUpload": true,
      //       "proxy": true,
      //       "uploadType": "fileReceptor",
      //       "imageClassName": "r w-full",
      //       "id": "u:0945cc69b518",
      //       "accept": ".jpeg, .jpg, .png, .gif",
      //       "multiple": false,
      //       "hideUploadButton": false
      //     },
      //     {
      //       "type": "textarea",
      //       "label": "补充说明",
      //       "name": "textarea",
      //       "id": "u:9c832623c39a",
      //       "minRows": 3,
      //       "maxRows": 20
      //     },
      //     {
      //       "type": "input-file",
      //       "label": "补充材料",
      //       "autoUpload": true,
      //       "proxy": true,
      //       "uploadType": "fileReceptor",
      //       "name": "file",
      //       "id": "u:e470d1aac876",
      //       "btnLabel": "文件上传",
      //       "multiple": false,
      //       "useChunk": false,
      //       "accept": "",
      //       "drag": false
      //     }
      //   ]
      // }
    ],
    "id": "u:24e816acff2b"
  },
  "id": "u:a0b99d569e1c",
  "aside": [
  ],
  "regions": [
    "body",
    "header"
  ],
  "asideResizor": false,
  "subTitle": "开通微信支付商户后，将激活小程序订单收款能力，并享受0.38%通道费率。申请通过后请通过微信支付平台自行管理账户。"
};

