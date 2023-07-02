import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';

import {SEARCH_API} from '/@/settings/iLifeSetting';
import {isDebug, mappingSpu, mappingSku, copySpu, copySku } from './spu.api';
import {getSpuInfo, getSkuName } from './spu.info';

import { getTenantId } from '/@/utils/auth';

import { addSpu,getSpu,addSku, hot } from './solution.api';
import { DollarCircleTwoTone } from '@ant-design/icons-vue';

import {ToastComponent, AlertComponent, alert, confirm, toast,Drawer} from 'amis-ui';
import { DrawerAction } from 'amis-core/lib/actions/DrawerAction';

//侧边栏表单
export const getDrawer = (itemType) => {
  let drawer = {
    "type": "page",
    "name": "drawerScene",
    "id": "solutionItemSpuDrawer",
    "title": "SPU-抽屉",
    "data": "${rowItem}", //传递当前选中SPU
    "body":{
      "type": "form",
      "name": "spuform",
      "wrapWithPanel": false,
      "debug": isDebug,
      "debugConfig": {
        "enableClipboard": true,
        "displayDataTypes": true
      },
      "body": [
        {
          "type": "tabs",
          //"tabsMode": "tiled",
          //"collapseOnExceed": 5,//超过5个折叠
          "tabs": [
            {
              "title": getSkuName(itemType),
              "body": [
                {
                  "type": "service",
                  "id": "servicesku",
                  "debug": isDebug,
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
                          "debug": isDebug,
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
                              "label": "加入行程",
                              "type": "button",
                              "onClick": (e, props) => {
                                console.log("添加SKU", props.data);
                                addSku(props.data.sku); //复制SKU
                              },
                              "onEvent": {
                                "click": { // 点击时直接提示已完成复制：TODO：调整为后端复制SPU、SKU则可直接通过ajax及message完成提示
                                  "actions": [ // 执行的动作列表
                                    {
                                      "actionType": "toast", // 执行toast提示动作
                                      "args": { // 动作参数
                                        "msgType": "success",
                                        "msg": "已添加到行程"
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
                              "id": "u:97f2f289d9c4"
                            },
                            {
                              "name": "sku.summary",
                              "label": "规格",
                              "type": "text",
                              "id": "u:ccd4b0205599"
                            },
                            {
                              "type": "text",
                              "label": "币种",
                              "name": "sku.price.currency",
                              "placeholder": "￥",
                              "id": "u:cb19e7bb5a80"
                            },
                            {
                              "type": "text",
                              "label": "供货价",
                              "name": "sku.price.sale",
                              "id": "u:cb19e7bb5a80"
                            },
                            {
                              "type": "text",
                              "label": "市场价",
                              "name": "sku.price.bid",
                              "id": "u:ef11c80097b9"
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
            ...getSpuInfo(itemType)
          ]
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


//查询表单
export const getForm = ( itemType ) => {
  let form = {
    "type": "page",
    "name": "formspu",
    "id": "formspu",
    "title": "SPU",
    "body": [
      {
        "type": "form",
        "wrapWithPanel": false,
        "className": "-m-4",
        "data": { //数据通过page在搜索表单及数据列表间传递
          "region":"",
          "name": "",
          "star":0,
          "keyword":""
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
                    "type": "input-text",
                    "className":"w-full _sx_region",
                    "placeholder": "目的地",
                    "name": "region"
                  }
                ],
                "size": "xs"
              },
              {
                "type": "container",
                "body": [
                  {
                    "type": "input-text",
                    "className":"w-full",
                    "placeholder": "关键字",
                    "name": "keyword"
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
                            "componentId": "servicespu", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
                  targetData.query.bool.must.push({ "match": { "keyword": orgData.keyword } });
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
                  data: {
                    records: payload.hits && payload.hits.total >0 ? mappingSpu(payload.hits.hits): []
                  },
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
                                  "term" : { "type.item": itemType } //限定类型
                              }
                          }
                        }
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
                    "type": "flex",
                    "className": "flex-wrap space-x-2",
                    "items": [
                      {
                        "type": "each",
                        "name": "records", //指定从数据域中获取用于循环的变量，即： data.records
                        "className": "flex flex-row flex-wrap space-x-2", //IMPORTANT：由于生成后多出div，手动将该div设置为flex显示
                        "items": {
                          "type": "card",
                          "className": "w-48",
                          "header": {
                            "title": "${spu.name}"
                          },
                          "media": {
                            "type": "image",
                            "className": "w-48 h-36",
                            "url": "${spu.logo?spu.logo:'https://www.biglistoflittlethings.com/static/logo/distributor/ilife.png'}",
                            "position": "top"
                          },
                          "body": [
                            {
                              "type": "tpl",
                              "tpl": "${spu.summary}",
                              "inline": false,
                              "id": "u:17b9f8e7208d"
                            }
                          ],
                          //"secondary": "${id}",
                          "actions": [
                            {
                              "type": "button",
                              "label": "查看详情",
                              "className": "px-2 mx-4 border border-solid",
                              "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                              "drawer": {
                                "id":"drawerApp",
                                "position": "right",
                                "size": "lg",
                                "closeOnOutside":true,
                                "title": "产品详情",
                                "actions": [],
                                "body": getDrawer(itemType)
                              }
                            },/**
                            {
                              "type": "button",
                              "label": "加入行程",
                              "className": "px-2 mx-4 border border-solid",
                              "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                              "drawer": {
                                "id":"drawerApp",
                                "position": "right",
                                "size": "lg",
                                "closeOnOutside":true,
                                "title": "景点详情",
                                "actions": [],
                                "body": drawerScene
                              }
                            },//** */
                            { //TODO：需要增加ajax行为：点击后将选定内容添加到行程，并且提交后端，完成后添加到行程列表
                              "type": "button",
                              "label": "加入行程",
                              "className": "px-2 mx-4 border border-solid",
                              "onEvent": {
                                "click": {
                                  "actions": [
                                    {
                                      "actionType": "custom",
                                      "script": function(e){
                                        console.log("try insert spu ....", e.props.data);
                                        addSpu(e.props.data.spu);
                                      }
                                    }
                                  ]
                                }
                              }
                            },/**
                            { 
                              "actionType": "setValue", // 将 rowItem 手动设置到表单域
                              "componentId": "skuform",
                              "data": "${item}",
                              "value": "${item}",
                              "args": { // ignore : 在SPU表格中将自动获取搜索条件
                                "msgType": "info",
                                "msg": "设置SKU数据 ${event.data|json} ${__rendererData|json}"
                              }
                            }//** */
                          ],
  
                          //** */
                          "itemAction": {
                            "type": "button",
                            "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                            "drawer": {
                              "position": "right",
                              "size": "lg",
                              "closeOnOutside":true,
                              "title": "查看详情",
                              "actions": [],
                              "body": getDrawer(itemType)
                            }
                          },
                          "toolbar": [
                            {
                              "type": "mapping",
                              "name": "spu.type.item",
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
                      },
                      { //验证功能：通过button提供外部数据传递入口
                        "type": "button",
                        "label": "添加数据并打开抽屉",
                        "className": "px-2 mx-4 border border-solid __sx__btn text-transparent border-0",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "type": "button",
                                "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                                "drawer": {
                                  "position": "right",
                                  "size": "lg",
                                  "closeOnOutside":true,
                                  "title": "查看详情",
                                  // "data": {"spu": getSpu()},
                                  "actions": [],
                                  "body": getDrawer(itemType)
                                }
                              },
                            ]
                          }
                        }
                      },
                      { //验证功能：通过button提供外部数据传递入口
                        "type": "button",
                        "label": "添加数据并打开抽屉",
                        "className": "px-2 mx-4 border border-solid __sx__btn__setSpu text-transparent border-0",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "setValue",
                                "componentId": "solutionItemSpuDrawer",
                                "args": {
                                  "value": {"spu": getSpu()}
                                }
                              },
                            ]
                          }
                        }
                      },
                    ]
                  }
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
  return form;
}


