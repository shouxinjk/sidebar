import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG, SX_API} from '/@/settings/iLifeSetting';
import {hot, isDebug} from './subscriptions.api';
import { getTenantId, getToken } from "/@/utils/auth";
import {Md5} from 'ts-md5';
import { createPkgSubscritpionRecord, checkPayResult, createSubscritpionRecord, createPurhasePointsRecord } from '../../appstore/apps.api';

const glob = useGlobSetting();


//侧边栏表单：显示单个APP订阅计划
export const drawerPricePlans: FormSchema = {
  "type": "page",
  "title": "DrawerPricePlan",
  "id": "pricePlanDrawer",
  //"data": "${rowItem}", //传递当前选中SKU
  "body":{
    "type": "form",
    "id": "salePackageForm",
    "name":"salePackageForm",
    "title": "",
    //"submitText": "保存修改",
    "data":hot.currentSalePackage,
    "wrapWithPanel": false,
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "type": "tabs",
        "id":"subscriptionTab",
        "name": "subscriptionTab",
        "tabs": [
          { //选择金额后弹出二维码
            "title": "选择订阅计划",
            "body": [
              {
                "type": "service",
                "id":"serviceapps",
                "initFetch": true,
                "api": {
                  "method": "get",
                  "url": glob.domainUrl + "/erp/stoPricePlan/list", //查询所有套餐
                  "headers":{
                    'X-Access-Token': getToken() //设置JWT Token
                  },
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "requestAdaptor": function (api) { //传递当前选中的software.id
                    console.log("got current software.", hot.currentSoftware);
                    let postData = {
                      ...api,
                      data: {
                        appId: hot.currentSoftware.id //传递当前选中的softwareId
                      }
                    };
                    console.log("prepare post data.", postData);
                    return postData;
                  },
                  "adaptor": function (payload, response) {
                    console.log("got price plan records.", payload.result);
                    return {
                      total: 30,
                      msg: "success",
                      //data: payload.result,
                      data: payload.result,
                      status: 0
                    };
                  },
                  "data":{
                    //"&": "$$" //当前选定app作为参数
                    "appId": "${id}" //当前software的id
                  }
                },
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
                        "subTitle": "￥${price*0.01} ",
                        "avatarText": "订阅",
                      },
                      "body":"${discount}",
                      //"secondary": "${knowledgeCategoryId_dictText}",
                      "actions": [
                        { //选中后显示二维码
                          "type": "button",
                          "label": "选择并订阅",
                          "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                          "onEvent": {
                            "click": {
                              "actions": [
                                {
                                  "actionType": "dialog",
                                  "dialog": {
                                    "title": "订阅/续费",
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
                                            console.log("got current price plan.", orgData);
                                            //根据当前选中套餐构建二维码链接
                                            let out_trade_no = "sub"+Md5.hashStr(""+getTenantId()+orgData.id+""+(new Date().getTime())).substr(3);//购买虚拟豆: 总长度32位， 前三位ppt为购买阅豆
                                            let targetData = {
                                              out_trade_no:out_trade_no,
                                              total_fee:orgData.price,//单位为分
                                              decription:orgData.name,
                                            };
                              
                                            //提交一条空白购买记录，待支付完成后更新相应数据
                                            createSubscritpionRecord(out_trade_no, orgData.appId, orgData.id, orgData.durationType);
                        
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
                                            "id": "${id}", //当前选中订阅计划ID
                                            "name":"${name}", //当前选中订阅计划名称
                                            "appId":"${appId}", //当前选中产品ID
                                            "durationType":"${durationType}", //当前选中订阅类型
                                            "&":"$$" //传递搜索表单数据
                                          }
                                        },
                                        "body":[
                                          { //显示购买内容
                                            "type": "tpl",
                                            "tpl": "${appId_dictText} ${name}<br/>￥${price*0.01}<br/>&nbsp;"
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
                                  }
                                },
                              ]
                            }
                          }
                        },
                      ],
                      "toolbar": [
                        {
                          "type": "mapping",
                          "label": "订阅时长",
                          "name": "durationType",
                          "map": {
                            "yearly": {
                              "type": "tpl",
                              "tpl": "按年订阅",
                              "className": "label label-info"
                            },
                            "half-yearly": {
                              "type": "tpl",
                              "tpl": "按半年订阅",
                              "className": "label label-danger"
                            },
                            "quarterly": {
                              "type": "tpl",
                              "tpl": "按季度订阅",
                              "className": "label label-warning"
                            },
                            "*": "${durationType}"
                          }
                        },
                      ],
                    }
                  },
                ]
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


//侧边栏表单：显示points充值界面
export const drawerPoints: FormSchema = {
  "type": "page",
  "title": "DrawerPoints",
  "name": "pointsDrawer",
  //"data": "${rowItem}", //传递当前选中SKU
  "body":{
    "type": "form",
    "id": "salePackageForm",
    "name":"salePackageForm",
    "title": "",
    //"submitText": "保存修改",
    "data":hot.currentSalePackage,
    "wrapWithPanel": false,
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "type": "tabs",
        "id":"subscriptionTab",
        "name": "subscriptionTab",
        "tabs": [
          { //选择金额后弹出二维码
            "title": "选择充值金额",
            "body": [
              {
                "type": "service",
                "id":"serviceapps",
                "initFetch": true,
                "api": {
                  "method": "get",
                  "url": glob.domainUrl + "/erp/wxPoints/list", //查询所有套餐
                  "headers":{
                    'X-Access-Token': getToken() //设置JWT Token
                  },
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "adaptor": function (payload, response) {
                    return {
                      total: 30,
                      msg: "success",
                      data: payload.result,
                      status: 0
                    };
                  },
                  "data":{
                    //"&": "$$" //当前选定app作为参数
                    //"appId": "${appId}"
                  }
                },
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
                        "subTitle": "￥${price*0.01} ",
                        "avatarText": "充值",
                      },
                      "body":"${discount}",
                      //"secondary": "${knowledgeCategoryId_dictText}",
                      "actions": [
                        { //选中后显示二维码
                          "type": "button",
                          "label": "选择并购买",
                          "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                          "onEvent": {
                            "click": {
                              "actions": [
                                {
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
                          "tpl": "${points}云豆",
                          "className": {
                            "label": true,
                            "label-success": true,
                          },
                        },
                        
                      ],
                    }
                  },
                ]
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

//侧边栏表单：显示salePackage列表，支持升级基础套餐
export const drawerSalePackages: FormSchema = {
  "type": "page",
  "title": "Drawer-SalePackage",
  "name": "salePkgDrawer",
  "id": "salePackageDrawer",
  //"data": "${rowItem}", //传递当前选中SKU
  "body":{
    "type": "form",
    "id": "salePackageForm",
    "name":"salePackageForm",
    "title": "",
    //"submitText": "保存修改",
    //"data":hot.currentSalePackage,
    "wrapWithPanel": false,
    "debug": isDebug,
    "debugConfig": {
      "enableClipboard": true,
      "displayDataTypes": true
    },
    "body": [
      {
        "type": "tabs",
        "id":"subscriptionTab",
        "name": "subscriptionTab",
        "tabs": [
          {
            "title": "续费",
            "id": "pkgInfo",
            "name": "pkgInfo",
            "body": [
              { // 显示微信支付二维码：根据当前套餐直接付款
                "id":"pkgQrcode",
                "name":"pkgQrcode",
                "initApi": { //需要从服务器端获取授权链接
                  "method": "POST",
                  "url": SX_API+"/wxPay/rest/qrcode-url",  //获取微信支付二维码
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "requestAdaptor": function (api) { //需要根据搜索条件动态组织搜索Query
                    //let orgData = {...api.data}; //原有的数据，由于返回数据会装载到一起，不能直接作为搜索数据
                    console.log("got current sale package.", hot.currentSalePackage);
                    //根据当前选中套餐构建二维码链接
                    let out_trade_no = "sub"+Md5.hashStr(""+getTenantId()+hot.currentSalePackage.id+""+(new Date().getTime())).substr(3);//购买虚拟豆: 总长度32位， 前三位ppt为购买阅豆
                    let targetData = {
                      out_trade_no:out_trade_no,
                      total_fee:hot.currentSalePackage.price,//单位为分
                      decription:"续费订阅 "+hot.currentSalePackage.name,
                    };
      
                    //提交一条空白购买记录，待支付完成后更新相应数据
                    createPkgSubscritpionRecord(out_trade_no, hot.currentSalePackage.id, hot.currentSalePackage.durationType );

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
                    "name":"${name}", //当前选中产品名称
                    "&":"$$" //传递搜索表单数据
                  }
                },
                "type": "page",
                //"body": "<div style='${style}' ><a href='${url}'>${text}</a></div><div>${summary}</div>",
                "body": 
                [
                  { //显示购买内容
                    "type": "tpl",
                    "tpl": "套餐续费/订阅 ${name}<br/>￥ ${price*0.01}<br/>打开微信扫码付款<br/>&nbsp;"
                  },
                  {
                    "type": "qr-code",
                    //"className":"mx-38",
                    "codeSize": 128,
                    "value": "${url}"
                  },
                ]
              },
              {
                "type": "container",
                "title": "订阅详情",
                //"data": hot.currentSalePackage, //传递当前选中SKU
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
                    //"value":hot.salePackage.id,
                    "name": "id"
                  },
                  {
                    "type": "input-text",
                    "label": "名称",
                    //"value":hot.salePackage.name,
                    "name": "name"
                  },
                  {
                    "type": "textarea",
                    "label": "说明",
                    //"value":hot.salePackage.description,
                    "name": "description"
                  },
                  // {
                  //   "type": "input-text",
                  //   "label": "价格",
                  //   "prefix": "￥",
                  //  // "value":hot.salePackage.price,
                  //   "name": "price"
                  // },
                ],
                "mode": "normal",
              }
            ]
          },
          { //支持修改套餐：默认只可升级，显示所有可选订阅套餐
            "title": "套餐升级",
            "body": [
              {
                "type": "service",
                "id":"serviceapps",
                "initFetch": true,
                "api": {
                  "method": "get",
                  "url": glob.domainUrl + "/erp/stoSalePackage/list", //查询所有套餐
                  "headers":{
                    'X-Access-Token': getToken() //设置JWT Token
                  },
                  "convertKeyToPath": false, //重要：避免自动将key中带有.的键值转换为对象
                  "replaceData": true,
                  "autoRefresh": true,
                  "adaptor": function (payload, response) {
                    return {
                      total: 30,
                      msg: "success",
                      //data: payload.result,
                      data: {
                        ...payload.result,
                        ...hot.currentSalePackage, //同时加载当前套餐数据
                      },
                      status: 0
                    };
                  },
                  "data":{
                    //"&": "$$" //当前选定app作为参数
                    "appId": "${appId}"
                  }
                },
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
                        "subTitle": "￥${price*0.01} ",
                        "avatarText": "订阅",
                      },
                      "body":"${description}",
                      //"secondary": "${knowledgeCategoryId_dictText}",
                      "actions": [
                        { //选中当前订阅计划
                          "type": "button",
                          "label": "选择并订阅",
                          "className": "cxd-Button cxd-Button--primary cxd-Button--size-md bg-primary",
                          "onEvent": {
                            "click": {
                              "actions": [
                                {
                                  "actionType": "dialog",
                                  "dialog": {
                                    "title": "订阅/续费",
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
                                            console.log("got selected sale package.", orgData);
                                            //根据当前选中套餐构建二维码链接
                                            let out_trade_no = "sub"+Md5.hashStr(""+getTenantId()+orgData.id+""+(new Date().getTime())).substr(3);//购买虚拟豆: 总长度32位， 前三位ppt为购买阅豆
                                            let targetData = {
                                              out_trade_no:out_trade_no,
                                              total_fee:orgData.price,//单位为分
                                              decription:"订阅套餐 "+orgData.name,
                                            };
                              
                                            //提交一条空白购买记录，待支付完成后更新相应数据
                                            createPkgSubscritpionRecord(out_trade_no, orgData.id, orgData.durationType );

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
                                            "id": "${id}", //当前套餐ID
                                            "name":"${name}", //当前套餐名称
                                            "durationType":"${durationType}", //当前套餐订阅类型
                                            "&":"$$" //传递搜索表单数据
                                          }
                                        },
                                        "body":[
                                          { //显示购买内容
                                            "type": "tpl",
                                            "tpl": "订阅/续费 ${name}<br/>￥${price*0.01}<br/>&nbsp;"
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
                                  }
                                },
                              ]
                            }
                          }
                        },
                      ],
                      "toolbar": [
                        {
                          "type": "mapping",
                          "label": "订阅时长",
                          "name": "durationType",
                          "map": {
                            "yearly": {
                              "type": "tpl",
                              "tpl": "按年订阅",
                              "className": "label label-info"
                            },
                            "half-yearly": {
                              "type": "tpl",
                              "tpl": "按半年订阅",
                              "className": "label label-danger"
                            },
                            "quarterly": {
                              "type": "tpl",
                              "tpl": "按季度订阅",
                              "className": "label label-warning"
                            },
                            "*": "${durationType}"
                          }
                        },
                      ],
                    }
                  },
                ]
              }
            ]
          },
          {
            "title": "订阅指南",
            "body": [
              {
                "type": "form",
                "id": "stockInfo",
                "title": "基础产品包详情",
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
                      "text": "套餐订阅",
                      "summary": "套餐包含完整的功能及服务集合，根据业务类型区分。包含SaaS平台、微信小程序、企业微信侧边栏、浏览器插件（内容插件、商品插件）、AI生成服务等。订阅后将拥有全部能力。",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "应用市场Market Place",
                      "summary": "不包含在套餐内，可根据需要自由选用，拥有免费内容及需购买内容。包括图文模板、海报模板、H5模板、内容助手、商品助手、AI生成服务等。请进入Market Place查看",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "单独订阅",
                      "summary": "套餐内包含有不同的APP或服务组合，其中各类APP均可单独订阅。如套餐内包含的免费版小程序，可以单独订阅升级为专业版小程序，提供更好的用户体验",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
                  },
                  {
                    "data": {
                      "text": "资源加购",
                      "summary": "相同套餐包含不同的席位数及存储容量，可根据业务需要单独购买",
                      "url": "https://www.biglistoflittlethings.com",
                    },
                    "type": "page",
                    "body": "<div><a href='${url}'>${text}</a></div><div>${summary}</div>"
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

//隐藏表单内容：包含有Drawer展示按钮
export const tableApps: FormSchema = {
  "type": "page",
  "title": "pkg及pricePlan列表",
  "body": [
    {
      "type": "form",
      "wrapWithPanel": false,
      "data": { //数据通过page在搜索表单及数据列表间传递
        "salePackage": hot.currentSalePackage
      },
      "body": [
        { //显示salePackage侧边栏抽屉
          "type": "button",
          "label": "传递当前salePackage并打开抽屉",
          "className": "px-2 mx-4 border border-solid __sx__btn__showPkgDrawer text-transparent border-0",
          "onEvent": {
            "click": {
              "actions": [
                //**
                {
                  "actionType": "custom",
                  "script":  `
                      //event.setData({"salepackage":null});//先清空数据，避免冲突
                      event.setData({"salePackage":__salePackage});
                      console.log("data from script",event.data);
                    `.replace(/__salePackage/g,JSON.stringify(hot.salePackage))
                },
                //** */
                { //注意：参数通过hot传递，即当前currentSalePackage
                  "type": "button",
                  "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                  "drawer": {
                    "position": "right",
                    "size": "md",
                    "closeOnOutside":true,
                    "title": "基础订阅计划",
                    //"data": {"salePackage": hot.currentSalePackage},
                    "actions": [],
                    "body": drawerSalePackages
                  }
                }
              ]
            }
          }
        },
        { //显示充值侧边栏
          "type": "button",
          "label": "传递当前salePackage并打开抽屉",
          "className": "px-2 mx-4 border border-solid __sx__btn__showPointsDrawer text-transparent border-0",
          "onEvent": {
            "click": {
              "actions": [
                { //注意：参数通过hot传递，即当前currentSalePackage
                  "type": "button",
                  "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                  "drawer": {
                    "position": "right",
                    "size": "md",
                    "closeOnOutside":true,
                    "title": "立即充值",
                    //"data": {"salePackage": hot.currentSalePackage},
                    "actions": [],
                    "body": drawerPoints
                  }
                },
                {
                  "actionType": "setValue", // 将 当前选中的software 手动设置到表单域
                  "componentId": "salePackageDrawer",
                  // "data": hot.currentSalePackage,
                  // "value": hot.currentSalePackage,
                  "args": {
                    "value": hot.currentSalePackage,
                  }
                }
              ]
            }
          }
        },
        { //显示PricePlan侧边栏
          "type": "button",
          "label": "传递当前pricePlan并打开抽屉",
          "className": "px-2 mx-4 border border-solid __sx__btn__showPricePlanDrawer text-transparent border-0",
          "onEvent": {
            "click": {
              "actions": [
                { //注意：参数通过hot传递，即当前currentSalePackage
                  "type": "button",
                  "actionType": "drawer", // 显示SKU详情及SKU列表，默认传递当前选中的行数据 rowItem
                  "drawer": {
                    "position": "right",
                    "size": "md",
                    "closeOnOutside":true,
                    "title": "订阅/续费",
                    //"data": {"salePackage": hot.currentSalePackage},
                    "actions": [],
                    "body": drawerPricePlans
                  }
                },
                {
                  "actionType": "setValue", // 将 当前选中的software 手动设置到表单域
                  "componentId": "pricePlanDrawer",
                  // "data": "${rowItem.sku}",
                  // "value": "${rowItem.sku}",
                  "args": {
                    "value": hot.currentSoftware,
                  }
                }
              ]
            }
          }
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

