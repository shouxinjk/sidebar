import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {BIZ_CONFIG, SEARCH_API, SEARCH_CONFIG, SX_API, SX_CONFIG} from '/@/settings/iLifeSetting';
import {isDebug} from './points.api';
import { getTenantId, getToken } from "/@/utils/auth";
import {Md5} from 'ts-md5';
import { checkPayResult, createPurhasePointsRecord } from '../../appstore/apps.api';

const glob = useGlobSetting();

//侧边栏表单：显示微信支付二维码
export const drawerApp: FormSchema = {
  "type": "page",
  "title": "APP信息-抽屉",
  //"data": "${rowItem}", //传递当前选中SKU
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
      { //侧边栏显示二维码，支持扫码购买。当前已弃用，采用弹出框显示二维码完成
        "type": "tabs",
        "tabs": [
          {
            "title": "微信扫码购买",
            "id": "appInfo",
            "body": [
              { // 显示微信支付二维码
                "initApi": { //需要从服务器端获取授权链接
                  "method": "POST",
                  "url": SX_API+"/wxPay/rest/qrcode-url",  //获取微信支付二维码
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
                    let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
                    let out_trade_no = "ppt"+Md5.hashStr(""+getTenantId()+""+orgData.id+""+(new Date().getTime()+""+Math.random())).substr(3);//购买虚拟豆: 总长度32位， 前三位ppt为购买阅豆
                    let targetData = {
                      out_trade_no:out_trade_no,
                      total_fee:orgData.price,//单位为分
                      decription:orgData.name,
                    };
      
                    //创建一条购买记录：
                    createPurhasePointsRecord(out_trade_no, orgData.id, orgData.price);

                    //开始查询支付结果
                    checkPayResult(out_trade_no);

                    let postData = {
                      ...api,
                      data: targetData //使用组装后的查询条件
                    };
                    console.log("prepare post data.", postData);
                    return postData;
                  },
                  "adaptor": function (payload, response) {
                    console.log("got wechatpay qrcode url.", payload);
                    if(payload.success){ //成功则显示
                      return {
                        msg: "",//payload.message,
                        data: {
                          "text": "微信扫码支付",
                          "summary": "",
                          "url": payload.data,//使用默认的第三方平台应用APPID
                        },
                        status: 0,//payload.success?0:1
                      };
                    }else{
                      return { //否则显示空白
                        msg: "",
                        data: {
                          "text": "",
                          "summary": "",
                          "url": "#",//
                          "style":"display:none",
                        },
                        status: 0,//payload.success?0:1
                      };
                    }
                  },
                  //"headers": SX_CONFIG.headers,
                  /**
                  "headers":{
                    "Content-Type":"application/json;charset=UTF-8",
                  },
                  //** */
                  "data":{
                    "price": "${price}", //传递价格：单位为分
                    "id": "${id}", //当前选中阅豆产品ID
                    "name":"${name}", //当前选中产品名称
                    "&":"$$" //传递搜索表单数据
                  }
                },
                "type": "page",
                //"body": "<div style='${style}' ><a href='${url}'>${text}</a></div><div>${summary}</div>",
                "body": {
                  "type": "qr-code",
                  "codeSize": 128,
                  "value": "${url}"
                }
              },
              {
                "type": "container",
                "title": "充值详情",
                //"data": "${rowItem}", //传递当前选中SKU
                "wrapWithPanel": false,
                "debug": isDebug,
                "debugConfig": {
                  "enableClipboard": true,
                  "displayDataTypes": true
                },
                "body": [
                  {
                    "type": "hidden",
                    "label": "id",
                    "name": "id"
                  },
                  {
                    "type": "input-text",
                    "label": "名称",
                    "name": "name"
                  },
                  {
                    "type": "input-text",
                    "label": "云豆数量",
                    "name": "points"
                  },
                  {
                    "type": "input-text",
                    "label": "价格",
                    "name": "price"
                  },
                  {
                    "label": "折扣",
                    "type": "textarea",
                    "name": "discount"
                  },
                ],
                "mode": "normal",
                "id": "u:39e435e97b33"
              }
            ]
          },
          {
            "title": "云豆使用说明",
            "body": [
              {
                "type": "form",
                "id": "stockInfo",
                "title": "库存与价格设置",
                "wrapWithPanel": false,
                //"data": "${rowItem}", //传递当前选中SKU
                "submitText":"设置",
                "debug": isDebug,
                "debugConfig": {
                  "enableClipboard": true,
                  "displayDataTypes": true
                },
                "body": [
                  {
                    "data": {
                      "text": "云豆说明",
                      "summary": `云豆为SaaS平台内通用虚拟豆，可以用于各类服务、工具、软件、模板、服务购买，也能够通过充值购买等方式获取。云豆仅用于平台使用，不支持退款、提现或转让。`,
                      //"url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div>${text}</div><div>${summary|raw}</div>"
                  },
                  {
                    "data": {
                      "text": "云豆使用场景",
                      "summary": `云豆为SaaS平台内通用虚拟豆，能够用于系统内各类「应用内」购买场景，包括：
                              <li>能够用于购买图文模板、海报模板、H5模板</li>
                              <li>能够用于购买各类数据连接器，包括内容连接器及商品连接器</li>
                              <li>能够用于AI生成、内容发布、商品发布的能服务</li>`,
                      //"url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div>${text}</div><div>${summary|raw}</div>"
                  },
                  {
                    "data": {
                      "text": "云豆获取",
                      "summary": `云豆可以充值购买，也可以通过其他方式获取，包括：
                              <li>推广并邀请企业用户加入SaaS平台</li>
                              <li>邀请定制师或达人加入</li>
                              <li>成为分销达人，并完成商品分销</li>`,
                      //"url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div>${text}</div><div>${summary|raw}</div>"
                  },
                ],
                "mode": "horizontal"
              }
            ],
          }
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

//查询所有APP
export const tableApps: FormSchema = {
  "type": "page",
  "id": "u:f71ee9197152",
  "title": "云豆产品",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "data": { //数据通过page在搜索表单及数据列表间传递
        "name": ""
      },
      "body": [
        {
          "type": "tpl",
          "tpl": "<div style='width:100%;text-align:center;line-height:60px;'>选择云豆产品完成充值</div>",
          "inline": false,
        },
        {
          "type": "service",
          "id":"serviceapps",
          "initFetch": true,
          "api": {
            "method": "get",
            "url": glob.domainUrl + "/erp/wxPoints/list", 
            "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
            "replaceData": true,
            "autoRefresh": true,
            "adaptor": function (payload, response) {
              return {
                total: payload.result.total,
                msg: payload.message,
                data: {
                  "records": payload.result.records
                },
                status: payload.code==0?1:0 //注意返回值是反着的：后台0为成功，前台0为失败
              };
            },
            "headers":{
              "X-Access-Token": getToken() //设置JWT Token
            },
            "data":{
              "tenantId": 0, //指定为系统租户数据
              "&":"$$" //传递搜索表单数据
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
                        "className": "w-60",
                        "header": {
                          "title": "${name}",
                          "subTitle": "价格: ￥${price*0.01}",
                          //"description": "${discount}",
                          "avatarText": "￥",
                          "avatarTextBackground": [
                            "#FFB900",
                            "#D83B01",
                            "#B50E0E",
                            "#E81123",
                            "#B4009E",
                            "#5C2D91",
                            "#0078D7",
                            "#00B4FF",
                            "#008272"
                          ],
                        },
                        /**
                        "media": {
                          "type": "image",
                          "className": "w-60 h-40",
                          "url": "${logo?logo:'https://www.biglistoflittlethings.com/static/logo/distributor/ilife.png'}",
                          "position": "top"
                        },
                        //** */
                        "body": [
                          {
                            "type": "tpl",
                            "tpl": "<div>数量：${points}</div><div>描述：${discount}</div>",
                            "inline": false,
                            "id": "u:17b9f8e7208d"
                          }
                        ],
                        //"secondary": "${id}",
                        /**
                        "actions": [
                          {
                            "type": "button",
                            "label": "详情",
                            "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                            "drawer": {
                              "id":"drawerApp",
                              "position": "right",
                              "size": "lg",
                              "closeOnOutside":true,
                              "title": "APP详情",
                              "actions": [],
                              "body": drawerApp
                            }
                          },
                          {
                            "actionType": "setValue", // 将 rowItem 手动设置到表单域
                            "componentId": "skuform",
                            "data": "${item}",
                            "value": "${item}",
                            "args": { // ignore : 在SPU表格中将自动获取搜索条件
                              "msgType": "info",
                              "msg": "设置SKU数据 ${event.data|json} ${__rendererData|json}"
                            }
                          }
                        ],
                        //** */
                        "itemAction": {
                          "type": "button",
                          // "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                          // "drawer": {
                          //   "id":"drawerApp",
                          //   "position": "right",
                          //   "size": "lg",
                          //   "closeOnOutside":true,
                          //   "title": "充值购买云豆",
                          //   "actions": [],
                          //   "data":{
                          //     "name":"${name}",
                          //     "price":"${price}",
                          //     "discount":"${discount}",
                          //     "points":"${points}",
                          //     "id":"${id}"
                          //   },
                          //   "body": drawerApp
                          // },
                        
                          "actionType": "dialog",
                          "dialog": {
                            "title": "账户充值",
                            "id":"wxpayDialog",
                            "body": [
                              {
                                "type": "page",
                                "className":"text-center items-center justify-center place-content-center	",
                                "initApi": { //需要从服务器端获取授权链接
                                  "method": "POST",
                                  "url": SX_API+"/wxPay/rest/qrcode-url",  //获取微信支付二维码
                                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                                  "replaceData": true,
                                  "autoRefresh": true,
                                  "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
                                    let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
                                    console.log("got current sale package.", orgData);
                                    //根据当前选中套餐构建二维码链接
                                    let out_trade_no = "ppt"+Md5.hashStr(""+getTenantId()+orgData.id+""+(new Date().getTime())+""+Math.random()).substr(3);//购买虚拟豆: 总长度32位， 前三位ppt为购买阅豆
                                    let targetData = {
                                      out_trade_no:out_trade_no,
                                      total_fee:orgData.price,//单位为分
                                      decription:"充值 "+orgData.name,
                                    };
                      
                                    //提交一条空白购买记录，待支付完成后更新相应数据
                                    createPurhasePointsRecord(out_trade_no, orgData.id, orgData.price);
                
                                    //开始查询支付结果
                                    checkPayResult(out_trade_no);
                
                                    let postData = {
                                      ...api,
                                      data: targetData //使用组装后的查询条件
                                    };
                                    console.log("prepare post data.", postData);
                                    return postData;
                                  },
                                  "adaptor": function (payload, response) {
                                    console.log("got wechatpay qrcode url.", payload);
                                    if(payload.success){ //成功则显示
                                      return {
                                        msg: "",//payload.message,
                                        data: {
                                          "text": "微信扫码支付",
                                          "summary": "",
                                          "url": payload.data,//使用默认的第三方平台应用APPID
                                        },
                                        status: 0,//payload.success?0:1
                                      };
                                    }else{
                                      return { //否则显示空白
                                        msg: "",
                                        data: {
                                          "text": "",
                                          "summary": "",
                                          "url": "#",//
                                          "style":"display:none",
                                        },
                                        status: 0,//payload.success?0:1
                                      };
                                    }
                                  },
                                  "data":{
                                    "price": "${price}", //传递价格：单位为分
                                    "id": "${id}", //当前选中阅豆产品ID
                                    "pints": "${points}", //虚拟豆数量
                                    "name":"${name}", //当前选中产品名称
                                    "&":"$$" //传递搜索表单数据
                                  }
                                },
                                "body":[
                                  { //显示购买内容
                                    "type": "tpl",
                                    "tpl": "购买${points}云豆<br/>￥${price*0.01}<br/>&nbsp;"
                                  },
                                  {
                                    "type": "qr-code",
                                    "className":"mx-38",
                                    "codeSize": 128,
                                    "value": "${url}"
                                  },
                                  { //购买提示
                                    "type": "tpl",
                                    "tpl": "<br/>打开微信扫码付款"
                                  },
                                ]
                                
                              }
                            ],
                            "actions": [
                              {
                                "type": "button",
                                "actionType": "cancel",
                                "label": "取消",
                                "primary": false
                              }
                            ],
                          },
                          
                        },
                        "toolbar": [
                          {
                            "type": "mapping",
                            "name": "type",
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
                    }
                  ]
                }
              ]
            }
          ]
        },
        { //关闭对话框
          "type": "button",
          "label": "关闭对话框",
          "className": "px-2 mx-4 border border-solid __sx__btn__closeDialog text-transparent border-0",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "closeDialog", // 直接关闭对话框
                  "componentId": "wxpayDialog",
                },
                {
                  "actionType": "toast",
                  "args": {
                    "msgType": "success",
                    "msg": "恭喜，支付成功~~",
                    "position": "top-center"
                  }
                },
              ]
            }
          }
        },
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

