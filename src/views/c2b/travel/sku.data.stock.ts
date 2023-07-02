import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG} from '/@/settings/iLifeSetting';
import {isDebug, bizAPI, mappingSpu, mappingSku, copySpu, copySku, saveSpu, saveSku, publishSku, commitEs, mapSpuDoc2Record, mapSkuDoc2Record } from './spu.api';
import { getTenantId, getToken } from "/@/utils/auth";

const glob = useGlobSetting();

//列表数据
export const tableHotel: BasicColumn = [
   {
    title: '内容类型',
    align:"center",
    dataIndex: 'subjectType_dictText'
   },
   {
    title: '计费内容',
    align:"center",
    dataIndex: 'subjectId'
   },
   {
    title: '计费类型',
    align:"center",
    dataIndex: 'billingType_dictText'
   },
   {
    title: '金额',
    align:"center",
    dataIndex: 'amount'
   },
   {
    title: '计费摘要',
    align:"center",
    dataIndex: 'summary'
   },
];

//侧边栏表单
export const drawerStock: FormSchema = {
  "type": "page",
  "title": "日历库存-抽屉",
  "data": "${rowItem}", //传递当前选中SKU
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
            "title": "库存日历",
            "body": [
              {
                "type": "service",
                "id":"servicesku",
                "initFetch": true,
                "api": {
                  "method": "post",
                  "url": glob.domainUrl + bizAPI.itemStockList, //查询当前月份库存数据
                  "headers":{
                    "Content-Type": "application/json",
                    'X-Access-Token': getToken() //设置JWT Token
                  },
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "adaptor": function (payload, response) {
                    return {
                      total: 30,
                      msg: "success",
                      data: {
                        "stocks": [
                          {
                            "startTime": "2023-03-20 00:00:00",
                            "endTime": "2023-03-20 23:59:59",
                            "content": "11"
                          },
                          {
                            "startTime": "2023-03-22 00:00:00",
                            "endTime": "2023-03-22 23:59:59",
                            "content": "22"
                          },
                          {
                            "startTime": "2023-03-23 00:00:00",
                            "endTime": "2023-03-23 23:59:59",
                            "content": "33"
                          }
                        ]
                      },
                      status: 0
                    };
                  },
                  "data":{
                    "from":0, //当前日历开始日期
                    "to":30, //当前日历截止日期
                    "&": "$$" //将选定的SKU作为参数
                  }
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
                            "label": "资源名称",
                            "name": "sku.spu.name",
                            "id": "u:4ad973218ab2",
                            "readOnly": true
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
                        "id": "u:b0df0ff6b64a"
                      },
                      {
                        "type": "container",
                        "body": [
                          {
                            "type": "input-text",
                            "label": "产品/套餐",
                            "name": "sku.name",
                            "id": "u:9f5d59bf5e83",
                            "readOnly": true
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
                        "id": "u:d675bf5dc0fd"
                      }
                    ],
                    "style": {
                      "position": "static"
                    },
                    "direction": "row",
                    "justify": "flex-start",
                    "alignItems": "stretch",
                    "id": "u:84ed0bb862ac"
                  },
                  {
                    "type": "calendar",
                    "value": "{new Date(currentdate.replace(new RegExp('-','gm'),'/')).getTime()}",
                    "largeMode": true,
                    "schedules": "${stocks}"
                  }
                ]
              }
            ],
            "id": "u:0c29888b2483"
          },
          {
            "title": "批量设置",
            "body": [
              {
                "type": "form",
                "id": "stockInfo",
                "title": "库存与价格设置",
                //"wrapWithPanel": false,
                "data": "${rowItem}", //传递当前选中SKU
                "submitText":"设置",
                "debug": isDebug,
                "debugConfig": {
                  "enableClipboard": true,
                  "displayDataTypes": true
                },
                "body": [
                  {
                    "type": "input-text",
                    "label": "资源名称",
                    "readOnly": true,
                    "name": "sku.spu.name"
                  },
                  {
                    "type": "input-text",
                    "label": "产品名称",
                    "readOnly": true,
                    "name": "sku.name"
                  },
                  {
                    "type": "input-date-range",
                    "label": "起止日期",
                    "name": "date-range",
                    "embed": false,
                    "startPlaceholder": "生效日期",
                    "endPlaceholder": "失效日期"
                  },
                  {
                    "type": "checkboxes",
                    "label": "适用日期",
                    "name": "applydays",
                    "multiple": true,
                    "options": [
                      {
                        "label": "周一",
                        "value": 0
                      },
                      {
                        "label": "周二",
                        "value": 1
                      },
                      {
                        "label": "周三",
                        "value": 2
                      },
                      {
                        "label": "周四",
                        "value": 3
                      },
                      {
                        "label": "周五",
                        "value": 4
                      },
                      {
                        "label": "周六",
                        "value": 5
                      },
                      {
                        "label": "周日",
                        "value": 6
                      }
                    ],
                    "checkAll": true,
                    "joinValues": true
                  },
                  {
                    "type": "input-number",
                    "label": "库存设置",
                    "name": "amount",
                    "value": 0,
                    "keyboard": true,
                    "step": 1
                  },
                  {
                    "type": "input-number",
                    "label": "成本价/采购价",
                    "name": "priceCost",
                    "value": "${sku.price.cost}",
                    "readOnly": true,
                  },
                  {
                    "type": "input-number",
                    "label": "供货价/2B售价",
                    "name": "priceSale",
                    "value": "${sku.price.sale}",
                    "keyboard": true,
                    "step": 1
                  }
                ],
                "mode": "horizontal"
              }
            ],
            "id": "u:0c29888b2483"
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
  "id": "u:971e12982973",
  "asideResizor": false,
  "pullRefresh": {
    "disabled": true
  },
  "regions": [
    "body"
  ]
};

//查询表单
export const formStock: FormSchema = {
  "type": "page",
  "id": "u:f71ee9197152",
  "title": "自有商品商品库存",
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
        {
          "type": "flex",
          "className": "p-1",
          "items": [
            {
              "type": "container",
              "body": [
                {
                  "type": "input-text",
                  "label": "资源名称",
                  "name": "spuName",
                  "id": "u:beccf187250e"
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
                  "label": "产品名称",
                  "name": "name",
                  "id": "u:beccf187250e"
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
                  "type": "select",
                  "label": "上架状态",
                  "name": "status",
                  "options": [
                    {
                      "label": "已上架/在售",
                      "value": "in-selling"
                    },
                    {
                      "label": "已下架/停售",
                      "value": "off-selling"
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
                  "type": "select",
                  "label": "库存类型",
                  "name": "stockType",
                  "options": [
                    {
                      "label": "自有/签约",
                      "value": "contract"
                    },
                    {
                      "label": "外部库存",
                      "value": "B"
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
                  "label": "关键字",
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
                  "id": "u:23490a9879c0",
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
              "id": "u:6b3a2bc5c39e"
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
                data: payload.hits && payload.hits.total >0 ? mappingSku(payload.hits.hits): [],
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
                                "term" : { "tenant.id": getTenantId() } // 仅查询私库内容
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
                      "label": "查看日历库存",
                      "type": "button",
                      "onEvent": {
                        "click": { //
                          "actions": [ // 执行的动作列表
                            {
                              "actionType": "drawer", // 显示SPU详情及SKU列表，默认传递当前选中的行数据 rowItem
                              "drawer": {
                                "id":"drawerSku",
                                "position": "right",
                                "size": "lg",
                                "closeOnOutside":true,
                                "title": "库存日历",
                                "actions":[],
                                "body": drawerStock
                              }
                            },
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
                      "label": "资源",
                      "name": "sku.spu.name",
                      "quickEdit": false,
                      "type": "text"
                    },
                    {
                      "label": "产品",
                      "name": "sku.name",
                      "quickEdit": false,
                      "type": "text"
                    },
                    {
                      "type": "text",
                      "label": "套餐",
                      "name": "sku.option.name"
                    },
                    {
                      "type": "text",
                      "label": "规格",
                      "name": "sku.specific.name"
                    },
                    {
                      "type": "text",
                      "label": "成本价",
                      "name": "sku.price.cost"
                    },
                    {
                      "type": "text",
                      "label": "供货价",
                      "name": "sku.price.sale"
                    },
                    {
                      "type": "text",
                      "label": "零售价",
                      "name": "sku.price.bid"
                    },
                    {
                      "type": "mapping",
                      "label": "上架状态",
                      "name": "sku.status",
                      "map": {
                        "in-selling": "<span class='label label-success'>在售</span>",
                        "off-selling": "<span class='label label-danger'>已下架</span>",
                        "*": "${sku.status}"
                      }
                    },
                    {
                      "type": "mapping",
                      "label": "库存类型",
                      "name": "sku.type.stock",
                      "map": {
                        "contract": "<span class='label label-info'>自有/签约</span>",
                        "quote": "<span class='label label-warning'>外部/询盘</span>",
                        "other": "<span class='label label-warning'>外部</span>",
                        "*": "${sku.type.stock}"
                      }
                    },
                    {
                      "type": "text",
                      "label": "供应商",
                      "placeholder": "-",
                      "name": "sku.seller.name"
                    }
                  ],
                  "strictMode": false,
                  "canAccessSuperData": true,
                  "columnsTogglable":false,
                  "onEvent": {
                    "rowClick": {
                      "actions": [         
                        {
                          "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                          "drawer": {
                            "id":"drawerSku",
                            "position": "right",
                            "size": "lg",
                            "closeOnOutside":true,
                            "title": "库存日历",
                            "actions":[],
                            "body": drawerStock
                          }
                        },
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

