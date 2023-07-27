import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import {Md5} from 'ts-md5';

import {SEARCH_API, SEARCH_CONFIG, BIZ_API, BIZ_CONFIG, WEB_API, MP_API } from '/@/settings/iLifeSetting';
import { getTenantId } from '/@/utils/auth';

import {  isDebug,bizAPI, sendAiMsg, sendKbMsg, copyToClipboard, sendRedirect, hookSop, hookAutoReply, sendGenContent, copyGenContent, openConentLink, hot, appendText, replaceText, copyGenPoster, sendImageMsg } from './editor.api';
import { DollarCircleTwoTone } from '@ant-design/icons-vue';

import {ToastComponent, AlertComponent, alert, confirm, toast,Drawer} from 'amis-ui';
import { DrawerAction } from 'amis-core/lib/actions/DrawerAction';

import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();


//海报列表，能够展示海报，支持搜索
export const posterForm = {
  "type": "page",
  "name": "posterform",
  "id": "posterform",
  "title": "海报列表",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "className": "w-full -m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        "name":null
      },
      "body": [
        {
          "type": "input-group",
          "label": "",
          "className": "w-full",
          "body": [
            {
              "type": "input-text",
              "className":"w-full",
              "placeholder": "根据方案、产品、笔记搜索", 
              "name": "itemName"
            },
            {
              "type": "button",
              "label": "搜索",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                      "componentId": "posterservice", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                      "args": { // ignore : 在SPU表格中将自动获取搜索条件
                        "&": "$$"
                      }
                    }
                  ]
                }
              },
              "size": "md",
              "level": "primary"
            }
          ]
        },
        {
          "type": "service",
          "id":"posterservice",
          "className":"mb-20",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+"/erp/diyGenPoster/list", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            // "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
            //   let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
            //   let targetData = {
            //     name: null, //
            //   };
            //   //根据搜索表单的值设置搜索条件
            //   if(orgData.name){
            //     targetData.name = orgData.name;
            //   }
            //   let payload = {
            //     ...api,
            //     data: targetData //使用组装后的查询条件
            //   };
            //   console.log("try solution search.", payload);
            //   return payload;
            // },
            "adaptor": function (payload, response) {
              return {
                total: payload.result && payload.result.total ? payload.result.total : 0,
                msg: payload.success ? "success" : "failure",
                data: {
                  records: payload.result.records, //payload.result.record,
                },
                status: payload.success ? 0 : 1
              };
            },
            ...BIZ_CONFIG,
            "data":{
              pageNo: 1,
              pageSize: 20,
              itemName: "*${itemName}*" //itemName模糊匹配
              //"&": "$$", //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
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
                  "type": "each",
                  "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                  // "className": "w-full", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                  "items": {
                    "type": "card",
                    "className": "w-full",
                    "header": {
                      "title": "${itemName}",
                    },
                    "media": {
                      "type": "image",
                      "className": "h-48 w-32",
                      "url": "${url}",
                      "position": "left"
                    },
                    "body":{
                      "type":"tpl",
                      "className": "text-xs",
                      "tpl":"类型：${itemType_dictText} <br/>来源：${itemName} <br/>模板：${templateId_dictText}<br/>生成时间：${createTime }",
                    },
                    // "secondary": "${extJson.from?'出发地:'+extJson.from:'' + extJson.region?' 目的地:'+extJson.region:'' + extJson.days?' 行程天数:'+extJson.days:''}",
                    "actions": [
                      { 
                        "type": "button",
                        "label": "查看大图", //跳转到MP预览内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect url",context, props.data);
                                  sendRedirect(props.data.url)
                                },
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "添加到正文", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(context,doAction,event){
                                  console.log("try copy poster url", context, event.data);
                                  sendImageMsg( event.data.url );
                                  // copyToClipboard("text/html", e.props.data.title + e.props.data.solutionNoteId_dictText);
                                  // 直接设置数据
                                  // event.setData(hot.sopEvent);
                                  //打开抽屉
                                  // doAction({ //注意：参数通过hot传递，即当前currentSalePackage
                                  //   "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                                  //   "drawer": {
                                  //     "position": "right",
                                  //     "size": "md",
                                  //     "closeOnOutside":true,
                                  //     "title": "基础订阅计划",
                                  //     "data": {"salePackage": hot.currentSalePackage},
                                  //     "actions": [],
                                  //     "body": drawerSalePackages
                                  //   }
                                  // });
                                }
                              },
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "海报已添加到正文"
                                }
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "复制到剪贴板",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(context,doAction,event){
                                  console.log("try copy poster", context, event.data);
                                  copyGenPoster( event.data );
                                  // copyToClipboard("text/html", e.props.data.title + e.props.data.solutionNoteId_dictText);
                                  // 直接设置数据
                                  // event.setData(hot.sopEvent);
                                  //打开抽屉
                                  // doAction({ //注意：参数通过hot传递，即当前currentSalePackage
                                  //   "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                                  //   "drawer": {
                                  //     "position": "right",
                                  //     "size": "md",
                                  //     "closeOnOutside":true,
                                  //     "title": "基础订阅计划",
                                  //     "data": {"salePackage": hot.currentSalePackage},
                                  //     "actions": [],
                                  //     "body": drawerSalePackages
                                  //   }
                                  // });
                                }
                              },
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "海报已复制到剪贴板，可直接粘贴"
                                }
                              },
                            ]
                          }
                        }
                      },
                    ],
                    "toolbar": [
                      // {
                      //   "type": "tpl",
                      //   "tpl": "${extJson.from || extJson.region}",
                      //   "className": "label label-warning"
                      // },
                      {
                        "type": "mapping",
                        "label": "来源类型",
                        "name": "itemType",
                        "map": {
                          "solution": {
                            "type": "tpl",
                            "tpl": "定制方案",
                            "className": "label label-success"
                          },
                          "spu": {
                            "type": "tpl",
                            "tpl": "产品包/资源",
                            "className": "label label-success"
                          },
                          "sku": {
                            "type": "tpl",
                            "tpl": "产品/套餐",
                            "className": "label label-success"
                          },
                          "note": {
                            "type": "tpl",
                            "tpl": "笔记",
                            "className": "label label-success"
                          },
                          "*":{
                            "type": "tpl",
                            "tpl": "${itemType_dictText}",
                            "className": "label label-success"
                          }
                        }
                      },
                      
                    ],
                  }
                },
              ]
            }
          ]
        }
      ],
      "wrapperBody": false,
      // "mode": "horizontal"
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

//方案库查询表单：带有搜索框，默认显示全部，搜索查询全部
export const solutionForm = {
  "type": "page",
  "name": "solutionform",
  "id": "solutionform",
  "title": "方案列表",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "className": "w-full -m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        "name":null
      },
      "body": [
        {
          "type": "input-group",
          "label": "",
          "className": "w-full",
          "body": [
            {
              "type": "input-text",
              "className":"w-full",
              "placeholder": "关键字", 
              "name": "name"
            },
            {
              "type": "button",
              "label": "搜索",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                      "componentId": "solutionservice", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                      "args": { // ignore : 在SPU表格中将自动获取搜索条件
                        "&": "$$"
                      }
                    }
                  ]
                }
              },
              "size": "md",
              "level": "primary"
            }
          ]
        },
        {
          "type": "service",
          "id":"solutionservice",
          "className":"mb-20",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+bizAPI.solution.list, 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
              let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
              let targetData = {
                name: null, //
              };
              //根据搜索表单的值设置搜索条件
              if(orgData.name){
                targetData.name = orgData.name;
              }
              let payload = {
                ...api,
                data: targetData //使用组装后的查询条件
              };
              console.log("try solution search.", payload);
              return payload;
            },
            "adaptor": function (payload, response) {
              let records = [];
              payload.result.records.forEach( record => {
                try{
                  record.extJson = JSON.parse(record.extInfo);
                  if(record.extJson.region && record.extJson.region.trim().length>0){
                    record.extJson.region = record.extJson.region.split(" ")[0].trim();
                  }
                  records.push(record);
                }catch(err){}
              });
              return {
                total: payload.result && payload.result.total ? payload.result.total : 0,
                msg: payload.success ? "success" : "failure",
                data: {
                  records: records, //payload.result.record,
                },
                status: payload.success ? 0 : 1
              };
            },
            ...BIZ_CONFIG,
            "data":{
              pageNo: 1,
              pageSize: 20,
              //"&": "$$", //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
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
                  "type": "each",
                  "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                  // "className": "w-full", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                  "items": {
                    "type": "card",
                    "className": "w-full",
                    "header": {
                      "title": "${name}",
                    },
                    "media": {
                      "type": "image",
                      "className": "w-full h-24",
                      "url": "${logo}",
                      "position": "top"
                    },
                    "body":{
                      "type":"tpl",
                      "className": "text-xs",
                      "tpl":"出发地：${(extJson.from}<br/>目的地：${extJson.region}<br/>行程天数:${extJson.days}<br/>${description}",
                    },
                    // "secondary": "${extJson.from?'出发地:'+extJson.from:'' + extJson.region?' 目的地:'+extJson.region:'' + extJson.days?' 行程天数:'+extJson.days:''}",
                    "actions": [
                      { 
                        "type": "button",
                        "label": "查看方案", //跳转到MP预览内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect prompts page",context, props.data);
                                  sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.id)
                                },
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "文字链接", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect prompts page",context, props.data);
                                  sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.id)
                                },
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "二维码", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect prompts page",context, props.data);
                                  sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.id)
                                },
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "小程序卡片", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect prompts page",context, props.data);
                                  sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.id)
                                },
                              },
                            ]
                          }
                        }
                      },
                    ],
                    "toolbar": [
                      // {
                      //   "type": "tpl",
                      //   "tpl": "${extJson.from || extJson.region}",
                      //   "className": "label label-warning"
                      // },
                      {
                        "type": "mapping",
                        "label": "是否推荐方案",
                        "name": "highlight",
                        "map": {
                          "Y": {
                            "type": "tpl",
                            "tpl": "推荐方案",
                            "className": "label label-success"
                          },
                          "*":{
                            "type": "tpl",
                            "tpl": "${extJson.from || extJson.region || ''}",
                            "className": "label label-warning"
                          }
                        }
                      },
                      
                    ],
                  }
                },
              ]
            }
          ]
        }
      ],
      "wrapperBody": false,
      // "mode": "horizontal"
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

//按时间倒序显示自动应答记录
export const contentForm = {
  "type": "page",
  "name": "msgform",
  "title": "",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "className": "-m-4",
      "body": [
        {
          "type": "input-group",
          "label": "",
          "className": "w-full",
          "body": [
            {
              "type": "input-text",
              "className":"w-full",
              "placeholder": "关键字", 
              "name": "title"
            },
            {
              "type": "button",
              "label": "搜索",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                      "componentId": "contentservice", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                      "args": { // ignore : 在SPU表格中将自动获取搜索条件
                        "&": "$$"
                      }
                    }
                  ]
                }
              },
              "size": "md",
              "level": "primary"
            }
          ]
        },
        {
          "type": "service",
          "id":"contentservice",
          "className":"mb-20",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+"/erp/diyGenContent/list", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "adaptor": function (payload, response) {
              return {
                total: payload.result && payload.result.total ? payload.result.total : 0,
                msg: payload.success ? "success" : "failure",
                data: payload.result,
                status: payload.success ? 0 : 1
              };
            },
            ...BIZ_CONFIG,
            "data":{
              pageNo: 1,
              pageSize: 20,
              title: "*${title}*",
              //"&": "$$", //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
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
                  "type": "each",
                  "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                  "className": "w-full", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                  "items": {
                    "type": "card",
                    "className": "w-full",
                    "header": {
                      "title": "${title}",
                    },
                    "body":{
                      "type":"tpl",
                      "className": "text-xs ",
                      "tpl":"<br/>类型：${itemType_dictText} <br/>来源：${itemName} <br/>模板：${templateId_dictText}<br/>生成时间：${createTime}<br/>${summary}",
                    },
                    //"secondary": "${knowledgeCategoryId_dictText}",
                    "actions": [
                      { 
                        "type": "button",
                        "label": "内容预览", //跳转到MP预览内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(context,doAction,event){ 
                                  console.log("try jump content", context, event.data);
                                  openConentLink( event.data );
                                }
                              },
                              {
                                "actionType": "url",
                                "args": {
                                  "url": MP_API+"/archives/${mediaId}",
                                  "blank": true,
                                  // "params": {
                                  //   "name": "jack",
                                  //   "jon": "${myjon}"
                                  // },
                                  // "name": "${myname}",
                                  // "age": 18
                                }
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "发布/替换正文", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(context,doAction,event){
                                  console.log("try publish content", context, event.data);
                                  sendGenContent( event.data );
                                  // 直接设置数据
                                  // event.setData(hot.sopEvent);
                                  //打开抽屉
                                  // doAction({ //注意：参数通过hot传递，即当前currentSalePackage
                                  //   "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                                  //   "drawer": {
                                  //     "position": "right",
                                  //     "size": "md",
                                  //     "closeOnOutside":true,
                                  //     "title": "基础订阅计划",
                                  //     "data": {"salePackage": hot.currentSalePackage},
                                  //     "actions": [],
                                  //     "body": drawerSalePackages
                                  //   }
                                  // });
                                }
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "复制到剪贴板",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(context,doAction,event){
                                  console.log("try publish content", context, event.data);
                                  copyGenContent( event.data );
                                  //copyToClipboard("text/html", e.props.data.title + e.props.data.solutionNoteId_dictText);
                                  // 直接设置数据
                                  // event.setData(hot.sopEvent);
                                  //打开抽屉
                                  // doAction({ //注意：参数通过hot传递，即当前currentSalePackage
                                  //   "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                                  //   "drawer": {
                                  //     "position": "right",
                                  //     "size": "md",
                                  //     "closeOnOutside":true,
                                  //     "title": "基础订阅计划",
                                  //     "data": {"salePackage": hot.currentSalePackage},
                                  //     "actions": [],
                                  //     "body": drawerSalePackages
                                  //   }
                                  // });
                                }
                              },
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "内容已复制到剪贴板，可直接粘贴"
                                }
                              },
                            ]
                          }
                        }
                      },
                    ],
                    "toolbar": [
                      // {
                      //   "type": "tpl",
                      //   "tpl": "${contentType_dictText}",
                      //   "className": "label label-warning"
                      // },
                      {
                        "type": "tpl",
                        "tpl": "${itemType_dictText}",
                        "className": "label label-success"
                      }
                    ],
                  }
                },
              ],
            }
          ]
        }
      ],
      "wrapperBody": false,
      // "mode": "horizontal"
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

//显示sop列表，提供自动回复设置
export const skuForm = {
  "type": "page",
  "title": "SKU",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "className": "-m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        // "itemType":"",
        // "keyword":"",
      },
      "body": [
        {
          "type": "input-group",
          "label": "",
          // "className": "w-full",
          "body": [
            // {
            //   "type": "select",
            //   "label": "",
            //   "placeholder": "库存类型",
            //   "name": "stockType",
            //   "options": [
            //     {
            //       "label": "自有/签约",
            //       "value": "contract"
            //     },
            //     {
            //       "label": "外部库存",
            //       "value": "quote"
            //     }
            //   ]
            // },
            {
              "type": "select",
              "label": "",
              "name": "itemType",
              "multiple": false,
              "className": "is-pc",
              "source": {
                "method": "get",
                "url": BIZ_API+"/sys/dict/getDictItems/stock_type", 
                "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                "replaceData": true,
                "autoRefresh": true,
                "adaptor": function (payload, response) {
                  console.log("got dict items", payload);
                  let options = payload.result;
                  options.splice(0,0,{
                    value: "",
                    label: "不限",
                  });
                  return {
                    total: payload.result && payload.result.total ? payload.result.total : 0,
                    msg: payload.success ? "success" : "failure",
                    data: options, //payload.result,
                    status: payload.success ? 0 : 1
                  };
                },
                ...BIZ_CONFIG,
                "data":{
                  //"&": "$$", //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
                }
              },
            },
            {
              "type": "input-text",
              // "className":"w-full",
              "placeholder": "关键字", 
              "name": "keyword"
            },
            {
              "type": "button",
              "label": "搜索",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "reload", // 重新加载SKU表格，根据新的搜索条件
                      "componentId": "servicesku", // 触发sku数据加载：注意需要触发service，table仅负责显示数据
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
          ]
        },
        {
          "type": "service",
          "id":"servicesku",
          "initFetch": true,
          "className":"mb-20",
          "api": {
            "method": "post",
            "url": SEARCH_API+"/sku/_search", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
              let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
              let targetData = {
                from: orgData.from,
                size: orgData.size,
                query: orgData.query,
                sort: orgData.sort
              };

              //根据搜索表单的值设置搜索条件
              if(orgData.itemType && orgData.itemType.trim().length>0){
                targetData.query.bool.must.push({
                  "nested": {
                      "path": "type",
                      "query": {
                          "term" : { "type.item": orgData.itemType } // 指定类型搜索
                      }
                  }
                });
              }

              //根据搜索表单的值设置搜索条件
              if(orgData.keyword && orgData.keyword.trim().length>0){
                targetData.query.bool.should.push({ "match": { "full_text": orgData.keyword } });
              }

              return {
                ...api,
                data: targetData //使用组装后的查询条件
              };
            },
            "adaptor": function (payload, response) {
              let records = new Array();
              payload.hits.hits.forEach( item => {
                records.push(item._source);
              });
              return {
                total: payload.hits && payload.hits.total ? payload.hits.total : 0,
                msg: payload.hits && payload.hits.total >0 ? "success" : "failure",
                data: {
                  records: records
                },
                status: payload.hits ? 0 : 1
              };
            },
            ...SEARCH_CONFIG,
            "data":{
              "from":0,
              "size":30,
              "query": {
                "bool" : {
                  "must" : [
                      {
                        "nested": {
                            "path": "tenant",
                            "query": {
                                "term" : { "tenant.id": getTenantId()?getTenantId():0 } // 仅查询私库内容
                            }
                        }
                      },
                      // {
                      //   "nested": {
                      //       "path": "type",
                      //       "query": {
                      //           "term" : { "type.item": "${itemType}" } // 根据类型查询
                      //       }
                      //   }
                      // }
                  ],
                  "should": []
                }
              },
              "sort": [
                  { "_score":   { "order": "desc" }}
              ],
              "&": "$$" //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
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
                  "type": "each",
                  "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                  // "className": "w-full", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                  "items": {
                    "type": "card",
                    "className": "w-full",
                    "header": {
                      "title": "${name}",
                    },
                    "media": {
                      "type": "image",
                      "className": "w-full h-24",
                      "url": "${logo}",
                      "position": "top"
                    },
                    "body":{
                      "type":"tpl",
                      "className": "text-xs",
                      "tpl":"所属资源：${spu.name}<br/>来源平台：${distributor.name}<br/>供应商：${seller.name} <br/>${summary}",
                    },
                    // "secondary": "${extJson.from?'出发地:'+extJson.from:'' + extJson.region?' 目的地:'+extJson.region:'' + extJson.days?' 行程天数:'+extJson.days:''}",
                    "actions": [
                      { 
                        "type": "button",
                        "label": "查看详情", //跳转到MP预览内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect",context, props.data);
                                  //如果是外部商品则直接跳转
                                  if( props.data.url ){
                                    sendRedirect(props.data.url)
                                  }else{ //否则进入SaaS端产品列表
                                    sendRedirect(WEB_API + "/c2b/travel/my-sku?id="+props.data.id)
                                  }
                                },
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "文字链接", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect prompts page",context, props.data);
                                  sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.id)
                                },
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "二维码", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect prompts page",context, props.data);
                                  sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.id)
                                },
                              },
                            ]
                          }
                        }
                      },
                      { 
                        "type": "button",
                        "label": "小程序卡片", //发送POSTMessage消息，由页面脚本直接处理，是替换原有内容
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                                  console.log("try redirect prompts page",context, props.data);
                                  sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.id)
                                },
                              },
                            ]
                          }
                        }
                      },
                    ],
                    "toolbar": [
                      {
                        "type": "mapping",
                        "label": "库存类型",
                        "name": "type.stock",
                        "map": {
                          "contract": {
                            "type": "tpl",
                            "tpl": "自有/签约",
                            "className": "label label-success"
                          },
                          "quote":{
                            "type": "tpl",
                            "tpl": "外采/询价",
                            "className": "label label-warning"
                          },
                          "*":{
                            "type": "tpl",
                            "tpl": "${type.stock}",
                            "className": "label label-danger"
                          }
                        }
                      },
                      {
                        "type": "mapping",
                        "label": "SKU类型",
                        "name": "type.item",
                        "map": {
                          "hotel": {
                            "type": "tpl",
                            "tpl": "酒店",
                            "className": "label label-danger"
                          },
                          "scene":{
                            "type": "tpl",
                            "tpl": "景点门票",
                            "className": "label label-danger"
                          },
                          "visa":{
                            "type": "tpl",
                            "tpl": "签证",
                            "className": "label label-danger"
                          },
                          "guide":{
                            "type": "tpl",
                            "tpl": "导游",
                            "className": "label label-danger"
                          },
                          "car":{
                            "type": "tpl",
                            "tpl": "租车/包车",
                            "className": "label label-danger"
                          },
                          "vehicle":{
                            "type": "tpl",
                            "tpl": "交通接驳",
                            "className": "label label-danger"
                          },
                          "restaurant":{
                            "type": "tpl",
                            "tpl": "餐饮美食",
                            "className": "label label-danger"
                          },
                          "show":{
                            "type": "tpl",
                            "tpl": "演出赛事",
                            "className": "label label-danger"
                          },
                          "leisure":{
                            "type": "tpl",
                            "tpl": "城市休闲",
                            "className": "label label-danger"
                          },
                          "tour":{
                            "type": "tpl",
                            "tpl": "观光日游",
                            "className": "label label-danger"
                          },
                          "goods":{
                            "type": "tpl",
                            "tpl": "旅游商品",
                            "className": "label label-danger"
                          },
                          "service":{
                            "type": "tpl",
                            "tpl": "旅行服务",
                            "className": "label label-danger"
                          },
                          "*":{
                            "type": "tpl",
                            "tpl": "${type.item}",
                            "className": "label label-danger"
                          }
                        }
                      },
                      
                    ],
                  }
                },
                
              ]
            }
          ]
        }
      ],
      "id": "formsku",
      "wrapperBody": false,
      // "mode": "horizontal"
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

//知识查询表单：带有搜索框，默认显示全部，搜索查询全部
//按条显示，点击添加后直接加入
export const kbForm = {
  "type": "page",
  "name": "kbform",
  "title": "",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "className": "-m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        "knowledgeCategoryId":"",
        "title":""
      },
      "body": [
        // {
        //   "type": "flex",
        //   "className": "w-full",
        //   "items": [
        //     // {
        //     //   "type": "container",
        //     //   "body": [
        //     //     {
        //     //       "type": "select",
        //     //       "label":"",
        //     //       "placeholder": "选择分类",
        //     //       "className":"w-full",
        //     //       "name": "knowledgeCategoryId",
        //     //       "source":{
        //     //         "method": "get",
        //     //         "url": BIZ_API+"/erp/knowledgeCategory/rootList", 
        //     //         "adaptor": function (payload, response) {
        //     //           //组织下拉选项options
        //     //           var options = [];
        //     //           payload.result.records.forEach( record => {
        //     //             options.push({
        //     //               label: record.name,
        //     //               value: record.id
        //     //             })
        //     //           });
        //     //           return {
        //     //             status: payload.success ? 0 : 1,
        //     //             msg: payload.success ? "success" : "failure",
        //     //             data: {
        //     //               options: options
        //     //             },
        //     //           };
        //     //         },
        //     //         ...BIZ_CONFIG,
        //     //         "data":{}
        //     //       },

        //     //       "multiple": false
        //     //     }
        //     //   ],
        //     //   "size": "xs",
        //     // },
        //     {
        //       "type": "container",
        //       "body": [
        //         {
        //           "type": "input-text",
        //           "className":"w-full",
        //           "placeholder": "关键字",
        //           "name": "title"
        //         }
        //       ],
        //       "size": "md",
        //       "style": {
        //         "position": "static",
        //         "display": "block",
        //         "flex": "1 1 auto",
        //         "flexGrow": 1,
        //         "flexBasis": "auto"
        //       },
        //       "wrapperBody": false,
        //       "isFixedHeight": false,
        //       "isFixedWidth": false
        //     },
        //     {
        //       "type": "container",
        //       "body": [
        //         {
        //           "type": "button",
        //           "label": "搜索",
        //           "onEvent": {
        //             "click": {
        //               "actions": [
        //                 {
        //                   "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
        //                   "componentId": "servicekb", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
        //                   "args": { // ignore : 在SPU表格中将自动获取搜索条件
        //                     "&": "$$"
        //                   }
        //                 }
        //               ]
        //             }
        //           },
        //           "size": "md",
        //           "level": "primary"
        //         }
        //       ],
        //       "size": "xs",
        //       "style": {
        //         "position": "static",
        //         "display": "block",
        //         "flex": "1 1 auto",
        //         "flexGrow": 1,
        //         "flexBasis": "auto"
        //       },
        //       "wrapperBody": false,
        //       "isFixedHeight": false,
        //       "isFixedWidth": false
        //     }
        //   ],
        //   "style": {
        //     "position": "static",
        //     "flexWrap": "nowrap"
        //   },
        //   "direction": "row",
        //   "justify": "space-evenly",
        //   "alignItems": "stretch",
        //   "id": "u:0fef52614e51",
        //   "isFixedHeight": false,
        //   "isFixedWidth": false
        // },
        {
          "type": "input-group",
          "label": "",
          "className": "w-full",
          "body": [
            {
              "type": "input-text",
              "className":"w-full",
              "placeholder": "关键字", 
              "name": "title"
            },
            {
              "type": "button",
              "label": "搜索",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                      "componentId": "servicekb", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                      "args": { // ignore : 在SPU表格中将自动获取搜索条件
                        "&": "$$"
                      }
                    }
                  ]
                }
              },
              "size": "md",
              "level": "primary"
            }
          ]
        },
        {
          "type": "service",
          "id":"servicekb",
          "className":"mb-20",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+"/erp/knowledge/list", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            // "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
            //   let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
            //   let targetData = {
            //     knowledgeCategoryId:null,
            //     title: null, //针对title发起查询
            //   };

            //   //根据搜索表单的值设置搜索条件
            //   if(orgData.category){
            //     targetData.knowledgeCategoryId = orgData.category;
            //   }
            //   if(orgData.title){
            //     targetData.title = orgData.title;
            //   }
            //   let payload = {
            //     ...api,
            //     data: targetData //使用组装后的查询条件
            //   };
            //   console.log("try kb search.", payload);
            //   return payload;
            // },
            "adaptor": function (payload, response) {
              console.log("got kb result.", payload);
              return {
                total: payload.result && payload.result.total ? payload.result.total : 0,
                msg: payload.success ? "success" : "failure",
                data: payload.result,
                status: payload.success ? 0 : 1
              };
            },
            ...BIZ_CONFIG,
            "data":{
              pageNo: 1,
              pageSize: 20,
              title: "*${title}*"
              // "&": "$$", //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
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
                  "type": "each",
                  "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                  "className": "w-full", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                  "items": {
                    "type": "card",
                    "className": "w-full",
                    "header": {
                      "title": "${title}",
                    },
                    "body":{
                      "type":"tpl",
                      "tpl":"${content|raw}",
                    },
                    //"secondary": "${knowledgeCategoryId_dictText}",
                    "actions": [
                      { // 替换正文
                        "type": "button",
                        "label": "发布/替换正文",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(context,doAction,event){
                                  console.log("try publish content", context, event.data);
                                  event.data.title = event.data.name; //设置标题
                                  replaceText( event.data );
                                }
                              },
                            ]
                          }
                        }
                      },
                      { // 插入/附加到正文
                        "type": "button",
                        "label": "添加到正文",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(context,doAction,event){
                                  console.log("try append content", context, event.data);
                                  appendText( event.data );
                                }
                              },
                            ]
                          }
                        }
                      },
                      { //TODO：需要增加ajax行为：点击后将选定内容添加到行程，并且提交后端，完成后添加到行程列表
                        "type": "button",
                        "label": "复制内容",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(e){
                                  console.log("try copy kb ....", e.props.data);
                                  //copyKbMsg(e.props.data)
                                  copyToClipboard("text/html", e.props.data.content);
                                }
                              },
                            ]
                          }
                        }
                      },
                    ],
                    "toolbar": [
                      {
                        "type": "tpl",
                        "tpl": "${knowledgeCategoryId_dictText}",
                        "className": "label label-warning"
                      }
                    ],
                  }
                },
              ],
            }
          ]
        }
      ],
      "wrapperBody": false,
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

//AI生成表单：选择AI并可输入prompts完成生成
export const aiForm = {
  "type": "page",
  "name": "ai",
  "id": "ai",
  "title": "",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "className": "-m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        "type":"chatgpt",
        // "prompt":"" //禁止设置页面data，避免按钮触发reload事件参数被覆盖
      },
      "body": [
        {
          "type": "input-group",
          "label": "",
          "body": [
            // {
            //   "type": "select",
            //   "label":"",
            //   "placeholder": "选择AI",
            //   // "className":"w-full",
            //   "name": "type",
            //   "source":{
            //     "method": "get",
            //     "url": BIZ_API+"/erp/stoService/list?type=ai-text", 
            //     "adaptor": function (payload, response) {
            //       //组织下拉选项options
            //       var options = [];
            //       payload.result.records.forEach( record => {
            //         options.push({
            //           label: record.name,
            //           value: record.code?record.code:record.id
            //         })
            //       });
            //       return {
            //         status: payload.success ? 0 : 1,
            //         msg: payload.success ? "success" : "failure",
            //         data: {
            //           options: options
            //         },
            //       };
            //     },
            //     ...BIZ_CONFIG,
            //     "data":{}
            //   },
            //   "multiple": false
            // },
            {
              "type": "input-text",
              "className":"w-full _sx_region",
              "placeholder": "输入提示开始生成", 
              "validations": {
                "notEmptyString": true
              },
              "validationErrors": {
                "notEmptyString": "请输入点什么才能生成哦~~"
              },
              "name": "query"
            },
            {
              "type": "dropdown-button",
              "label": "",
              // "hideCaret": true,
              "buttons": [
                {
                  "type": "button",
                  "label": "改写",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "reload", 
                          "componentId": "generateContent", 
                          "data": { 
                            "prompt": "改写",
                            "&":"$$"
                          }
                        }
                      ]
                    }
                  },
                },
                {
                  "type": "button",
                  "label": "缩写",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "reload", 
                          "componentId": "generateContent", 
                          "data": { 
                            "prompt": "缩写",
                            "&":"$$"
                          }
                        }
                      ]
                    }
                  },
                },
                {
                  "type": "button",
                  "label": "扩写",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "reload", 
                          "componentId": "generateContent", 
                          "data": { 
                            "prompt": "扩写",
                            "&":"$$"
                          }
                        }
                      ]
                    }
                  },
                },
                {
                  "type": "button",
                  "label": "续写",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "reload", 
                          "componentId": "generateContent", 
                          "data": { 
                            "prompt": "续写",
                            "&":"$$"
                          }
                        }
                      ]
                    }
                  },
                },
              ]
            },
            {
              "type": "button",
              "label": "生成",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "reload", 
                      "componentId": "generateContent", 
                      "data": { 
                        "prompt":"",
                        "&": "$$"
                      }
                    }
                  ]
                }
              },
              "size": "md",
              "level": "primary"
            }
          ]
        },
        {
          "type": "service",
          "id":"generateContent",
          "className":"mb-20",
          "initFetch": false,
          "api": { //直接请求生成
            "method": "post",
            // "url": BIZ_API+"/dify/completion-messages", 
            "url": BIZ_API+"/dify/chat-messages", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "requestAdaptor": function (api) { //组织prompts
              console.log("before try generate", api);
              let orgData = {...api.data}; //原有的数据
              //组织prompts
              let prompts = { //简单prompts组织
                    "inputs":{},
                    "user":"user"+ userStore.getUserInfo?.id,
                    "respond_mode":"streaming"
                  };
                  
              if(orgData.prompt && orgData.prompt.trim().length>0){
                prompts.query = (orgData.query?orgData.query+" ":"")+orgData.prompt+" "+orgData.content;
              }

              //根据操作类型设置内容替换类别：续写需要在当前内容上增加否则直接替换
              hot.currentContent = orgData.content || ""; //记录当前的内容
              if( orgData.prompt === "续写"){
                hot.replaceContent = false;
              }else{
                hot.replaceContent = true;
              }

              //提交生成参数
              let targetData = {
                ...orgData,
                ...prompts,
              };
        
              let payload = {
                ...api,
                data: targetData //使用组装后的查询条件
              };
              console.log("after try generate.", payload);
              return payload;
            },
            "adaptor": function (payload, response) {
              console.log("generate done.", payload);
              //TODO添加计费
              //savePosterGenerateRecord("note",hot.note, posterInfo, payload);
              //根据操作类型处理返回内容
              let answer = "<p>"+payload.answer.replace(/\n/g, "</p><p>")+"</p>";
              if(!hot.replaceContent){
                answer = hot.currentContent + answer;
              }
              return {
                msg: "",
                data: {
                  conversation_id: payload.conversation_id, //暂时保持，可以支持多轮生成
                  content: answer,
                  query: "",//生成后清空query
                }, 
                status: 0
              };
            },
            "data":{
              "&":"$$",
            },
            "headers": BIZ_CONFIG.headers,
          },
          "body": [
            {
              "type": "hidden",
              "label": "会话ID",
              "name": "conversation_id",
            },
            {
              "type": "input-rich-text",
              "label": "",
              "name": "content",
              "mode": "vertical",
              // "className": "border-none p-0",
              //"receiver": "/api/upload/image",
              "vendor": "tinymce",
              "options": {
                "menubar": "true",
                "height": 680,
                "plugins": [
                  "advlist",
                  "autolink",
                  "link",
                  "image",
                  "lists",
                  "charmap",
                  "preview",
                  "anchor",
                  "pagebreak",
                  "searchreplace",
                  "wordcount",
                  "visualblocks",
                  "visualchars",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "nonbreaking",
                  "table",
                  "emoticons",
                  "template",
                  "help"
                ],
                "toolbar": "undo redo | formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
              }
            },
            { //笔记内容操作按钮，包括缩写、扩写、续写、改写，以及添加到笔记
              "type": "wrapper",
              // "className": "border-none p-0",
              "body": [
                { // 替换正文
                  "type": "button",
                  "label": "发布/替换正文",
                  "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "custom",
                          "script": function(context,doAction,event){
                            console.log("try publish content", context, event.data);
                            replaceText( event.data );
                          }
                        },
                      ]
                    }
                  }
                },
                { // 插入/附加到正文
                  "type": "button",
                  "label": "添加到正文",
                  "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "custom",
                          "script": function(context,doAction,event){
                            console.log("try append content", context, event.data);
                            appendText( event.data );
                          }
                        },
                      ]
                    }
                  }
                },
                { // 复制到剪贴板
                  "type": "button",
                  "label": "复制到剪贴板",
                  "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "custom",
                          "script": function(e){
                            console.log("try insert ai ....", e.props.data);
                            //sendAiMsg(e.props.data)
                            copyToClipboard("text/html", e.props.data.content);
                          }
                        },
                        {
                          "actionType": "toast", // 执行toast提示动作
                          "args": { // 动作参数
                            "msgType": "success",
                            "msg": "内容已复制到剪贴板，可直接粘贴"
                          }
                        },
                      ]
                    }
                  }
                },

              ]
            },
          ]
        }
      ],
      "wrapperBody": false,
    }
  ]
}



