import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';

import {SEARCH_API, SEARCH_CONFIG, BIZ_API, BIZ_CONFIG} from '/@/settings/iLifeSetting';
import { getTenantId } from '/@/utils/auth';
import { DollarCircleTwoTone } from '@ant-design/icons-vue';

import {ToastComponent, AlertComponent, alert, confirm, toast,Drawer} from 'amis-ui';
import { hot, isDebug, savePublishRecord, publishContentWxMp } from './content.api';
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();
/**
 * 已生成内容列表字段
 */
export const contentTableColumns: FormSchema = [
  {
    "label": "标题",
    "name": "title",
    "quickEdit": false,
    "type": "text",
    "placeholder": "-"
  },
  {
    "type": "text",
    "label": "内容类型",
    "name": "contentType_dictText"
  },
  {
    "type": "text",
    "label": "模板类型",
    "name": "templateId_dictText"
  },
  {
    "label": "来源类型",
    "name": "stockType_dictText",
    "quickEdit": false,
    "type": "text",
    "placeholder": "-"
  },
  {
    "type": "text",
    "label": "来源笔记/方案/资源",
    "name": "solutionNoteId_dictText"
  },
  {
    "type": "text",
    "label": "状态",
    "name": "status_dictText"
  },
];


/**
 * 已发布内容列表字段
 */
export const publishTableColumns: FormSchema = [
  {
    "label": "资源类型",
    "name": "stockType_dictText",
    "quickEdit": false,
    "type": "text",
    "placeholder": "-"
  },
  {
    "type": "text",
    "label": "资源/方案/笔记",
    "name": "solutionNoteId_dictText"
  },
  {
    "type": "text",
    "label": "内容标题",
    "name": "contentId_dictText"
  },
  {
    "label": "发布平台",
    "name": "platformSourceId_dictText",
    "quickEdit": false,
    "type": "text",
    "placeholder": "-"
  },
  {
    "type": "link",
    "label": "文章URL",
    "name": "publishUrl"
  },
  {
    "type": "text",
    "label": "发布状态",
    "name": "publishStatus_dictText"
  },
  {
    "type": "text",
    "label": "发布时间",
    "name": "createTime"
  },
];

//侧边栏：内容预览，显示时从下方弹出
export const previewdrawer = {
  "type": "page",
  "name": "previewdrawer",
  "id": "previewdrawer",
  "title": "内容预览",
  "body":{
    "type": "form",
    "name": "contentform",
    "wrapWithPanel": false,
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "type": "input-text",
        "label": "标题",
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
        "type": "tpl",
        "className":"text-blue-400 align-top align-text-top",
        "tpl": "选择内容平台后将自动发布<br/>"
      },
      { //操作按钮
        "type": "button",
        "label": "发布到内容平台",
        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "changeActiveKey",
                "componentId": "publishtabs",
                "args": {
                  "activeKey": 1
                }
              },
              {
                "actionType": "toast", // 执行toast提示动作
                "args": { // 动作参数
                  "msgType": "success",
                  "msg": "选择一个平台并发布"
                }
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


//所有连接器列表
export const connectorsList = {
  "type": "page",
  "name": "connectorsform",
  "title": "内容平台连接器",
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
            /**
            "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
              let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
              let targetData = {
                connectorType:"sink",
                platformCategory:"content",
                //name: null, //针对名称发起查询
              };

              //根据搜索表单的值设置搜索条件
              if(orgData.type){
                targetData.type = orgData.type;
              }
              if(orgData.name && orgData.name.trim().length>0 ){
                targetData["name"] = orgData.name;
              }
              let payload = {
                ...api,
                data: targetData //使用组装后的查询条件
              };
              console.log("try connectors search.", payload);
              return payload;
            },
            //** */
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
              platformCategory:"content", //数据类型：内容
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
                      { //操作按钮
                        "type": "button",
                        "label": "内容预览",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "changeActiveKey",
                                "componentId": "publishtabs",
                                "args": {
                                  "activeKey": 2
                                }
                              },
                            ]
                          }
                        }
                      },
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
                                  console.log("try publish content ....", hot.genRecord, e);
                                  //savePublishRecord(hot.genRecord, e.props.data); //完成内容发布，并记录发布历史
                                  publishContentWxMp("https://air.biglistoflittlethings.com/src/assets/images/logo.png", {
                                    author: userStore.getUserInfo.username,
                                    content:  e.props.data.content || "内容为空",
                                    contentSourceUrl: "https://www.biglistoflittlethings.com",
                                    digest: hot.genRecord.summary ||"摘要如何生成？",
                                    title: e.props.data.title || hot.genRecord.title || "无标题",
                                    thumbMediaId: "",//默认为空
                                  }, e.props.data, hot.genRecord);
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

//抽屉显示，包括预览及模板列表 tab
export const drawer = {
  "type": "page",
  "title": "抽屉",
  "body":{
    "type": "form",
    "id": "drawerform",
    "wrapWithPanel": false,
    "data": { //生成的内容
      title: `示例：📸️🇭🇰码住这个香港超火🔥的必拍路线！🎞️`,
      content: `☝🏻客人收到底片后迫不及待自己修了发到小红书
      😆流量比我还要好哈哈哈哈哈哈哈☝🏻
      不知道你们有没有刷到过她发的😻
      看到评论区好多人说好看还是很开心的！💖
      是不是好多新关注都是从她那来的嘿嘿😚
      那就再介绍一下这条我一个月起码拍10次的路线吧
      📍 从尖沙咀码头上船
      🌟在登船的区域有很多窗户（图10 11 12）记得要坐楼上那层才会有这些窗户！
      
      🌟然后就是天星小轮里面（图4 7 8 14）可以早点在上船位置等 现在香港来旅游的人很多 要坐窗边位置才好拍哦
      🌟然后就下船 下船后左右都会有一条楼梯 可以上去有一个观景区 （图13）
      🌟往左边一直走就是摩天轮的位置啦 摩天轮下面的雪糕车是长期都在的哦～（图1 2 3 5 6 9）
      ‼️关于这条我拍过最火爆的路线之一超详细的介绍！
      赶紧收藏码住来香港拍吧🇭🇰🔥
      摄影@是蕾蕾哟（在香港版
      出镜是我美丽的客人
           
      #拍照姿势不重样#胶片写真#香港约拍#香港拍照#日系写真#香港拍照打卡#海边拍照#杭州约拍#深圳约拍#广州约拍`
    },
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "type": "tabs",
        "id":"publishtabs",
        "tabs": [
          {
            "title": "发布到内容平台",
            "body": connectorsList,
          },
          {
            "title": "内容预览",
            "body": previewdrawer,
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

//已生成内容查询表单
export const contentSearchForm: FormSchema = {
  "type": "flex",
  "className": "p-1",
  "items": [
    {
      "type": "container",
      "body": [
        {
          "type": "select",
          "label": "资源类型",
          "name": "stockType",
          "options": [
            {
              "label": "不限",
              "value": ""
            },
          ],
          "multiple": false
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
          "type": "select",
          "label": "内容类型",
          "name": "contentType",
          "options": [
            {
              "label": "不限",
              "value": ""
            },
          ],
          "multiple": false
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
          "label": "关键字",
          "name": "title",
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
                  "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                  "componentId": "servicecontent", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
};

export const contentFormTable: FormScheme = {
  "type": "page",
  "id": "connectorform",
  "title": "SPU",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "data": { //数据通过page在搜索表单及数据列表间传递
        "stockType":"",
        "contentType": "",
        "title":""
      },
      "body": [
        contentSearchForm,
        {
          "type": "service",
          "id":"servicecontent",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+"/erp/diyGenContent/list", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
              let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
              let targetData = {
                contentType:null,
                stockType: null,
                title: null, //针对title发起查询
              };

              //根据搜索表单的值设置搜索条件
              if(orgData.contentType){
                targetData.contentType = orgData.contentType;
              }
              if(orgData.stockType){
                targetData.stockType = orgData.stockType;
              }
              if(orgData.keyword){
                targetData.title = orgData.keyword;
              }
              let payload = {
                ...api,
                data: targetData //使用组装后的查询条件
              };
              console.log("try content search.", payload);
              return payload;
            },
            "adaptor": function (payload, response) {
              return {
                total: payload.result && payload.result.total ? payload.result.total : 0,
                msg: payload.success ? "success" : "failure",
                data: payload.result.records,
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
                  "type": "table",
                  "name": "table",
                  "id": "table",
                  "label": "",
                  /**
                  "itemBadge": {
                    "text": "${badgeText}",
                    "mode": "ribbon",
                    "position": "top-left",
                    "level": "${badgeLevel}",
                    "visibleOn": "this.badgeText"
                  },
                  //** */
                  "rowClassNameExpr": "<%= spu.id % 2 ? 'bg-blue-300' : 'bg-blue-50' %>",
                  "itemActions": [
                    {
                      "label": "发布内容",
                      "type": "button",
                      //"onClick":"console.log('change gen record from onClick', event, props.data);",
                      "onClick": (e, props) => {
                        console.log("change gen record from onClick", e, props.data);
                        hot.genRecord = props.data;//记录当前选中的
                      },
                      "onEvent": {
                        "click": { //
                          "actions": [ // 执行的动作列表
                            {
                              "actionType": "drawer", // 显示SPU详情及SKU列表，默认传递当前选中的行数据 rowItem
                              "drawer": {
                                "position": "right",
                                "size": "md",
                                "closeOnOutside":true,
                                "title": "选择内容平台并发布",
                                "actions":[],
                                /**
                                "data":{
                                  "genRecord": "${rowItem}"
                                },
                                //** */
                                "body": drawer
                              }
                            },
                          ]
                        }
                      }
                    }
                  ],
                  "columns": contentTableColumns, //表头定义
                  "strictMode": false,
                  "canAccessSuperData": true,
                  "columnsTogglable":false,
                  "onEvent": {
                    "rowClick": {
                      "actions": [    
                        {
                          "actionType": "custom",
                          //字符串脚本无法工作：不能引入自定义变量或函数
                          //"script":"console.log('change gen record from rowClick', event.data.rowItem);hot.genRecord = event.data.rowItem;",
                          "script": (context, event, props) => { //注意：采用脚本时需要通过props获取行数据
                            console.log("change gen record from rowClick",context, props.data);
                            hot.genRecord = props.data.rowItem;//记录当前选中的
                          },
                        },     
                        {
                          "actionType": "drawer", // 显示SPU详情及SKU列表，默认传递当前选中的行数据 rowItem
                          "drawer": {
                            "position": "right",
                            "size": "md",
                            "closeOnOutside":true,
                            "title": "内容预览与发布",
                            "actions":[],
                            /**
                            "data":{
                              "genRecord": "${rowItem}"
                            },
                            //** */
                            "body": drawer
                          }
                        },
                      ]
                    }
                  }
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

