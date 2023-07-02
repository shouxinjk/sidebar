import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG, SX_API} from '/@/settings/iLifeSetting';
import {isDebug, bizAPI, checkPayResult, createSubscritpionRecord} from './apps.api';
import { getTenantId, getToken } from "/@/utils/auth";
import { Md5 } from 'ts-md5';

const glob = useGlobSetting();

//侧边栏表单：显示详情、套餐、使用指南
export const drawerApp: FormSchema = {
  "type": "page",
  "title": "APP信息-抽屉",
  //"data": "${rowItem}", //传递当前选中SKU
  "body":{
    "type": "form",
    "id": "skuform",
    "title": "",
    //"submitText": "保存修改",
    "wrapWithPanel": false,
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "type": "tabs",
        "tabs": [
          {
            "title": "APP信息",
            "id": "appInfo",
            "body": [
              {
                "type": "container",
                "title": "表单",
                //"data": "${rowItem}", //传递当前选中SKU
                "wrapWithPanel": false,
                "debug": isDebug,
                "debugConfig": {
                  "enableClipboard": true,
                  "displayDataTypes": true
                },
                "body": [
                  {
                    "type": "input-text",
                    "label": "名称",
                    "name": "name"
                  },
                  {
                    "type": "input-text",
                    "label": "类型",
                    "name": "type"
                  },
                  {
                    "type": "input-text",
                    "label": "版本",
                    "name": "version"
                  },
                  {
                    "label": "概要介绍",
                    "type": "textarea",
                    "name": "description"
                  },
                  {
                    "type": "textarea",
                    "label": "能力清单",
                    "name": "capabilities"
                  },
                  {
                    "type": "textarea",
                    "label": "服务清单",
                    "name": "services"
                  },
                  {
                    "type": "textarea",
                    "label": "资源清单",
                    "name": "resources"
                  }
                ],
                "mode": "normal",
                "id": "u:39e435e97b33"
              }
            ]
          },
          {
            "title": "订阅计划",
            "body": [
              {
                "type": "service",
                "id":"serviceapps",
                "initFetch": true,
                "api": {
                  "method": "get",
                  "url": glob.domainUrl + bizAPI.listPricePlans, //查询所有套餐
                  "headers":{
                    'X-Access-Token': getToken() //设置JWT Token
                  },
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "adaptor": function (payload, response) {
                    return {
                      total: 30,
                      msg: "success",
                      data: payload.result,
                      status: 0
                    };
                  },
                  "data":{
                    //"&": "$$" //当前选定app作为参数
                    "appId": "${appId}"
                  }
                },
                "body": [
                  {
                    "type": "each",
                    "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                    "className": "w-full", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                    "items": {
                      "type": "card",
                      "className": "w-full",
                      "header": {
                        "title": "${name}",
                        "subTitle": "￥${price*0.01} ",
                        "avatarText": "订阅",
                      },
                      "body":"${discount}",
                      //"secondary": "${knowledgeCategoryId_dictText}",
                      "actions": [
                        { //选中后显示二维码
                          "type": "button",
                          "label": "选择并订阅",
                          "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                          "onEvent": {
                            "click": {
                              "actions": [
                                {
                                  "actionType": "dialog",
                                  "dialog": {
                                    "title": "订阅/续费",
                                    "body": [
                                      {
                                        "type": "page",
                                        "className":"text-center items-center justify-center place-content-center	",
                                        "initApi": { //需要从服务器端获取授权链接
                                          "method": "POST",
                                          "url": SX_API+"/wxPay/rest/qrcode-url",  //获取微信支付二维码
                                          "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                                          "replaceData": true,
                                          "autoRefresh": true,
                                          "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
                                            let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
                                            console.log("got current sale package.", orgData);
                                            //根据当前选中套餐构建二维码链接
                                            let out_trade_no = "sub"+Md5.hashStr(""+getTenantId()+orgData.id+""+(new Date().getTime())).substr(3);//购买虚拟豆: 总长度32位， 前三位ppt为购买阅豆
                                            let targetData = {
                                              out_trade_no:out_trade_no,
                                              total_fee:orgData.price,//单位为分
                                              decription:orgData.name,
                                            };
                              
                                            //提交一条空白购买记录，待支付完成后更新相应数据
                                            createSubscritpionRecord(out_trade_no, orgData.appId, orgData.id, orgData.durationType);
                        
                                            //开始查询支付结果
                                            checkPayResult(out_trade_no);
                        
                                            let postData = {
                                              ...api,
                                              data: targetData //使用组装后的查询条件
                                            };
                                            console.log("prepare post data.", postData);
                                            return postData;
                                          },
                                          "adaptor": function (payload, response) {
                                            console.log("got wechatpay qrcode url.", payload);
                                            if(payload.success){ //成功则显示
                                              return {
                                                msg: "",//payload.message,
                                                data: {
                                                  "text": "微信扫码支付",
                                                  "summary": "",
                                                  "url": payload.data,//使用默认的第三方平台应用APPID
                                                },
                                                status: 0,//payload.success?0:1
                                              };
                                            }else{
                                              return { //否则显示空白
                                                msg: "",
                                                data: {
                                                  "text": "",
                                                  "summary": "",
                                                  "url": "#",//
                                                  "style":"display:none",
                                                },
                                                status: 0,//payload.success?0:1
                                              };
                                            }
                                          },
                                          "data":{
                                            "price": "${price}", //传递价格：单位为分
                                            "id": "${id}", //当前选中阅豆产品ID
                                            "name":"${name}", //当前选中产品名称
                                            "appId":"${appId}", //当前选中产品ID
                                            "durationType":"${durationType}", //当前选中订阅类型
                                            "&":"$$" //传递搜索表单数据
                                          }
                                        },
                                        "body":[
                                          { //显示购买内容
                                            "type": "tpl",
                                            "tpl": "${appId_dictText} ${name}<br/>￥${price*0.01}<br/>&nbsp;"
                                          },
                                          {
                                            "type": "qr-code",
                                            "className":"mx-38",
                                            "codeSize": 128,
                                            "value": "${url}"
                                          },
                                          { //购买提示
                                            "type": "tpl",
                                            "tpl": "<br/>打开微信扫码付款"
                                          },
                                        ]
                                        
                                      }
                                    ],
                                    "actions": [
                                      {
                                        "type": "button",
                                        "actionType": "cancel",
                                        "label": "取消",
                                        "primary": false
                                      }
                                    ],
                                  }
                                },
                              ]
                            }
                          }
                        },
                      ],
                      "toolbar": [
                        {
                          "type": "mapping",
                          "label": "订阅时长",
                          "name": "durationType",
                          "map": {
                            "yearly": {
                              "type": "tpl",
                              "tpl": "按年订阅",
                              "className": "label label-info"
                            },
                            "half-yearly": {
                              "type": "tpl",
                              "tpl": "按半年订阅",
                              "className": "label label-danger"
                            },
                            "quarterly": {
                              "type": "tpl",
                              "tpl": "按季度订阅",
                              "className": "label label-warning"
                            },
                            "*": "${durationType}"
                          }
                        },
                      ],
                    }
                  },
                ]
              }
            ]
          },
          {
            "title": "使用指南",
            "body": [
              {
                "type": "form",
                "id": "stockInfo",
                "title": "库存与价格设置",
                "wrapWithPanel": false,
                //"data": "${rowItem}", //传递当前选中SKU
                "submitText":"设置",
                "debug": isDebug,
                "debugConfig": {
                  "enableClipboard": true,
                  "displayDataTypes": true
                },
                "body": [
                  {
                    "data": {
                      "text": "管理员指南",
                      "summary": "管理员服务开通、账号管理、系统配置相关内容",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "在线客服",
                      "summary": "管理员服务开通、账号管理、系统配置相关内容",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "定制师指南",
                      "summary": "定制师操作流程，包括行程设计、报价策略、客户沟通话术、企业知识库、AI智能助手",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "内容生成指南",
                      "summary": "AI内容生成、自定义生成模板、动态摘要设置等",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "第三方内容平台及电商平台对接",
                      "summary": "配置内容平台账号、电商平台账号，能够实现数据一键发布，极大减少运营工作",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "优惠活动",
                      "summary": "订阅及升级优惠，邀请有礼，贡献奖励内容",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  }
                ],
                "mode": "horizontal"
              }
            ],
          }
        ],
        "id": "u:2f6e6830097e"
      }
    ],
  },
  "actions": [         
    {
      "actionType": "toast", // TODO：替换为按钮操作
      "args": { // 
        "msgType": "info",
        "msg": "点击抽屉按钮 ${event.data|json}"
      }
    }
  ],
  "asideResizor": false,
  "pullRefresh": {
    "disabled": true
  },
  "regions": [
    "body"
  ]
};

//查询所有APP
export const tableApps: FormSchema = {
  "type": "page",
  "id": "u:f71ee9197152",
  "title": "自有商品商品库存",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "data": { //数据通过page在搜索表单及数据列表间传递
        "name": ""
      },
      "body": [
        {
          "type": "flex",
          "className": "p-1 m-8",
          "items": [
            {
              "type": "container",
              "body": [
                {
                  "type": "input-text",
                  "label": "名称",
                  "name": "name"
                }
              ],
              "size": "xs",
              "style": {
                "position": "static",
                "display": "block",
                "flex": "1 1 auto",
                "flexGrow": 1,
                "flexBasis": "auto"
              },
              "wrapperBody": false,
              "isFixedHeight": false,
              "isFixedWidth": false
            },
            {
              "type": "container",
              "body": [
                {
                  "type": "button",
                  "label": "搜索",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "reload", // 重新加载SKU表格，根据新的搜索条件
                          "componentId": "serviceapps", // 触发sku数据加载：注意需要触发service，table仅负责显示数据
                          "args":{
                            "&": "$$"
                          }
                        }
                      ]
                    }
                  },
                  "size": "md",
                  "level": "primary"
                }
              ],
              "size": "xs",
              "style": {
                "position": "static",
                "display": "block",
                "flex": "1 1 auto",
                "flexGrow": 1,
                "flexBasis": "auto"
              },
              "wrapperBody": false,
              "isFixedHeight": false,
              "isFixedWidth": false
            }
          ],
          "style": {
            "position": "static",
            "flexWrap": "nowrap"
          },
          "direction": "row",
          "justify": "space-evenly",
          "alignItems": "stretch",
          "isFixedHeight": false,
          "isFixedWidth": false
        },
        {
          "type": "service",
          "id":"serviceapps",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": glob.domainUrl + bizAPI.listApps, 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "adaptor": function (payload, response) {
              return {
                total: payload.result.total,
                msg: payload.message,
                data: {
                  "records": payload.result.records
                },
                status: payload.code==0?1:0 //注意返回值是反着的：后台0为成功，前台0为失败
              };
            },
            "headers":{
              "X-Access-Token": getToken() //设置JWT Token
            },
            "data":{
              "tenantId": 0, //指定为系统租户数据
              "&":"$$" //传递搜索表单数据
            }
          },
          "body": [
            {
              "type": "pagination-wrapper",
              "position": "bottom",
              //"inputName": "rows",
              //"outputName": "rows",
              "perPage": 10,
              "body": [
                {
                  "type": "flex",
                  "className": "flex-wrap space-x-2",
                  "items": [
                    {
                      "type": "each",
                      "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                      "className": "flex flex-row flex-wrap space-x-2", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                      "items": {
                        "type": "card",
                        "className": "w-60",
                        "header": {
                          "title": "${name}"
                        },
                        "media": {
                          "type": "image",
                          "className": "w-60 h-40",
                          "url": "${logo?logo:'https://www.biglistoflittlethings.com/static/logo/distributor/ilife.png'}",
                          "position": "top"
                        },
                        "body": [
                          {
                            "type": "tpl",
                            "tpl": "${description}",
                            "inline": false,
                            "id": "u:17b9f8e7208d"
                          }
                        ],
                        //"secondary": "${id}",
                        /**
                        "actions": [
                          {
                            "type": "button",
                            "label": "详情",
                            "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                            "drawer": {
                              "id":"drawerApp",
                              "position": "right",
                              "size": "md",
                              "closeOnOutside":true,
                              "title": "APP详情",
                              "actions": [],
                              "body": drawerApp
                            }
                          },
                          {
                            "actionType": "setValue", // 将 rowItem 手动设置到表单域
                            "componentId": "skuform",
                            "data": "${item}",
                            "value": "${item}",
                            "args": { // ignore : 在SPU表格中将自动获取搜索条件
                              "msgType": "info",
                              "msg": "设置SKU数据 ${event.data|json} ${__rendererData|json}"
                            }
                          }
                        ],
                        //** */
                        "itemAction": {
                          "type": "button",
                          "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                          "drawer": {
                            "id":"drawerApp",
                            "position": "right",
                            "size": "md",
                            "closeOnOutside":true,
                            "title": "APP详情",
                            "actions": [],
                            "data":{
                              "name":"${name}",
                              "description":"${description}",
                              "logo":"logo:${logo}",
                              "type":"${type}",
                              "appId":"${id}",
                              "version":"${version}"
                            },
                            "body": drawerApp
                          }
                        },
                        "toolbar": [
                          {
                            "type": "mapping",
                            "name": "type",
                            "map": {
                              "saas": {
                                "type": "tpl",
                                "tpl": "SaaS",
                                "className": "label label-info"
                              },
                              "plugin": {
                                "type": "tpl",
                                "tpl": "浏览器插件",
                                "className": "label label-danger"
                              },
                              "miniprog": {
                                "type": "tpl",
                                "tpl": "小程序",
                                "className": "label label-warning"
                              },
                              "*": "${type}"
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "id": "formsku",
      "wrapperBody": false,
      "mode": "horizontal"
    },
    { //关闭对话框
      "type": "button",
      "label": "关闭对话框",
      "className": "px-2 mx-4 border border-solid __sx__btn__closeDialog text-transparent border-0",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "closeDialog", // 直接关闭对话框
              "componentId": "wxpayDialog",
            },
            {
              "actionType": "toast",
              "args": {
                "msgType": "success",
                "msg": "恭喜，支付成功~~",
                "position": "top-center"
              }
            },
          ]
        }
      }
    },
    
  ],
  "asideResizor": false,
  "pullRefresh": {
    "disabled": true
  },
  "asideSticky": false,
  "regions": [
    "body"
  ],
  "data": {
  }
};

