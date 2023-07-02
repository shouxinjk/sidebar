import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG, WEB_API, WEOPEN_COMPONENT_APP_ID} from '/@/settings/iLifeSetting';
import {isDebug} from './connectorSchemes.api';
import { getTenantId, getToken } from "/@/utils/auth";
import {bizAPI, registerPlatformAccount} from './apps.api';
const glob = useGlobSetting();

//侧边栏表单：显示详情、套餐、使用指南
export const getDrawer = ( ) => {
  let drawer = {
    "type": "page",
    "title": "connector信息-抽屉",
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
              "title": "连接器信息",
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
                      "label": "概要",
                      "type": "textarea",
                      "name": "description"
                    },
                    {
                      "label": "价格",
                      "type": "input-text",
                      "name": "price"
                    },
                    {
                      "label": "",
                      "type": "hidden",
                      "name": "platformGrantType"
                    },
                    {
                      "label": "",
                      "type": "hidden",
                      "name": "platformAccountScheme.configForm"
                    },
                    {
                      "label": "",
                      "type": "hidden",
                      "name": "platformSource.id"
                    },
                    {
                      "label": "",
                      "type": "hidden",
                      "name": "id"
                    },
                    {
                      "label": "",
                      "type": "hidden",
                      "name": "platformAccountId"
                    },
                  ],
                  "mode": "normal" 
                }
              ]
            },
            { //根据连接器授权类型显示授权信息，自动构建授权链接
              "title": "参数配置",
              "body": [
                { //对于微信公众号、小程序、小商店等直接通过授权完成配置： 当前默认支持小程序配置：在支持更多平台时需要通过requestAdaptor对请求生成授权链接进行区分
                  "initApi": { //需要从服务器端获取授权链接
                    "method": "post",
                    "url": glob.domainUrl + "/weopen/pre-auth-url/"+WEOPEN_COMPONENT_APP_ID,  //构建授权链接
                    "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                    "replaceData": true,
                    "autoRefresh": true,
                    "adaptor": function (payload, response) {
                      console.log("got pre auth url payload.", payload);
                      if(payload.success){ //成功则显示
                        return {
                          msg: "",//payload.message,
                          data: {
                            "text": "立即授权",
                            "summary": "授权后将激活自动发布功能。请使用管理员微信扫码授权",
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
                    "headers":{
                      "X-Access-Token": getToken() //设置JWT Token
                    },
                    "data":{
                      "url": WEB_API + "/my/connectors/${type}?schemeId=${id}", //传递回调地址：注意需要传递连接器业务类型
                      //"&":"$$" //传递搜索表单数据
                    }
                  },
                  "type": "page",
                  "body": "<div style='${style}' ><a href='${url}'>${text}</a></div><div>${summary}</div>"
                },
                { //参数配置表单：获取对应的配置表单，没有则不显示
                  "type": "service", //必须是service类型，触发schemaApi加载配置表单
                  "schemaApi": { //需要从服务器端获取对应的表单
                    "method": "get",
                    "url": glob.domainUrl + "/erp/diyForm/queryById",  //直接获取表单
                    "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                    "replaceData": true,
                    "autoRefresh": true,
                    "adaptor": function (payload, response) {
                      console.log("got config json form.", payload);
                      if(payload.success && payload.result && payload.result.id){ //成功则显示
                        try{
                          let json = payload.result.json.replace(/\\n/g,"").replace(/\\"/g,'"');
                          console.log("convert to json str.", json);
                          let jsonForm = JSON.parse(json);
                          //去掉表单包装
                          jsonForm.wrapWithPanel = false;
                          //添加保存按钮
                          jsonForm.body.push(
                            {
                              "label": "保存配置并启用",
                              "type": "button",
                              "level": "primary",
                              "onClick": function(e,props){
                                console.log("try register platform account.", e, props.data);
                                let data = props.data;
                                //添加access info。根据表单配置遍历得到
                                let accessInfo = {};
                                jsonForm.body.forEach( item => {
                                  accessInfo[item.name] = data[item.name];
                                });
                                //账号信息
                                let platformAccount = { 
                                  name: data.platformAccountScheme.name,
                                  platformSourceId: data.platformSource.id,
                                  accountSchemeId: data.platformAccountScheme.id,
                                  accessInfo: JSON.stringify(accessInfo),
                                  status: "active",
                                  description: data.platformAccountScheme.description,
                                  platformAccountScheme: {
                                    id: data.platformAccountId,
                                  },
                                };
                                //连接器信息
                                let connector = { 
                                  name: data.name,//配置表单内的元素不能重名
                                  type: data.type,//配置表单内的元素不能重名
                                  schemeId: data.id,//配置表单内的元素不能重名
                                  //extInfo: JSON.stringify(accessInfo), //将accessInfo存入connector：此处仅做冗余
                                  platformSourceId: data.platformSource.id,
                                  //platform_account_id: "", //保存时自动生成
                                  status: "active",
                                  description: data.description,
                                  connectorScheme: {
                                    price: data.price,
                                  },
                                };
                                registerPlatformAccount( platformAccount , connector ); //添加账号并新增connector
                              }
                            }
                          );
                          console.log("got final json form.", jsonForm);
                          return {
                            status: 0,//payload.success?0:1
                            msg: "",//payload.message,
                            data: jsonForm, //直接显示表单
                          };
                        }catch(err){
                          console.log("failed parse json form",err);
                          return { //调试信息
                            "data": {
                              "text": "表单配置错误，请联系管理员",
                              "summary": JSON.stringify(payload.result),
                            },
                            "type": "page",
                            "body": "<div>${text}</div><div>${summary}</div>"
                          }
                        }

                      }else{
                        return { //无表单定义时，默认不显示内容
                          status: 0,
                          msg: "",
                          data: isDebug?{ //调试信息
                            "data": {
                              "text": "未能获取相应的配置表单，请检查",
                              "summary": "请联系管理员根据数据源定义表单",
                              "url": "https://www.biglistoflittlethings.com",
                            },
                            "type": "page",
                            "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                          }:{//不予显示
                            "data": {
                              "text": "啥也不显示",
                            },
                            "type": "page",
                            "body": "<div style='display:none'>${summary}</div>"
                          }
                        };
                      }
                    },
                    "headers":{
                      "X-Access-Token": getToken() //设置JWT Token
                    },
                    "data":{
                      "id":  "${platformAccountScheme && platformAccountScheme.configForm?platformAccountScheme.configForm:''}", //传递表单ID
                      //"&":"$$" //传递搜索表单数据
                    }
                  },
                },
              ]
            },
            {
              "title": "使用指南",
              "body": [
                {
                  "type": "form",
                  "id": "stockInfo",
                  "title": "使用说明",
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
                        "text": "配置说明",
                        "summary": "${platformAccountScheme.configGuide}",
                        "url": "${platformAccountScheme.configUrl}",
                      },
                      "type": "page",
                      "body": "<div><a href='${url}'>${text}</a></div><div>${summary|raw}</div>"
                    },
                    {
                      "data": {
                        "text": "使用方法",
                        "summary": "进入内容列表、方案列表、产品列表等，均可以触发发布操作，发布时将自动显示所有可用的连接器。",
                        "url": "https://www.biglistoflittlethings.com",
                      },
                      "type": "page",
                      "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                    },
                    {
                      "data": {
                        "text": "连接器费用",
                        "summary": "成功发布内容和商品时将消耗虚拟豆，${name} 每次将消耗 ${price} 虚拟豆，请确保账户余额充足",
                        "url": "https://www.biglistoflittlethings.com",
                      },
                      "type": "page",
                      "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                    },
                  ],
                  "mode": "horizontal"
                }
              ],
            },
          ],
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
  return drawer;
}

//查询所有APP
export const tableApps: FormSchema = {
  "type": "page",
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
            "url": glob.domainUrl + "/erp/stoConnectorScheme/list-by-type",  //显示可用列表，根据已开通connector过滤
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "adaptor": function (payload, response) {
              return {
                total: payload.length,
                msg: "",
                data: {
                  "records": payload
                },
                status: 0 //注意返回值是反着的：后台0为成功，前台0为失败
              };
            },
            "headers":{
              "X-Access-Token": getToken() //设置JWT Token
            },
            "data":{
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
                          "url": "https://www.biglistoflittlethings.com/static/logo/distributor/${platformSource.platform}.png",
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
                            "title": "连接器信息",
                            "actions": [],
                            /**
                            "data":{
                              "name":"${name}",
                              "description":"${description}",
                              "logo":"logo:${logo}",
                              "type":"${type}",
                              "version":"${version}",
                              "platformGrantType":"${platformGrantType}",
                              "id":"${id}",
                            },
                            //** */
                            "body": getDrawer()
                          }
                        },
                        "toolbar": [
                          {
                            "type": "mapping",
                            "name": "type",
                            "map": {
                              "source": {
                                "type": "tpl",
                                "tpl": "数据输入",
                                "className": "label label-success"
                              },
                              "sink": {
                                "type": "tpl",
                                "tpl": "数据输出",
                                "className": "label label-info"
                              },
                              "both": {
                                "type": "tpl",
                                "tpl": "输入+输出",
                                "className": "label label-danger"
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

