import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG,BIZ_API,BIZ_CONFIG, WEOPEN_COMPONENT_APP_ID} from '/@/settings/iLifeSetting';
import {isDebug, bizAPI} from './connectors.api';
import { getTenantId, getToken } from "/@/utils/auth";
import { updatePlatformAccount } from '../appstore/apps.api';

const glob = useGlobSetting();

//微信授权信息：包括公众号、小程序、小商店
let grantInfoFormWechat = {
  "type": "form",
  "title": "授权详情",
  "className": "${_visibility}",
  "wrapWithPanel": false,
  "debug": isDebug,
  "debugConfig": {
    "enableClipboard": true,
    "displayDataTypes": true
  },
  "body": [
    {
      "className": "${_visibility}",
      "type": "image",
      "label": "",
      "name": "headImg"
    },
    {
      "type": "input-text",
      "label": "名称",
      "name": "nickName"
    },
    {
      "label": "原始ID",
      "type": "input-text",
      "name": "user_name"
    },
    {
      "type": "input-text",
      "label": "主体名称",
      "name": "principalName"
    },
    {
      "label": "状态类型",
      "type": "input-text",
      "name": "accountStatus"
    },
  ],
  "mode": "normal"
};

//侧边栏表单：显示详情、套餐、使用指南
export const drawer = {
  "type": "page",
  "title": "connector信息-抽屉",
  "data": "${item}", //传递当前选中SKU
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
                    "name": "connectorScheme.price"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "platformAccountId"
                  },
                  {
                    "label": "",
                    "type": "hidden",
                    "name": "id"
                  },
                ],
                "mode": "normal"
              }
            ]
          },
          { //显示授权信息
            "title": "参数配置",
            "body": [
              { //参数配置表单：获取对应的配置表单，没有则不显示
                "type": "service", //必须是service类型，触发schemaApi加载配置表单
                "schemaApi": { //需要根据授权类型获取具体表单
                  "method": "get",
                  "url": "",  //需要根据授权类型分别获取，参见requestAdapter
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "requestAdaptor": function (api) { //根据grantType类型组织查询URL
                    console.log("try load grant info.", api);
                    let orgData = {...api.body}; //采用原始传递的数据
                    //构建不同的查询URL：注意：get请求必须手动添加参数
                    let url = glob.domainUrl + bizAPI.getConnectoryById; //默认为参数配置
                    if(orgData.grantType == "miniprog" )
                      url = glob.domainUrl + bizAPI.getWxAuthMiniprogById + "?id="+orgData.id; //小程序授权
                    else if(orgData.grantType == "mp" )
                      url = glob.domainUrl + bizAPI.getWxAuthMpById+ "?id="+orgData.id; //公众号授权
                    else
                      url = glob.domainUrl + bizAPI.getConnectoryById+ "?id=none"; //无授权
                    //查询授权结果
                    let payload = {
                      ...api,
                      url: url, //使用更新后的url
                    };
                    console.log("try load grant info.", payload);
                    return payload;
                  },
                  "adaptor": function (payload, response) {
                    console.log("got config json form.", payload);
                    if(payload.success && payload.result && payload.result.id){ //成功则显示
                      try{
                        return {
                          status: 0,//payload.success?0:1
                          msg: "",//payload.message,
                          data: {
                            data: payload.result,
                            body: [grantInfoFormWechat]
                          }, //直接显示表单
                        };
                      }catch(err){
                        console.log("error get grant info.",err);
                        return { //调试信息
                          "data": {
                            "text": "授权信息配置错误，请联系管理员",
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
                        data: {//不予显示
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
                    "id": "${id}",
                    "grantType": "${grantType}",
                    "&":"$$" //传递搜索表单数据
                  }
                },
              },
              { //参数配置表单：获取对应的配置表单，没有则不显示
                "type": "service", //必须是service类型，触发schemaApi加载配置表单
                "schemaApi": { //需要从服务器端获取对应的表单
                  "method": "get",
                  "url": glob.domainUrl + "/erp/diyPlatformAccount/queryByIdWithForm",  //直接获取账户配置，同时查询表单配置
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "adaptor": function (payload, response) {
                    console.log("got config json form.", payload);
                    let platformAccount = payload.result; //获取account信息
                    if(payload.success && payload.result && payload.result.id){ //成功则显示
                      try{
                        let json = payload.result.jsonForm.json.replace(/\\n/g,"").replace(/\\"/g,'"');
                        let formdata = JSON.parse(payload.result.accessInfo);
                        console.log("convert to json str.", json, formdata);
                        let jsonForm = JSON.parse(json);
                        //去掉表单包装
                        jsonForm.wrapWithPanel = false;
                        //添加保存按钮
                        jsonForm.body.push(
                          {
                            "label": "修改配置",
                            "type": "button",
                            "level": "primary",
                            "onClick": function(e,props){
                              console.log("try modify platform account.", e, props.data);
                              let data = props.data;
                              //添加access info。根据表单配置遍历得到
                              let accessInfo = {};
                              jsonForm.body.forEach( item => {
                                accessInfo[item.name] = data[item.name];
                              });
                              //修改账号信息
                              platformAccount.accessInfo = JSON.stringify(accessInfo);
                              updatePlatformAccount( platformAccount ); //添加账号并新增connector
                            }
                          }
                        );
                        console.log("got final json form.", jsonForm);
                        return {
                          status: 0,//payload.success?0:1
                          msg: "",//payload.message,
                          data: {
                            data: formdata,
                            body: [jsonForm]
                          }, //直接显示表单
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
                    "id":  "${platformAccountId}", //传递第三方平台账户id
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
                      "summary": "成功发布内容和商品时将消耗虚拟豆，${connectorScheme.name} 每次消耗 ${connectorScheme.price} 虚拟豆，请确保账户余额充足",
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
export const getTable = ( type ) => {
  return {
    "type": "page",
    "title": "连接器",
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
              "url": glob.domainUrl + bizAPI.listConnectorsByType,  //显示可用列表，根据已开通connector过滤
              "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
              "replaceData": true,
              "autoRefresh": true,
              "adaptor": function (payload, response) {
                console.log("got connectors", payload);
                //需要解析extInfo
                let connectors = new Array();
                payload.forEach(item => {
                  try{
                    item.extInfo = JSON.parse(item.extInfo);
                  }catch(err){}
                  connectors.push(item);
                });
                return {
                  total: payload.length,
                  msg: "",
                  data: {
                    "records": connectors,// payload
                  },
                  status: 0 //注意返回值是反着的：后台0为成功，前台0为失败
                };
              },
              "headers":{
                "X-Access-Token": getToken() //设置JWT Token
              },
              "data":{
                //"platformCategory": type, //type为content或product，是platformSource.platformCategory
                //"connectorType": "sink", //connector type
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
                            "url": '${ extInfo.headImg || "https://www.biglistoflittlethings.com/static/logo/distributor/"+platformSource.platform+".png"}',
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
                              "title": "连接器详情",
                              "actions": [],
                              /**
                              "data":{
                                "name":"${name}",
                                "description":"${description}",
                                "logo":"logo:${logo}",
                                "type":"${type}",//连接器操作类型：sink source
                                "platformCategory":"${platformSource.platformCategory}", //连接器数据类别：内容、商品
                                "grantType":"${connectorScheme.platformGrantType}", //授权类型：mp miniprog
                                "id":"${id}", 
                                "version":"${version}"
                              },
                              //** */
                              "body": drawer
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
}