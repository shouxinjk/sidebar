import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG} from '/@/settings/iLifeSetting';
import {isDebug, bizAPI} from './apps.api';
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
            "title": "服务信息",
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
                    "label": "价格",
                    "type": "input-text",
                    "name": "price"
                  },
                ],
                "mode": "normal"
              }
            ]
          },
          {
            "title": "立即购买",
            "body": [
              {
                "data": {
                  "text": "模板如何生效",
                  "summary": "关于模板自动化规则、接收参数、生成方法等",
                  "url": "https://www.biglistoflittlethings.com",
                },
                "type": "page",
                "body": "<div>扫码立即购买。 购买后进入相应行程、笔记、素材等即可使用模板生成内容。请确保虚拟豆充足，在生成过程中将扣除相应的虚拟豆。</div>"
              },
              {
                "type": "qr-code",
                "codeSize": 128,
                "value": "https://www.baidu.com"
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
                      "text": "模板如何生效",
                      "summary": "关于模板自动化规则、接收参数、生成方法等",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "模板使用与费用",
                      "summary": "模板购买后即可无限制使用",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "生成内容存储",
                      "summary": "内容生成后如何存储？",
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
              "tenantId": getTenantId(), //指定为当前租户数据
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
                            "size": "lg",
                            "closeOnOutside":true,
                            "title": "生成/发布服务详情",
                            "actions": [],
                            "data":{
                              "name":"${name}",
                              "description":"${description}",
                              "logo":"logo:${logo}",
                              "type":"${type}",
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

