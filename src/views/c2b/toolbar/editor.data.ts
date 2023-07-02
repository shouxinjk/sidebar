import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import {Md5} from 'ts-md5';

import {SEARCH_API, SEARCH_CONFIG, BIZ_API, BIZ_CONFIG, WEB_API } from '/@/settings/iLifeSetting';
import { getTenantId } from '/@/utils/auth';

import {  isDebug,bizAPI, sendAiMsg, sendKbMsg, copyToClipboard, sendRedirect, hookSop, hookAutoReply } from './editor.api';
import { DollarCircleTwoTone } from '@ant-design/icons-vue';

import {ToastComponent, AlertComponent, alert, confirm, toast,Drawer} from 'amis-ui';
import { DrawerAction } from 'amis-core/lib/actions/DrawerAction';

import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();

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
      "className": "-m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        "name":null
      },
      "body": [
        {
          "type": "flex",
          "className": "p-1",
          "items": [
            {
              "type": "container",
              "label":"",
              "body": [
                {
                  "type": "input-text",
                  "className":"w-full",
                  "placeholder": "关键字",
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
          "id": "u:0fef52614e51",
          "isFixedHeight": false,
          "isFixedWidth": false
        },{
          "type": "service",
          "id":"solutionservice",
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
                  records.push(record);
                }catch(err){}
              });
              return {
                total: payload.result && payload.result.total ? payload.result.total : 0,
                msg: payload.success ? "success" : "failure",
                data: records, //payload.result.record,
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
                  "type": "table",
                  "name": "tablesolution",
                  "id": "tablesolution",
                  "label": "",
                  "columns": [
                    {
                      "name": "name",
                      "label": "名称",
                      "type": "text",
                    },
                    {
                      "name": "extJson.from",
                      "label": "出发地",
                      "type": "text",
                    },
                    {
                      "name": "extJson.region",
                      "label": "目的地",
                      "type": "text",
                    },
                    {
                      "name": "extJson.persons",
                      "label": "人数",
                      "type": "text",
                    },
                    {
                      "name": "extJson.startDate",
                      "label": "出发日期",
                      "type": "text",
                    },
                  ],
                  "strictMode": false,
                  "canAccessSuperData": true,
                  "columnsTogglable":false,
                  "onEvent": {
                    "rowClick": {
                      "actions": [         
                        {
                          "actionType": "custom",
                          "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                            console.log("try redirect prompts page",context, props.data);
                            sendRedirect(WEB_API + "/c2b/travel/solution?id="+props.data.rowItem.id)
                          },
                        }
                      ]
                    }
                  }
                },
              ]
            }
          ]
        }
      ],
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
          "type": "service",
          "id":"servicemsg",
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
                      "tpl":"${solutionNoteId_dictText|raw}",
                    },
                    //"secondary": "${knowledgeCategoryId_dictText}",
                    "actions": [
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
                                  //TODO: 需要获取对应内容
                                  copyToClipboard("text/html", e.props.data.title + e.props.data.solutionNoteId_dictText);
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
                        "tpl": "${stockType_dictText}",
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

//显示sop列表，提供自动回复设置
export const skuForm = {
  "type": "page",
  "title": "SKU",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "data": { //数据通过page在搜索表单及数据列表间传递
        "itemType":"",
        "keyword":"",
      },
      "body": [
        {
          "type": "flex",
          "className": "p-1",
          "items": [
            {
              "type": "container",
              "body": [
                {
                  "type": "select",
                  "label": "",
                  "placeholder": "库存类型",
                  "name": "stockType",
                  "options": [
                    {
                      "label": "自有/签约",
                      "value": "contract"
                    },
                    {
                      "label": "外部库存",
                      "value": "quote"
                    }
                  ]
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
                  "type": "input-text",
                  "label": "",
                  "placeholder": "关键字",
                  "name": "keyword",
                  "id": "u:a1f668543851"
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
              "isFixedWidth": false,
              "id": "u:5cbf5be5c593"
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
              "isFixedWidth": false,
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
        },{
          "type": "service",
          "id":"servicesku",
          "initFetch": true,
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
              if(orgData.spu && orgData.spu.id){
                targetData.query.bool.must.push({
                  "nested": {
                      "path": "spu",
                      "query": {
                          "term" : { "spu.id": orgData.spu.id } // 接收spu.id参数，查询指定spu下的sku列表
                      }
                  }
                });
              }
              if(orgData.region){
                targetData.query.bool.must.push({ "match": { "region": orgData.region } });
              }

              return {
                ...api,
                data: targetData //使用组装后的查询条件
              };
            },
            "adaptor": function (payload, response) {
              return {
                total: payload.hits && payload.hits.total ? payload.hits.total : 0,
                msg: payload.hits && payload.hits.total >0 ? "success" : "failure",
                data: payload.hits.hits,
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
                      /**
                      {
                        "nested": {
                            "path": "type",
                            "query": {
                                "term" : { "type.item": itemType } // 根据类型查询
                            }
                        }
                      }
                      //** */
                  ]
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
                  "type": "table",
                  "name": "tablesku",
                  "id": "tablesku",
                  "label": "",
                  "itemBadge": {
                    "text": "${badgeText}",
                    "mode": "ribbon",
                    "position": "top-left",
                    "level": "${badgeLevel}",
                    "visibleOn": "this.badgeText"
                  },
                  "rowClassNameExpr": "<%= sku.id % 2 ? 'bg-blue-300' : 'bg-blue-50' %>",
                  "itemActions": [
                    {
                      "label": "查看详情",
                      "type": "button",
                      "onEvent": {
                        "click": { //
                          "actions": [ // 执行的动作列表
                            {
                              "actionType": "setValue", // 将 rowItem 手动设置到表单域
                              "componentId": "skuform",
                              "data": "${rowItem.sku}",
                              "value": "${rowItem.sku}",
                              "args": { // ignore : 在SPU表格中将自动获取搜索条件
                                "msgType": "info",
                                "msg": "设置SKU数据 ${event.data|json} ${__rendererData|json}"
                              }
                            }
                          ]
                        }
                      }
                    }
                  ],
                  "columns": [
                    {
                      "label": "资源名称",
                      "name": "_source.spu.name",
                      "quickEdit": false,
                      "type": "text"
                    },
                    {
                      "label": "产品/套餐",
                      "name": "_source.name",
                      "quickEdit": false,
                      "type": "text"
                    },
                  ],
                  "strictMode": false,
                  "canAccessSuperData": true,
                  "columnsTogglable":false,
                  "onEvent": {
                    "rowClick": {
                      "actions": [         
                        {
                          "actionType": "setValue", // 将 rowItem 手动设置到表单域
                          "componentId": "skuform",
                          "data": "${rowItem.sku}",
                          "value": "${rowItem.sku}",
                          "args": { // ignore : 在SKU表格中将自动获取搜索条件
                            "msgType": "info",
                            "msg": "设置SKU数据 ${event.data|json} ${__rendererData|json}"
                          }
                        }
                      ]
                    }
                  }
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
      //"className": "-m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        "knowledgeCategoryId":"",
        "title":""
      },
      "body": [
        {
          "type": "flex",
          //"className": "p-1",
          "items": [
            {
              "type": "container",
              "body": [
                {
                  "type": "select",
                  "label":"",
                  "placeholder": "选择分类",
                  "className":"w-full",
                  "name": "knowledgeCategoryId",
                  "source":{
                    "method": "get",
                    "url": BIZ_API+"/erp/knowledgeCategory/rootList", 
                    "adaptor": function (payload, response) {
                      //组织下拉选项options
                      var options = [];
                      payload.result.records.forEach( record => {
                        options.push({
                          label: record.name,
                          value: record.id
                        })
                      });
                      return {
                        status: payload.success ? 0 : 1,
                        msg: payload.success ? "success" : "failure",
                        data: {
                          options: options
                        },
                      };
                    },
                    ...BIZ_CONFIG,
                    "data":{}
                  },

                  "multiple": false
                }
              ],
              "size": "xs",
            },
            {
              "type": "container",
              "body": [
                {
                  "type": "input-text",
                  "className":"w-full",
                  "placeholder": "关键字",
                  "name": "title"
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
          "id": "u:0fef52614e51",
          "isFixedHeight": false,
          "isFixedWidth": false
        },{
          "type": "service",
          "id":"servicekb",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+"/erp/knowledge/list", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
              let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
              let targetData = {
                knowledgeCategoryId:null,
                title: null, //针对title发起查询
              };

              //根据搜索表单的值设置搜索条件
              if(orgData.category){
                targetData.knowledgeCategoryId = orgData.category;
              }
              if(orgData.keyword){
                targetData.title = orgData.keyword;
              }
              let payload = {
                ...api,
                data: targetData //使用组装后的查询条件
              };
              console.log("try kb search.", payload);
              return payload;
            },
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
              "&": "$$", //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
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
        "prompt":""
      },
      "body": [
        {
          "type": "flex",
          "items": [
            {
              "type": "container",
              "body": [
                {
                  "type": "select",
                  "label":"",
                  "placeholder": "选择AI",
                  "className":"w-full",
                  "name": "type",
                  "source":{
                    "method": "get",
                    "url": BIZ_API+"/erp/stoService/list?type=ai-text", 
                    "adaptor": function (payload, response) {
                      //组织下拉选项options
                      var options = [];
                      payload.result.records.forEach( record => {
                        options.push({
                          label: record.name,
                          value: record.code?record.code:record.id
                        })
                      });
                      return {
                        status: payload.success ? 0 : 1,
                        msg: payload.success ? "success" : "failure",
                        data: {
                          options: options
                        },
                      };
                    },
                    ...BIZ_CONFIG,
                    "data":{}
                  },
                  "multiple": false
                }
              ],
              "size": "xs",
            },
            {
              "type": "container",
              "body": [
                {
                  "type": "input-text",
                  "className":"w-full",
                  "placeholder": "提示词", 
                  "name": "prompt"
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
                  "label": "生成",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                          "componentId": "generateContent", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                          "args": { // ignore : 在SPU表格中将自动获取搜索条件
                            "&": "$$"
                          }
                        }
                      ]
                    }
                  },
                  "size": "xs",
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
            },
          ],
          "style": {
            "position": "static",
            "flexWrap": "nowrap"
          },
          "direction": "row",
          "justify": "space-evenly",
          "alignItems": "stretch",
          "id": "u:0fef52614e51",
          "isFixedHeight": false,
          "isFixedWidth": false
        },
        {
          "type": "service",
          "id":"generateContent",
          "initFetch": true,
          "api": {
            "method": "post",
            "url": SEARCH_API+"/spu/_search", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "requestAdaptor": function (api) { //TODO：根据选择的AI生成器分别组织内容生成
              let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
              let targetData = {
                from: orgData.from,
                size: orgData.size,
                query: orgData.query,
                sort: orgData.sort
              };

              //根据搜索表单的值设置搜索条件
              if(orgData.region){
                targetData.query.bool.must.push({ "match": { "region": orgData.region } });
              }
              if(orgData.keyword){
                targetData.query.bool.must.push({ "match": { "keyword": orgData.keyword } });
              }
              return {
                ...api,
                data: targetData //使用组装后的查询条件
              };
            },
            "adaptor": function (payload, response) {
              return {
                total: payload.hits && payload.hits.total ? payload.hits.total : 0,
                msg: payload.hits && payload.hits.total >0 ? "success" : "failure",
                data: {
                  //records: payload.hits && payload.hits.total >0 ? mappingSpu(payload.hits.hits): []
                },
                status: payload.hits ? 0 : 1
              };
            },
            SEARCH_CONFIG,
            "data":{
              "from":0,
              "size":30,
              "query": {
                "bool" : {
                  "must" : [
                    /**
                      {
                        "nested": {
                            "path": "tenant",
                            "query": {
                                "term" : { "tenant.id": 0 } //public: 公库，private： 私库
                            }
                        }
                      },
                    //** */
                  ]
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
              "type": "textarea",
              "label": "",
              "placeholder": "生成内容",
              "name": "content",
              "className": "w-full",
            },
            {
              "type": "button",
              "label": "获取提示词帮助，以生成更好的内容",
              "className":"border-none text-info",
              "onClick": function(e,props){
                console.log("try redirect prompts page", e, props);
                sendRedirect("https://www.awesomegptprompts.com/")
              }
            },
            {
              "type": "container",
              "body": [
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
                            console.log("try insert ai ....", e.props.data);
                            //sendAiMsg(e.props.data)
                            copyToClipboard("text/html", e.props.data.content);
                          }
                        },
                      ]
                    }
                  }
                },
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
          ]
        }
      ],
      "wrapperBody": false,
    }
  ]
}



