import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';

import {SEARCH_API, SEARCH_CONFIG, BIZ_API, BIZ_CONFIG} from '/@/settings/iLifeSetting';
import { mappingSpu, mappingSku, copySpu, copySku } from './spu.api';
import {getSpuInfo, getSkuName } from './spu.info';

import { getTenantId } from '/@/utils/auth';

import {  isDebug, hot, goPrompts, addSpu,getSpu, addNoteItem, saveNoteItem } from './note.api';
import { DollarCircleTwoTone } from '@ant-design/icons-vue';

import {ToastComponent, AlertComponent, alert, confirm, toast,Drawer} from 'amis-ui';
import { DrawerAction } from 'amis-core/lib/actions/DrawerAction';

import { templatesList } from './content.data';

//note笔记条目侧边栏表单，能够直接需改笔记条目内容
export const notedrawer = {
  "type": "page",
  "name": "notedrawer",
  "id": "notedrawer",
  "title": "noteItem-抽屉",
  "body":{
    "type": "form",
    "name": "noteform",
    "id": "noteform",
    "clearPersistDataAfterSubmit": true, //提交后清空缓存
    "data": {
      name: hot.noteItem.name,
      content: hot.noteItem.content
    },
    "wrapWithPanel": false,
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "type": "input-text",
        "label": "笔记名称",
        "name": "name",
      },
      {
        "type": "input-rich-text",
        "label": "笔记内容",
        "name": "content",
        //"receiver": "/api/upload/image",
        "vendor": "tinymce",
        "options": {
          "menubar": "true",
          "height": 600,
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
      { //加入当前note
        "type": "button",
        "label": "保存笔记",
        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "custom",
                "script": function(e){
                  console.log("try save note ....", e.props.data);
                  saveNoteItem(e.props.data.name, e.props.data.content);
                }
              },
              {
                "actionType": "toast", // 执行toast提示动作
                "args": { // 动作参数
                  "msgType": "success",
                  "msg": "笔记已保存"
                }
              },
              {
                "actionType": "closeDrawer",
                "componentId": "notedrawer"
              },
            ]
          }
        }
      },
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

//侧边栏表单：选择spu资源后能够直接显示资源详情，并且提供摘要列表
export const spudrawer = {
  "type": "page",
  "name": "drawer",
  "title": "SPU-抽屉",
  "data": "${rowItem}", //传递当前选中SPU
  "body":{
    "type": "form",
    "name": "notespuform",
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
            "title": "图文详情",
            "id": "spuHtmlInfo",
            "body": [
              {
                "type": "form",
                "title": "表单",
                "data": "${rowItem}", //传递当前选中SPU
                "wrapWithPanel": false,
                "debug": isDebug,
                "debugConfig": {
                  "enableClipboard": true,
                  "displayDataTypes": true
                },
                "body": [
                  {
                    "label": "概要介绍",
                    "type": "textarea",
                    "name": "spu.summary",
                  },
                  {
                    "type": "input-tag",
                    "label": "亮点/标签",
                    "name": "spu.tags",
                  },
                  {
                    "type": "input-rich-text",
                    "label": "图文详情",
                    "name": "spu.content",
                    //"receiver": "/api/upload/image",
                    "vendor": "tinymce",
                    "options": {
                      "menubar": "true",
                      "height": 600,
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
                  { //加入当前note
                    "type": "button",
                    "label": "加入笔记",
                    "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                    "onEvent": {
                      "click": {
                        "actions": [
                          {
                            "actionType": "custom",
                            "script": function(e){
                              console.log("try insert spu ....", e.props.data);
                              addSpu(e.props.data.spu);
                            }
                          },
                          {
                            "actionType": "toast", // 执行toast提示动作
                            "args": { // 动作参数
                              "msgType": "success",
                              "msg": "已添加到笔记"
                            }
                          },
                        ]
                      }
                    }
                  },
                ],
              }
            ]
          },
          {
            "title": "自动摘要",
            "id": "spuHtmlInfo",
            "body": [
              {
                "type": "form",
                "title": "表单",
                "data": "${rowItem}", //传递当前选中SPU
                "wrapWithPanel": false,
                "debug": isDebug,
                "debugConfig": {
                  "enableClipboard": true,
                  "displayDataTypes": true
                },
                "body": "待添加：能够根据摘要模板自动生成该资源摘要，可以动态添加到笔记内",
              }
            ]
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

//资源库查询表单：带有搜索框，默认显示全部，搜索查询全部
export const spuForm = {
  "type": "page",
  "name": "noteformspu",
  "id": "noteformspu",
  "title": "SPU",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "className": "-m-4",
      "data": { //数据通过page在搜索表单及数据列表间传递
        "itemType":"",
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
                  "type": "select",
                  "label":"",
                  "placeholder": "选择类型",
                  "className":"w-full",
                  "name": "itemType",
                  "options":[
                    {
                      label: "全部",
                      value: "*"
                    },
                    {
                      label: "酒店",
                      value: "hotel"
                    },
                    {
                      label: "交通接驳",
                      value: "vehicle"
                    },
                    {
                      label: "经典门票",
                      value: "scene"
                    },
                    {
                      label: "餐饮美食",
                      value: "restaurant"
                    },
                    {
                      label: "观光日游",
                      value: "tour"
                    },
                    {
                      label: "演出赛事",
                      value: "play"
                    },
                    {
                      label: "休闲娱乐",
                      value: "leisure"
                    },
                    {
                      label: "旅行服务",
                      value: "service"
                    },
                    {
                      label: "租车/包车",
                      value: "car"
                    },
                    {
                      label: "导游",
                      value: "guide"
                    },
                    {
                      label: "签证",
                      value: "visa"
                    },
                    {
                      label: "商品",
                      value: "goods"
                    },
                  ],
                  "multiple": false
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
                          "componentId": "noteservicespu", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
          "id":"noteservicespu",
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
              if(orgData.itemType && orgData.itemType.trim().length>0 && orgData.itemType.trim() != "*"){
                targetData.query.bool.must.push({
                  "nested": {
                      "path": "type",
                      "query": {
                          "term" : { "type.item": orgData.itemType } 
                      }
                  }
                });
              }
              if(orgData.keyword && orgData.keyword.trim().length>0){
                targetData.query.bool.must.push({ "match": { "full_text": orgData.keyword } });
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
              "itemType":"${itemType}",
              "keyword":"${keyword}",
              //"&": "$$" //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
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
                            "label": "查看图文",
                            "className": "px-2 mx-4 border border-solid",
                            "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                            "drawer": {
                              "id":"drawerApp",
                              "position": "right",
                              "size": "lg",
                              "closeOnOutside":true,
                              "title": "资源库内容",
                              "actions": [],
                              "body": spudrawer
                            }
                          },
                          { //添加到笔记
                            "type": "button",
                            "label": "加入笔记",
                            "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                            "onEvent": {
                              "click": {
                                "actions": [
                                  {
                                    "actionType": "custom",
                                    "script": function(e){
                                      console.log("try insert spu ....", e.props.data);
                                      addSpu(e.props.data.spu);
                                    }
                                  },
                                  {
                                    "actionType": "toast", // 执行toast提示动作
                                    "args": { // 动作参数
                                      "msgType": "success",
                                      "msg": "已添加到笔记"
                                    }
                                  },
                                ]
                              }
                            }
                          },
                        ],
                        "itemAction": {
                          "type": "button",
                          "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                          "drawer": {
                            "position": "right",
                            "size": "lg",
                            "closeOnOutside":true,
                            "title": "资源图文素材",
                            "actions": [],
                            "body": spudrawer
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
                    { //验证功能：通过button提供外部数据传递入口：选择solutionItem时展示对应的素材图文内容
                      "type": "button",
                      "label": "添加spu数据并打开抽屉",
                      "className": "px-2 mx-4 border border-solid __sx__btn text-transparent border-0",
                      "onEvent": {
                        "click": {
                          "actions": [
                            {
                              "actionType": "custom",
                              "script":  `
                                  //event.setData({"spu":null});//先清空数据，避免冲突
                                  event.setData({"spu":__spu});
                                  console.log("data from script",event.data);
                                `.replace(/__spu/g,JSON.stringify(getSpu()))
                            },
                            {
                              "type": "button",
                              "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                              "drawer": {
                                "position": "right",
                                "size": "lg",
                                "closeOnOutside":true,
                                "title": "资源图文素材",
                                //"data": {"spu": getSpu()},
                                "actions": [],
                                "body": spudrawer
                              }
                            }
                          ]
                        }
                      }
                    },
                    { //验证功能：通过button提供外部数据传递入口：选择solutionItem时展示对应的素材图文内容
                      "type": "button",
                      "label": "添加当前选中note条目数据并打开抽屉",
                      "className": "px-2 mx-4 border border-solid __sx__notebtn text-transparent border-0",
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
                                "title": "笔记内容",
                                "data": {
                                  "name": hot.noteItem.name,
                                  "content": hot.noteItem.content,
                                },
                                "actions": [],
                                "body": notedrawer
                              }
                            }
                          ]
                        }
                      }
                    },
                    { //验证功能：通过button提供外部数据传递入口：触发模板列表自动显示
                      "type": "button",
                      "label": "点击内容生成时自动弹出模板列表",
                      "className": "px-2 mx-4 border border-solid __sx__contentbtn text-transparent border-0",
                      "onEvent": {
                        "click": {
                          "actions": [
                            {
                              "actionType": "custom",
                              "script":  `
                                  //event.setData({"spu":null});//先清空数据，避免冲突
                                  event.setData({"spu":__spu});
                                  console.log("data from script",event.data);
                                `.replace(/__spu/g,JSON.stringify(getSpu()))
                            },
                            {
                              "type": "button",
                              "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                              "drawer": {
                                "position": "right",
                                "size": "md",
                                "closeOnOutside":true,
                                "title": "选择模板生成内容",
                                "data": {
                                  "title": hot.note.name,
                                  "content": hot.noteItem.content,
                                },
                                "actions": [],
                                "body": templatesList
                              }
                            }
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

//素材库查询表单：带有搜索框，默认显示全部，搜索查询全部
export const materialForm = {
  "type": "page",
  "name": "material",
  "id": "material",
  "title": "",
  "body": "待加入：搜索素材库并显示图文列表"
}

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
        {
          "type": "flex",
          "className": "p-1",
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
                        "label": "加入笔记",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(e){
                                  console.log("try insert kb ....", e.props.data);
                                  addNoteItem("kb",e.props.data.title, e.props.data.content);
                                }
                              },
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "已添加到笔记"
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
                { //验证功能：通过button提供外部数据传递入口
                  "type": "button",
                  "label": "添加数据并打开抽屉",
                  "className": "px-2 mx-4 border border-solid __sx__btn text-transparent border-0",
                  "onEvent": {
                    "click": {
                      "actions": [/**
                        {
                          "actionType": "custom",
                          "script": function(e, props){
                            console.log("show current spu ....", e, props, getSpu());
                            e.props.data = {...e.props.data, ...{"spu":getSpu()} }
                            //e.setData({...e.props.data, ...{"spu":getSpu()} });
                            doAction({
                              "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                              "drawer": {
                                "position": "right",
                                "size": "lg",
                                "closeOnOutside":true,
                                "title": "查看详情-当前编辑条目xxx",
                                "actions": [],
                                "body": drawerScene
                              }
                            });
                            console.log("e.props.data", e.props.data);
                          }
                        },//** */
                        {
                          "actionType": "custom",
                          "script":  `
                              //event.setData({"spu":null});//先清空数据，避免冲突
                              event.setData({"spu":__spu});
                              console.log("data from script",event.data);
                            `.replace(/__spu/g,JSON.stringify(getSpu()))
                        },
                        {
                          "actionType": "setValue",
                          "componentId": "noteform",
                          "args": {
                            "value": "passvaluehere"
                          }
                        },
                        {
                          "type": "button",
                          "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                          "drawer": {
                            "position": "right",
                            "size": "lg",
                            "closeOnOutside":true,
                            "title": "笔记内容",
                            //"data": {"spu": getSpu()},
                            "actions": [],
                            "body": notedrawer
                          }
                        }
                      ]
                    }
                  }
                }
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
          "className": "p-1",
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
                  "className":"w-full _sx_region",
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
                  records: payload.hits && payload.hits.total >0 ? mappingSpu(payload.hits.hits): []
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
              "type": "input-rich-text",
              "label": "生成内容",
              "name": "content",
              "mode": "vertical",
              //"receiver": "/api/upload/image",
              "vendor": "tinymce",
              "options": {
                "menubar": "true",
                "height": 480,
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
            {
              "type": "tpl",
              "className":"text-blue-400 align-top align-text-top",
              "tpl": "获取提示词帮助，以生成更好的内容<br/>",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "custom",
                      "script": function(e){
                        console.log("try go prompts page");
                        goPrompts();
                      }
                    },
                  ]
                }
              }
            },
            {
              "type": "container",
              "body": [
                { //TODO：需要增加ajax行为：点击后将选定内容添加到行程，并且提交后端，完成后添加到行程列表
                  "type": "button",
                  "label": "加入笔记",
                  "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                  "onEvent": {
                    "click": {
                      "actions": [
                        {
                          "actionType": "custom",
                          "script": function(e){
                            console.log("try insert ai ....", e.props.data);
                            addNoteItem(e.props.data.type?e.props.data.type:"ai",e.props.data.title, e.props.data.content);
                          }
                        },
                        {
                          "actionType": "toast", // 执行toast提示动作
                          "args": { // 动作参数
                            "msgType": "success",
                            "msg": "已添加到笔记"
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
      "mode": "horizontal"
    }
  ]
}

//手动编辑表单：直接给富文本编辑框，随便写
export const manualForm = {
  "type": "page",
  "name": "manual",
  "title": "",
  "data": "${rowItem}", //传递当前选中SPU
  "body":{
    "type": "form",
    "name": "manualform",
    "wrapWithPanel": false,
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "label": "名称",
        "type": "input-text",
        "name": "title",
      },
      {
        "type": "input-rich-text",
        "label": "内容",
        "name": "content",
        //"receiver": "/api/upload/image",
        "vendor": "tinymce",
        "options": {
          "menubar": "true",
          "height": 600,
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
      {
        "type": "container",
        "body": [
          { //TODO：需要增加ajax行为：点击后将选定内容添加到行程，并且提交后端，完成后添加到行程列表
            "type": "button",
            "label": "加入笔记",
            "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
            "onEvent": {
              "click": {
                "actions": [
                  {
                    "actionType": "custom",
                    "script": function(e){
                      console.log("try insert manual ....", e.props.data);
                      addNoteItem("manual",e.props.data.title, e.props.data.content);
                    }
                  },
                  {
                    "actionType": "toast", // 执行toast提示动作
                    "args": { // 动作参数
                      "msgType": "success",
                      "msg": "已添加到笔记"
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

