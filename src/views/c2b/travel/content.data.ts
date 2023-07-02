import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';

import {SEARCH_API, SEARCH_CONFIG, BIZ_API, BIZ_CONFIG} from '/@/settings/iLifeSetting';
import { getTenantId } from '/@/utils/auth';
import { DollarCircleTwoTone } from '@ant-design/icons-vue';

import {ToastComponent, AlertComponent, alert, confirm, toast,Drawer} from 'amis-ui';
import { hot } from './note.api';
import { isDebug, changeTemplate, saveGenerateRecord } from './content.api';


//侧边栏：内容预览
export const previewdrawer = {
  "type": "page",
  "name": "previewdrawer",
  "id": "previewdrawer",
  "title": "内容预览",
  "body":{
    "type": "form",
    "name": "contentform",
    "data": {
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
        "className":"text-green-400 align-top align-text-top",
        "tpl": "选择内容平台后将自动发布<br/>"
      },
      { //操作按钮
        "type": "button",
        "label": "生成内容并前往发布",
        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "custom",
                "script": function(e){
                  console.log("try generate content ....", e.props.data);
                  saveGenerateRecord("note", hot.note ,"html",e.props.data);//不支持预览内容传入
                }
              },
              {
                "actionType": "toast", // 执行toast提示动作
                "args": { // 动作参数
                  "msgType": "success",
                  "msg": "内容已生成，可以前往发布"
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


//图文模板查询表单
//按条显示，点击后将显示预览
export const templatesList = {
  "type": "page",
  "name": "templatesform",
  "title": "图文内容模板",
  "data":{
    "name":""
  },
  "body": [
    {
      "type": "form",
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
                          "componentId": "serviceTemplates", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
          "id":"serviceTemplates",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": BIZ_API+"/erp/modViewTemplate/list", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
              let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
              let targetData = {
                itemType:"note",
                //name: null, //针对名称发起查询
              };

              //根据搜索表单的值设置搜索条件
              if(orgData.name && orgData.name.trim().length>0 ){
                targetData["name"] = orgData.name;
              }
              let payload = {
                ...api,
                data: targetData //使用组装后的查询条件
              };
              console.log("try templates search.", payload);
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
              name: "${name}"
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
                      "title": "${name}",
                      "subTitle": "将${itemType_dictText}转换为${name} ",
                      "avatarText": "${name}",
                    },
                    "body":"${description}",
                    //"secondary": "${knowledgeCategoryId_dictText}",
                    "actions": [
                      { //采用当前选中模板生成内容，并且进行预览
                        "type": "button",
                        "label": "预览",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "drawer", // 显示SPU详情及SKU列表，默认传递当前选中的行数据 rowItem
                                "drawer": {
                                  "id":"previewdrawer",
                                  "position": "right",
                                  "size": "md",
                                  "closeOnOutside":true,
                                  "title": "内容预览",
                                  "actions":[],
                                  "body": previewdrawer
                                }
                              },
                            ]
                          }
                        }
                      },
                      { //采用当前选中模板生成内容，并且进行预览
                        "type": "button",
                        "label": "生成内容",
                        "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                        "onEvent": {
                          "click": {
                            "actions": [
                              {
                                "actionType": "custom",
                                "script": function(e){
                                  console.log("try generate content ....", e.props.data);
                                  saveGenerateRecord("note", hot.note ,"html",e.props.data);//不支持预览内容传入
                                }
                              },
                              {
                                "actionType": "toast", // 执行toast提示动作
                                "args": { // 动作参数
                                  "msgType": "success",
                                  "msg": "内容已生成，可以前往发布"
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
};
