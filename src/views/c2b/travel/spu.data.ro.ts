import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';

import {SEARCH_API} from '/@/settings/iLifeSetting';
import {isDebug, mappingSpu, mappingSku, copySpu, copySku } from './spu.api';
import { getSkuName, getSpuName, getSpuInfo, getSkuInfo, getSpuSearchForm, getTableColumns } from './spu.info';
//import {getSpuInfo, tableColumns, searchFormSpu } from './spu.info.scene';
import { getTenantId } from '/@/utils/auth';

/**
 * 根据类型获取侧边栏表单，包含tab标签、sku列表，不提供保存功能
 * @param itemType 类型
 * @returns 
 */
export const getDrawer = ( itemType ) => {
  let drawer = {
    "type": "page",
    "title": "SPU抽屉",
    "data": "${rowItem}", //传递当前选中SPU
    "body":{
      "type": "form",
      "id": "spuform",
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
              "title": getSkuName(itemType),
              "body": [
                {
                  "type": "service",
                  "id": "servicesku",
                  "initFetch": true,
                  "api": {
                    "method": "post",
                    "url": SEARCH_API+"/sku/_search", 
                    "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                    "replaceData": true,
                    "autoRefresh": true,
                    "adaptor": function (payload, response, api) {
                      return {
                        total: payload.hits && payload.hits.total ? payload.hits.total : 0,
                        msg: payload.hits && payload.hits.total >0 ? "success" : "failure",
                        data: payload.hits && payload.hits.total >0 ? mappingSku(payload.hits.hits): [],
                        status: payload.hits ? 0 : 1
                      };
                    },
                    "headers": {
                      "Content-Type": "application/json",
                      "Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ=="
                    },
                    "data":JSON.stringify({
                      "from":0,
                      "size":10,
                      "query":{
                        "bool" : {
                            "must" : [
                                {"nested": 
                                    {
                                        "path": "tenant",
                                        "query": {
                                            "bool": {
                                            "must": [
                                                    { "term": { "tenant.id": 0 } } //public: 公库，private： 私库
                                                ]
                                            }
                                        }
                                    }
                                }, 
                                {"nested": 
                                    {
                                        "path": "code",
                                        "query": {
                                            "bool": {
                                            "must": [
                                                    { "term": { "code.spu": "${spu.code}" } } //根据SPU查询所有SKU
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                      },
                      "sort": [
                        { "_score":   { "order": "desc" }}
                      ]
                    })
                  },
                  "body": [
                    {
                      "type": "wrapper",
                      "className": "my-1",
                      "body": {
                        "label": "预订页面",
                        "type": "link",
                        "href": "${spu.url}",
                        "body":"${spu.name}",
                      }
                    },
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
                              "label": "复制到私有库",
                              "type": "button",
                              "onClick": (e, props) => {
                                console.log("复制SKU", props.data);
                                copySku(props.data.sku); //复制SKU
                              },
                              "onEvent": {
                                "click": { // 点击时直接提示已完成复制：TODO：调整为后端复制SPU、SKU则可直接通过ajax及message完成提示
                                  "actions": [ // 执行的动作列表
                                    {
                                      "actionType": "toast", // 执行toast提示动作
                                      "args": { // 动作参数
                                        "msgType": "success",
                                        "msg": "已复制到私有库"
                                      }
                                    }
                                  ]
                                }
                              }
                            }
                          ],
                          "columns": [
                            {
                              "name": "sku.name",
                              "label": "产品/套餐",
                              "type": "text",
                            },
                            {
                              "name": "sku.summary",
                              "label": "规格",
                              "type": "text",
                            },
                            {
                              "type": "text",
                              "label": "币种",
                              "name": "sku.price.currency",
                              "placeholder": "￥",
                            },
                            {
                              "type": "text",
                              "label": "供货价",
                              "name": "sku.price.sale",
                            },
                            {
                              "type": "text",
                              "label": "市场价",
                              "name": "sku.price.bid",
                            }
                          ],
                          "strictMode": false,
                          "canAccessSuperData": true,
                          "columnsTogglable":false,
                          "onEvent": {
                            "rowClick": {
                              "actions": [         
                                {
                                  "actionType": "toast", // TODO：替换为按钮操作
                                  "data": "${rowItem}",
                                  "value": "${rowItem}",
                                  "args": { // 
                                    "msgType": "info",
                                    "msg": "复制到私有库后可修改"
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
            },
            ...getSpuInfo(itemType) //装载spu详情
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
    "id": "u:971e12982973",
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

/**
 * 根据类型获取查询表单，包括表单及数据表格
 * @param itemType 类型
 */
export const getForm = ( itemType ) => {
  let form = {
    "type": "page",
    "id": "u:f71ee9197152",
    "title": "SPU",
    "body": [
      {
        "type": "form",
        "wrapWithPanel": false,
        "data": { //数据通过page在搜索表单及数据列表间传递
          "region":"",
          "name": "",
          "star":0,
          "keyword":""
        },
        "body": [
          getSpuSearchForm(itemType),
          {
            "type": "service",
            "id":"servicespu",
            "initFetch": true,
            "api": {
              "method": "post",
              "url": SEARCH_API+"/spu/_search", 
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
                if(orgData.region){
                  targetData.query.bool.must.push({ "match": { "region": orgData.region } });
                }
                if(orgData.name){
                  targetData.query.bool.must.push({ "match": { "name": orgData.name } });
                }
                if(orgData.keyword){
                  targetData.query.bool.should.push({ "match": { "full_text": orgData.keyword } });
                }
                if(orgData.star){
                  targetData.query.bool.must.push({ "range": {
                      "stars": {
                        "gte": orgData.star,
                        "boost": 2.0
                      }
                    }
                  });
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
                  data: payload.hits && payload.hits.total >0 ? mappingSpu(payload.hits.hits): [],
                  status: payload.hits ? 0 : 1
                };
              },
              "headers": {
                "Content-Type": "application/json",
                "Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ=="
              },
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
                                  "term" : { "tenant.id": 0 } //public: 公库，private： 私库
                              }
                          }
                        },
                        {
                          "nested": {
                              "path": "type",
                              "query": {
                                  "term" : { "type.item": itemType } //public: 公库，private： 私库
                              }
                          }
                        }
                    ],
                    "should":[],
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
                    "name": "tablespu",
                    "id": "tablespu",
                    "label": "",
                    "itemBadge": {
                      "text": "${badgeText}",
                      "mode": "ribbon",
                      "position": "top-left",
                      "level": "${badgeLevel}",
                      "visibleOn": "this.badgeText"
                    },
                    "rowClassNameExpr": "<%= spu.id % 2 ? 'bg-blue-300' : 'bg-blue-50' %>",
                    "itemActions": [
                      {
                        "label": "复制到私有库",
                        "type": "button",
                        "onClick": (e, props) => {
                          console.log("copy SPU", props.data.spu);
                          copySpu(props.data.spu); //复制SPU
                        },
                        "onEvent": {
                          "click": { // 点击时直接提示已完成复制：TODO：调整为后端复制SPU、SKU则可直接通过ajax及message完成提示
                            "actions": [ // 执行的动作列表
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "已复制到私有库"
                                }
                              }
                            ]
                          }
                        }
                      },
                      {
                        "label": "查看详情",
                        "type": "button",
                        "onEvent": {
                          "click": { //
                            "actions": [ // 执行的动作列表
                              {
                                "actionType": "drawer", // 显示SPU详情及SKU列表，默认传递当前选中的行数据 rowItem
                                "drawer": {
                                  "id":"drawerSpu",
                                  "position": "right",
                                  "size": "lg",
                                  "closeOnOutside":true,
                                  "title": getSpuName(itemType),
                                  "actions":[],
                                  "body": getDrawer(itemType)
                                }
                              },
                              {
                                "actionType": "setValue", // 将 rowItem 手动设置到表单域
                                "componentId": "spuform",
                                "data": "${rowItem.spu}",
                                "value": "${rowItem.spu}",
                                "args": { // ignore : 在SPU表格中将自动获取搜索条件
                                  "msgType": "info",
                                  "msg": "设置SPU数据 ${event.data|json} ${__rendererData|json}"
                                }
                              }
                            ]
                          }
                        }
                      }
                    ],
                    "columns": getTableColumns(itemType), //表头定义
                    "strictMode": false,
                    "canAccessSuperData": true,
                    "columnsTogglable":false,
                    "onEvent": {
                      "rowClick": {
                        "actions": [         
                          {
                            "actionType": "drawer", // 显示SPU详情及SKU列表，默认传递当前选中的行数据 rowItem
                            "drawer": {
                              "id":"drawerSpu",
                              "position": "right",
                              "size": "lg",
                              "closeOnOutside":true,
                              "title": getSpuName(itemType),
                              "actions":[],
                              "body": getDrawer(itemType)
                            }
                          },
                          {
                            "actionType": "setValue", // 将 rowItem 手动设置到表单域
                            "componentId": "spuform",
                            "data": "${rowItem.spu}",
                            "value": "${rowItem.spu}",
                            "args": { // ignore : 在SPU表格中将自动获取搜索条件
                              "msgType": "info",
                              "msg": "设置SPU数据 ${event.data|json} ${__rendererData|json}"
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
        "id": "formspu",
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
  return form;
}


