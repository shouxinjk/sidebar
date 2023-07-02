import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {BIZ_API, BIZ_CONFIG, SEARCH_API, SEARCH_CONFIG} from '/@/settings/iLifeSetting';
import {isDebug, sxNewSpu, bizAPI, mappingSpu, mappingSku, copySpu, copySku,commitEs, mapSpuDoc2Record } from './spu.api';
import { getSkuName, getSpuName,getItemTypeName, getSpuInfo, getSkuInfo, getSpuSearchForm, getTableColumns } from './spu.info';
  
import { getTenantId, getToken, getLoginBackInfo } from "/@/utils/auth";
import { hot, publishMinishop } from '../common/product.api';
import { spuForm } from './note.data.rw';
import { Md5 } from 'ts-md5';

const glob = useGlobSetting();

//所有连接器列表：支持发布到第三方商城
export const connectorsList = {
  "type": "page",
  "name": "connectorsform",
  "title": "商品平台连接器",
  "body": [
    {
      "type": "form",
      "id": "connectorsform",
      "wrapWithPanel": false,
      "className": "-m-4",
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
                  "className":"w-full",
                  "label":"",
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
                          "componentId": "serviceConnectors", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
          "isFixedHeight": false,
          "isFixedWidth": false
        },{
          "type": "service",
          "id":"serviceConnectors",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+"/erp/stoConnector/list-by-type", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "adaptor": function (payload, response) {
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
            ...BIZ_CONFIG,
            "data":{
              pageNo: 1,
              pageSize: 20,
              connectorType:"sink", //操作类型：数据发布
              platformCategory:"product", //数据类型：商品
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
                      "title": "${name}",
                      "subTitle": "${connectorScheme.name} ${platformSource.name}",
                      "avatarClassName": "pull-left thumb-sm avatar m-r",
                      "avatar":'${ extInfo.headImg || "https://www.biglistoflittlethings.com/static/logo/distributor-square/"+platformSource.platform+".png"}',
                      //"avatarText": "${platformSource.name}",
                    },
                    "body":"${platformSource.description}",
                    //"secondary": "${knowledgeCategoryId_dictText}",
                    "actions": [
                      { //采用当前选中模板生成内容，并且进行预览
                        "type": "button",
                        "label": "发布到 ${name}",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(e){
                                  console.log("try publish ....", e.props.data.spu, e);
                                  //savePublishRecord(hot.genRecord, e.props.data); //完成内容发布，并记录发布历史
                                  let product = e.props.data.spu;
                                  let headImages = new Array();
                                  if(product.logo)
                                    headImages.push(product.logo);
                                  publishMinishop({ //spu仅发布spu自身，sku需要进入产品管理完成
                                    outProductId: product.id,
                                    title: product.title || product.name,
                                    subTitle: product.summary,
                                    headImgs: headImages,
                                    descInfoImgs: product.images,
                                    shopCats: [
                                      {shopCatId: 128209, catLevel: 1},
                                      {shopCatId: 377737, catLevel: 2},
                                      {shopCatId: 377738, catLevel: 3},
                                    ],
                                    attrs:[
                                      {
                                        attrKey: "产品类型",
                                        attrValue: "定制旅游",
                                      },
                                      {
                                        attrKey: "预定要求",
                                        attrValue: "请咨询客服确认",
                                      },
                                    ],
                                    skus: [],//默认不带入sku
                                    model: product.code.spu || "", //没有型号
                                    brandId: 2100000000, //无品牌
                                    expressTemplateId: 20244968, //不包邮
                                  }, e.props.data);
                                },
                              },
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "已提交发布"
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
                        "tpl": "${price>0 ? price+'虚拟豆':'免费'}",
                        "className": {
                          "label": true,
                          "label-warning": "${price>0}",
                          "label-success": "${price<=0}",
                        },
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

/**
 * 按类型获取侧边栏表单，包含tab列表，并提供修改保存功能
 * @param itemType 类型
 * @returns 
 */
export const getDrawer = ( itemType ) => {
  let drawer = {
    "type": "page",
    "id": "spuDrawer",
    "title": "SPU抽屉",
    "data": "${rowItem}", //传递当前选中SPU
    "body":{
      "type": "form",
      "id": "spuform",
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
                  "url": glob.domainUrl + bizAPI.spuEdit, //更新数据
                  "headers":{
                    "Content-Type": "application/json",
                    'X-Access-Token': getToken() //设置JWT Token
                  },
                  "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
                    console.log("commit es....",api,{...api.data.spu});
                    commitEs("spu", {...api.data.spu});//提交ES索引
                    let targetData = mapSpuDoc2Record({...api.data.spu}); //转换为DB记录
                    console.log("commit mysql....",targetData);
                    return {
                      ...api,
                      data: targetData 
                    };
                  },
                },
                "options": {
                  "silent": true
                }
              },
              "data":{
                "&": "$$" //直接提交整个表单
              }
            },
            { //关闭抽屉
              "actionType": "closeDrawer",
              "componentId": "drawerSpu"
            },
            { //刷新SPU列表
              "actionType": "reload", 
              "componentId": "servicespu",
              "args":{
                "&": "$$" 
              }
            }
          ]
        }
      },
      "submit": function (data) {
        console.log("try save spu. ",data);
      },
      "body": [
        {
          "type": "tabs",
          "tabs": getSpuInfo(itemType) //根据类型获取spu tab列表
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
            "id":"servicespu"+itemType,
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
  

                //判断是否是新增记录，设置状态
                if(orgData.__sxSpu === "addNew"){
                  console.log("insert new record item.", itemType);
                  sxNewSpu.addNew = true;
                  sxNewSpu.tpl.type.item = itemType; //设置类型
                  sxNewSpu.tpl.name = "新增"+getItemTypeName(itemType); //设置默认名称呢
                  let loginInfo = getLoginBackInfo();
                  if(loginInfo && loginInfo.tenantList && loginInfo.tenantList.length>0){
                    sxNewSpu.tpl.seller.name = loginInfo.tenantList[0].name;
                  }
                  let id = Md5.hashStr("spu"+itemType+getTenantId()+""+new Date().getTime()+""+Math.random()); //随机生成一个id
                  sxNewSpu.tpl.id = id; //设置id
                }

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
                //console.log("got search result", payload);
                return {
                  total: payload.hits && payload.hits.total ? payload.hits.total : 0,
                  msg: payload.hits && payload.hits.total >0 ? "success" : "failure",
                  //data: payload.hits && payload.hits.total >0 ? mappingSpu(payload.hits.hits): [],
                  data: mappingSpu(payload.hits.hits),
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
                    "placeholder":"空空如也，进入资源库可快速复制",
                    "itemBadge": {
                      "text": "${badgeText}",
                      "mode": "ribbon",
                      "position": "top-left",
                      "level": "${badgeLevel}",
                      "visibleOn": "this.badgeText"
                    },
                    "rowClassNameExpr": "<%= id % 2 === 0 ? 'bg-blue-300' : 'bg-blue-50' %>",
                    "itemActions": [
                      {
                        "label": "发布到公共库",
                        "type": "button",
                        "onClick": (e, props) => {
                          console.log("publish SPU", props.data.spu);
                          copySpu(props.data.spu); //复制SPU
                        },
                        "onEvent": {
                          "click": { // 点击时直接提示已完成复制：TODO：调整为后端复制SPU、SKU则可直接通过ajax及message完成提示
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
                      },/**
                      {
                        "label": "查看产品",
                        "type": "button",
                        "onEvent": {
                          "click": { //
                            "actions": [ // 执行的动作列表
                              {
                                "actionType": "custom", // 将 rowItem 手动设置到表单域
                                "script": "self.parent.addOneTab('行为线索任务','tSubjectKeysController.do?myTaskbehaviorKeysTabsList','icon-add')"
                              }
                            ]
                          }
                        }
                      }/**,//** */
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
                      },
                      {//发布商品到第三方电商平台
                        "label": "发布商品",
                        "type": "button",
                        /**
                        "onClick": (e, props) => { //提前设置当前选中数据
                          console.log("change hot product from onClick", e, props.data);
                          hot.product = props.data.spu;//记录当前选中的spu
                        },
                        //** */
                        "onEvent": {
                          "click": { //
                            "actions": [ // 执行的动作列表
                              {
                                "actionType": "drawer", 
                                "drawer": {
                                  "id":"drawerPublishSpu",
                                  "position": "right",
                                  "size": "lg",
                                  "closeOnOutside":true,
                                  "title": "选择商品平台发布",
                                  "actions":[],
                                  "body": connectorsList,
                                }
                              },
                            ]
                          }
                        }
                      },
                      
                    ],
                    "columns": getTableColumns(itemType),
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


