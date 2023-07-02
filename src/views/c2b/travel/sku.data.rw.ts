import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG} from '/@/settings/iLifeSetting';
import {isDebug, bizAPI, sxNewSku, mappingSpu, mappingSku, copySpu, copySku, saveSpu, saveSku, publishSku, commitEs, mapSpuDoc2Record, mapSkuDoc2Record, mappingSpuCompletions } from './spu.api';
import {getSkuInfo, getItemTypeName } from './spu.info';

import { getTenantId, getToken, getLoginBackInfo } from "/@/utils/auth";
import { SkinOutlined } from '@ant-design/icons-vue';
import { Md5 } from 'ts-md5';

const glob = useGlobSetting();

//获取侧边栏表单
export const getDrawer = (itemType) => {
  let drawer = {
    "type": "page",
    "title": "景点SKU-抽屉",
    "data": "${rowItem}", //传递当前选中SKU
    "body":{
      "type": "form",
      "id": "skuform",
      "title": "",
      "submitText": "保存修改",
      //"wrapWithPanel": false,
      "debug": isDebug,
      "debugConfig": {
        "enableClipboard": true,
        "displayDataTypes": true
      },
      "onEvent": {
        "submit": {
          "actions": [   
            {
              "actionType": "ajax", //提交MySQL 同步更新
              "args": {
                "api": {
                  "method": "post",
                  "url": glob.domainUrl + bizAPI.skuEdit, //更新数据
                  "headers":{
                    "Content-Type": "application/json",
                    'X-Access-Token': getToken() //设置JWT Token
                  },
                  "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
                    console.log("commit es....",{...api.data.sku});
                    commitEs("sku", {...api.data.sku});//提交ES索引
                    let targetData = mapSkuDoc2Record({...api.data.sku}); //转换为DB记录
                    console.log("commit mysql....",targetData);
                    return {
                      ...api,
                      data: targetData 
                    };
                  },
                },
                "messages": {
                  "success": "更新成功",
                  "failed": "啊哦，更新出错了~~"
                }
              },
              "data":{
                "&": "$$" //直接提交整个表单
              }
            },//** */
            { //关闭抽屉
              "actionType": "closeDrawer",
              "componentId": "drawerSku"
            },
            { //刷新SKU列表
              "actionType": "reload", 
              "componentId": "servicesku",
              "args":{
                "&": "$$" 
              }
            }
          ]
        }
      },
      "submit": function (data) {
        console.log("try save sku. ",data);
      },
      "body": [
        {
          "type": "tabs",
          "tabs": [
            {
              "title": "基本信息",
              "body": [
                {
                  "type": "container",
                  "id": "skuBaseInfo",
                  "title": "表单",
                  "wrapWithPanel": false,
                  "data": "${rowItem}", //传递当前选中SKU
                  "debug": isDebug,
                  "debugConfig": {
                    "enableClipboard": true,
                    "displayDataTypes": true
                  },
                  "body": [
                    {
                      "label": "名称",
                      "type": "input-text",
                      "name": "sku.name",
                      "id": "u:ac7f15bd417d"
                    },
                    {
                      "type": "container",
                      "body": [
                        {
                          "type": "flex",
                          "className": "p-1",
                          "items": [
                            {
                              "type": "container",
                              "body": [
                                // {
                                //   "type": "input-text",
                                //   "label": "商品类型",
                                //   "name": "sku.spu.name",
                                //   "id": "u:6f7be9b37331"
                                // },
                                {
                                  "type": "select",
                                  "label": "商品类型",
                                  "placeholder":"请选择",
                                  "name": "sku.spu.id",
                                  "source": "${sku.spuOptions}",//将当前选中的SPU作为默认选项
                                  "autoComplete":{ //只能从已经有的spu中筛选。并且是从自有库的spu中筛选
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
                                        //term: orgData.term
                                      };
                        
                                      //根据搜索表单的值设置搜索条件
                                      if(orgData.term && orgData.term.trim().length>0){
                                        targetData.query.bool.should.push({ "match": { "full_text": orgData.term } });
                                      }
                        
                                      return {
                                        ...api,
                                        data: targetData //使用组装后的查询条件
                                      };
                                    },
                                    "adaptor": function (payload, response) {
                                      //console.log("got search result", payload);
                                      return {
                                        msg: "",
                                        data: mappingSpuCompletions(payload.hits.hits),
                                        status: 0
                                      };
                                    },
                                    "headers": SEARCH_CONFIG.headers,
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
                                              },
                                              {
                                                "nested": {
                                                    "path": "type",
                                                    "query": {
                                                        "term" : { "type.item": itemType } 
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
                                      "term":"${term}", //自动补全的输入内容
                                      // "&": "$$" //将搜索表单数据作为附加条目：需要在requestAdapter内进行处理
                                    }
                                  },
                                },
                                {
                                  "type": "input-text",
                                  "label": "套餐类型",
                                  "name": "sku.option",
                                  "id": "u:8caa53ff6caa"
                                },
                                {
                                  "type": "input-text",
                                  "label": "规格类型",
                                  "name": "sku.specific",
                                  "id": "u:f5b61564060f"
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
                            },
                            {
                              "type": "container",
                              "body": [
                                {
                                  "type": "input-text",
                                  "label": "商品编码",
                                  "name": "sku.code.spu",
                                },
                                {
                                  "type": "input-text",
                                  "label": "套餐编码",
                                  "name": "sku.code.option",
                                },
                                {
                                  "type": "input-text",
                                  "label": "规格编码",
                                  "name": "sku.code.specific",
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
                            "position": "static"
                          },
                          "direction": "row",
                          "justify": "flex-start",
                          "alignItems": "stretch",
                        }
                      ],
                      "style": {
                        "position": "static",
                        "display": "block"
                      },
                    },
                    {
                      "type": "flex",
                      "className": "p-1",
                      "items": [
                        {
                          "type": "container",
                          "body": [
                            {
                              "type": "input-text",
                              "label": "采购价/成本价",
                              "name": "sku.price.cost",
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
                        },
                        {
                          "type": "container",
                          "body": [
                            {
                              "type": "input-text",
                              "label": "供货价/2B卖价",
                              "name": "sku.price.sale",
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
                        },
                        {
                          "type": "container",
                          "body": [
                            {
                              "type": "input-text",
                              "label": "市场价/2C卖价",
                              "name": "sku.price.bid",
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
                        "position": "static"
                      },
                      "direction": "row",
                      "justify": "flex-start",
                      "alignItems": "stretch",
                    },
                    {
                      "type": "flex",
                      "className": "p-1",
                      "items": [
                        {
                          "type": "container",
                          "body": [
                            {
                              "type": "radios",
                              "label": "库存类型",
                              "name": "sku.type.stock",
                              "options": [
                                {
                                  "label": "自有/签约",
                                  "value": "contract"
                                },
                                {
                                  "label": "外部/询盘",
                                  "value": "quote"
                                }
                              ],
                              "inline": true
                            },
                            {
                              "type": "radios",
                              "label": "上架状态",
                              "name": "sku.status",
                              "options": [
                                {
                                  "label": "已上架/在售",
                                  "value": "in-selling"
                                },
                                {
                                  "label": "已下架/停售",
                                  "value": "off-selling"
                                }
                              ],
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
                        "position": "static"
                      },
                      "direction": "row",
                      "justify": "flex-start",
                      "alignItems": "stretch",
                    }
                  ],
                  "mode": "horizontal"
                }
              ],
            },
            ...getSkuInfo(itemType).slice(1) //去掉SPU的基本信息
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


//查询表单
export const getForm = (itemType) => {
  let form = {
    "type": "page",
    "id": "u:f71ee9197152",
    "title": "SKU",
    "body": [
      {
        "type": "form",
        "wrapWithPanel": false,
        "data": { //数据通过page在搜索表单及数据列表间传递
          "region":"",
          "name": "",
          "star":0,
          "keyword":"",
          "spu":{
            "id":null
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
                            "componentId": "servicesku"+itemType, // 触发sku数据加载：注意需要触发service，table仅负责显示数据
                            "args":{
                              "&": "$$"
                            }
                          }
                        ]
                      }
                    },
                    "size": "md",
                    "level": "primary"
                  },
                  {
                    "type": "button",
                    "label": "新增",
                    "className":"ml-2",
                    "onEvent": {
                      "click": {
                        "actions": [
                          {
                            "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                            "componentId": "servicesku"+itemType, // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                            "args":{
                              "__sxSku":"addNew",//设置隐藏变量，将新增数据放在第一条
                              "&": "$$"
                            }
                          },
                        ]
                      }
                    },
                    "size": "md",
                    "level": "success"
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
            "id":"servicesku"+itemType,
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
  
                //判断是否是新增记录，设置状态
                if(orgData.__sxSku === "addNew"){
                  console.log("insert new record item.", itemType);
                  sxNewSku.addNew = true;
                  sxNewSku.tpl.type.item = itemType; //设置类型
                  sxNewSku.tpl.name = "新增"+getItemTypeName(itemType); //设置默认名称呢
                  let loginInfo = getLoginBackInfo();
                  if(loginInfo && loginInfo.tenantList && loginInfo.tenantList.length>0){
                    sxNewSku.tpl.seller.name = loginInfo.tenantList[0].name;
                  }
                  let id = Md5.hashStr("sku"+itemType+getTenantId()+""+new Date().getTime()+""+Math.random()); //随机生成一个id
                  sxNewSku.tpl.id = id; //设置id
                }

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
                  //data: payload.hits && payload.hits.total >0 ? mappingSku(payload.hits.hits): [],
                  data: mappingSku(payload.hits.hits),
                  status: payload.hits ? 0 : 1
                };
              },
              "headers": SEARCH_CONFIG.headers,
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
                        },
                        {
                          "nested": {
                              "path": "type",
                              "query": {
                                  "term" : { "type.item": itemType } // 根据类型查询
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
                    "rowClassNameExpr": "<%= id % 2 ? 'bg-blue-300' : 'bg-blue-50' %>",
                    "itemActions": [
                      {
                        "label": "发布到公共库",
                        "type": "button",
                        "onClick": (e, props) => {
                          console.log("publish SKU", props.data.sku);
                          if( props.data.sku.tenant && props.data.sku.tenant.id === getTenantId ) //仅自己的内容才可以发布
                            publishSku(props.data.sku); //复制SKU
                        },
                        "onEvent": {
                          "click": { // 点击时直接提示已完成复制：TODO：调整为后端复制SKU、SKU则可直接通过ajax及message完成提示
                            "actions": [ // 执行的动作列表
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "已发布到公共库"
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
                                  "id":"drawerSku",
                                  "position": "right",
                                  "size": "lg",
                                  "closeOnOutside":true,
                                  "title": "产品详情",
                                  "actions":[],
                                  "body": getDrawer(itemType)
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
                        "label": "资源名称",
                        "name": "sku.spu.name",
                        "quickEdit": false,
                        "type": "text"
                      },
                      {
                        "label": "产品/套餐",
                        "name": "sku.name",
                        "quickEdit": false,
                        "type": "text"
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
                        "label": "市场价",
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
                          "quote": "<span class='label label-warning'>外部</span>",
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
                              "title": "产品详情",
                              "actions":[],
                              "body": getDrawer(itemType)
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
  return form;
}


