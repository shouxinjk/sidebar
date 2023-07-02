import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG} from '/@/settings/iLifeSetting';
import {isDebug, bizAPI, buyService} from './apps.api';
import { getTenantId, getToken } from "/@/utils/auth";

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
            "title": "增值服务信息",
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
                    "label": "适用类别",
                    "name": "version"
                  },
                  {
                    "label": "概要介绍",
                    "type": "textarea",
                    "name": "description"
                  },
                  {
                    "label": "购买价格",
                    "type": "input-text",
                    "name": "pricePurchase"
                  },
                  {
                    "label": "使用价格",
                    "type": "input-text",
                    "name": "priceCost"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "logo"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "code"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "status"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "version"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "demo"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "category"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "id"
                  },
                  {
                    "label": "${ price&&price>0 ? '立即购买':'立即启用'}",
                    "type": "button",
                    "level": "primary",
                    "onClick": function(e,props){
                      console.log("try buy service.", e, props);
                      buyService(props.data); //购买服务，完成后提示购买已完成
                    }
                  },
                ],
                "mode": "normal"
              }
            ]
          },
          {
            "title": "使用指南",
            "body": [
              {
                "type": "form",
                "id": "stockInfo",
                "title": "使用指南",
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
                      "text": "商品增值服务",
                      "summary": "增值服务主要指在平台内进行推广。启用增值服务后，定制师或用户在搜索或定制的过程中，能够优先看到匹配需求的产品信息，帮助获取更多订单。",
                      "url": "https://docs.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}' target='_blank'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "内容增值服务",
                      "summary": "平台建立有基于公众号的内容矩阵，启用内容增值服务后，能够在公众号矩阵内进行推广，能够快速接收开白转载请求，提升用户触达，获取更多曝光量。",
                      "url": "https://docs.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}' target='_blank'>${text}</a></div><div>${summary}</div>"
                  },
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
            "url": glob.domainUrl + bizAPI.listServices,
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
              "category":"valueadded",
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
                              "size": "lg",
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
                            "title": "生成/发布服务详情",
                            "actions": [],
                            "body": drawerApp
                          }
                        },
                        "toolbar": [
                          {
                            "type": "mapping",
                            "name": "type",
                            "map": {
                              "topping-product": {
                                "type": "tpl",
                                "tpl": "产品置顶推荐",
                                "className": "label label-info"
                              },
                              "topping-content": {
                                "type": "tpl",
                                "tpl": "内容转载矩阵",
                                "className": "label label-info"
                              },
                              "ai-video": {
                                "type": "tpl",
                                "tpl": "AI视频生成",
                                "className": "label label-danger"
                              },
                              "gen-html": {
                                "type": "tpl",
                                "tpl": "图文内容生成",
                                "className": "label label-danger"
                              },
                              "gen-h5": {
                                "type": "tpl",
                                "tpl": "H5活动页生成",
                                "className": "label label-danger"
                              },
                              "pub-commodity": {
                                "type": "tpl",
                                "tpl": "商品发布服务",
                                "className": "label label-warning"
                              },
                              "pub-html": {
                                "type": "tpl",
                                "tpl": "图文内容发布",
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
    }
    
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

