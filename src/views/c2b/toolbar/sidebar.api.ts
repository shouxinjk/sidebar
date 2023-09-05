import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';
import { router } from '/@/router';
import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, WEWORK_API, SUITE_ID, BIZ_API} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';
import { reactive } from 'vue';
import { hostname } from 'os';
import * as ww from '@wecom/jssdk'; //引入企业微信jssdk

import { doLogout} from '/@/api/sys/user';
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();

const glob = useGlobSetting();

//操作界面状态数据
export const hot = reactive({
  authMiniprogs: [], //当前租户小程序信息，用于构建小程序卡片
  corpId: "",
  agentId: "",
  replaceContent: true, //记录操作类型，是否需要替换当前内容，对于续写则为添加
  currentContent: "", //记录当前生成的内容
  product: {id: "", name: "", type: "" },
});

//加载授权小程序，可能为多个
export const loadAuthMiniprogs = ( ) => {
  console.log("try load auth miniprog");
  //加载solution
  axios
    .get( BIZ_API+"/erp/wxAuthMiniprog/list",{...BIZ_CONFIG,
      params:{}
    })
    .then(res => { 
      console.log("got miniprogs.",res);
      hot.authMiniprogs = res.data.result.records;
    })
    .catch(function (error) { 
      console.log("failed load auth miniprogs",error);
    });
}

//获取sku详情
export const getSku = async (id) => {
  return axios
  .get(SEARCH_API+'/sku/doc/'+id, SEARCH_CONFIG);
}

//根据itemType及itemId查询得到详情，组装展示信息
export const getItemInfo = async ( itemType, itemId ) => {
  console.log("try get item info", itemType, itemId);
  if( itemType === "solution"){
    return axios
    .get( BIZ_API+"/erp/diySolution/queryById",{...BIZ_CONFIG,
      params:{
        id: itemId
      }
    });
  }else if( itemType === "note"){
    return axios
    .get( BIZ_API+"/erp/diySolutionNote/queryById",{...BIZ_CONFIG,
      params:{
        id: itemId
      }
    });
  }else if( itemType === "sku"){
    return axios
    .get( BIZ_API+"/erp/diySpecificItem/queryById",{...BIZ_CONFIG,
      params:{
        id: itemId
      }
    });
  }else{
    console.log("wrong itemType", itemType);
    return "error itemType"
  }

}

//上传临时素材：得到mediaId
export const uploadMedia = async ( mediaInfo ) => {
  console.log("try upload media",mediaInfo);
  //上传
  return axios
    .post( BIZ_API+"/wework/tp/upload-media",mediaInfo,BIZ_CONFIG);
}

//发送消息到对话框，具体内容由前端封装
export const sendChatMessage = ( msg ) => {
    console.log("try send msg", msg);
    ww.sendChatMessage( msg ).then( res => {
      console.log("msg sent.", res);
    }).catch(function (error) { 
      console.log("send msg error",error);
    });
}

//打开默认浏览器
export const sendRedirect = ( url ) => {
  console.log("try open url in new tab", url);
  ww.openDefaultBrowser({
    url: url,
    success: function(res){
      console.log("open default browser success",res);
    },
    fail: function(res){
      console.log("open default browser fail",res);
    },
    complete: function(res){
      console.log("open default browser complete",res);
    },
  }).then( res => {
    console.log("opend default browser done.", res);
  }).catch(function (error) { 
    console.log("send msg error",error);
  });
}


export const registerWecom = ( corpId, agentId ) => {
  hot.corpId = corpId;
  hot.agentId = agentId;

  ww.register({
    corpId: hot.corpId,       // 必填，当前用户企业所属企业ID
    agentId: hot.agentId,                  // 必填，当前第三方应用的AgentID
    jsApiList: [
        'getExternalContact',
        'sendChatMessage',
        'getContext',
        'getCurExternalContact',
        'getCurExternalChat',
        'openEnterpriseChat',
        'shareToExternalContact',
        'shareToExternalChat',
        'previewFile',
        'openDefaultBrowser',
        'shareToExternalMoments',
    ], // 必填，需要使用的JSAPI列表
    getConfigSignature,                // 必填，根据url生成企业签名的回调函数
    getAgentConfigSignature,            // 必填，根据url生成应用签名的回调函数
  });
}

async function getConfigSignature() {
  // 根据 url 生成企业签名
  // 生成方法参考 https://open.work.weixin.qq.com/api/doc/90001/90144/93197
  let corpId = hot.corpId;
  let url = window.location.href;
  console.log("generate corp auth signature", corpId, url);
  let signature = await getCorpJsConf(corpId, url); 
  console.log("got corp auth signature", signature);
  return signature;
}

async function getAgentConfigSignature() {
  // 根据 url 生成应用签名，生成方法同上，但需要使用应用的 jsapi_ticket
  let corpId = hot.corpId;
  let url = window.location.href;
  console.log("generate corp auth signature", corpId, url);
  let signature = await getSuiteJsConf(corpId, url); 
  console.log("got suite auth signature", signature);
  return signature;
}


//生成企业js签名
export const getCorpJsConf = async (corpId, url) => {
  console.log("generate corp auth signature", corpId, url);
  //提交创建
  let res = await axios
    .post(glob.domainUrl + "/wework/cptp/jsconf-corp/"+SUITE_ID+"/"+corpId,{
      url: url
    },BIZ_CONFIG)
    /**
    .then(res => { 
      console.log("corp auth signature created",res.data);
      return res.data.data;
    })
    .catch(function (error) { 
      console.log("failed generate corp auth signature",error);
      return {
        error: error
      };
    });
    //** */
    console.log("corp auth signature created",res.data);
    return res.data.data;
}

//生成应用js签名
export const getSuiteJsConf = async (corpId, url) => {
  console.log("generate suite auth signature", corpId, url);
  //提交创建
  let res = await axios
    .post(glob.domainUrl + "/wework/cptp/jsconf-suite/"+SUITE_ID+"/"+corpId,{
      url: url
    },BIZ_CONFIG)
    /**
    .then(res => { 
      console.log("suite auth signature created",res.data);
      return res.data.data;
    })
    .catch(function (error) { 
      console.log("failed generate suite auth signature",error);
      return {
        error: error
      };
    });
    //** */
    console.log("suite auth signature created",res.data);
    return res.data.data;
}


//业务数据API
export const bizAPI = {
    solution: {
      get: '/erp/diySolution/queryById', 
      list: '/erp/diySolution/list', 
      save: '/erp/diySolution/add',
      edit: '/erp/diySolution/edit',
      delete: '/erp/diySolution/delete',
    },
}

//调试
export const isDebug: boolean = false;

//接受知识库消息，并自动发送到对话框
export const sendKbMsg = ( msg ) => {
    console.log("try send kb msg", msg);
    window.parent.postMessage({
        action: 'sxSendMsg',
        content: msg.content,
    }, '*');  
}

//复制知识库消息
export const copyKbMsg = ( msg ) => {
  console.log("try send kb msg", msg);
  window.parent.postMessage({
      action: 'sxSendMsg',
      content: msg.content,
  }, '*');  
}

//接受AI生成内容，并自动发送到对话框
export const sendAiMsg = ( msg ) => {
    console.log("try send ai msg", msg);
    window.parent.postMessage({
        action: 'sxSendMsg',
        content: msg.content,
    }, '*');    
}

//装载sop，并通知脚本
export const hookSop = ( sopList ) => {
    console.log("got sop list", sopList);
    //找到沟通sop：sop_type=customer, event_type=timeout-response
    let sop = sopList.find( item => item.sopType=="customer" && item.eventType =="timeout-response");
    if(sop){ //发送给脚本
        window.parent.postMessage({ //交由脚本处理
            action: 'sxSopCustomer',
            sop: sop,
        }, '*'); 
    }else{ 
        console.log("no customer timeout-response threshold found.");
    }   
}

//更新自动回复语
export const hookAutoReply = ( content ) => {
    console.log("got auto reply msg", content);
    localStorage.setItem("sxAutoReply",content);
}

//查询工具条状态，包括工具条设置及用户登录信息
export const checkToolbarStatus = ()=>{
  if(isDebug)console.log("try to check toolbar status..."); 
  var sxToolbarStatus = {};
  try{
    sxToolbarStatus = JSON.parse(localStorage.getItem('sxToolbarStatus') );
  }catch(err){}
  if(isDebug)console.log("try to post toolbar  status to parent document.",sxToolbarStatus);   
  window.parent.postMessage({
    action:'sxToolbarStatus',
    data:{
        toolbarStatus: sxToolbarStatus,
        userInfo: userStore.getUserInfo
    }
  }, '*');    
}

//发送webhook通知
//需要先根据通知类型查询webhook，然后发送
export const sendWebhook = (data) => {
    console.log("TODO: send webhook", data);
    let record = {
        "msgtype": "text",
        "text": {
           "content" :"@"+userStore.getUserInfo.username+" "+ data.content
        }
    };
    //提交创建
    axios
      .post(WEWORK_API + "/wework/ilife/notify-cp-company-broker",record,BIZ_CONFIG)
      .then(res => { 
        console.log("web hook msg sent.",res);
      })
      .catch(function (error) { 
        console.log("failed send web hook msg",error);
      });
}

/**
 * 记录自动回复事件
 * @param data 
 */
export const saveAutoReplyRecord = ( data ) => {
    console.log("try save auto reply record.",data);
    let record = {
      channelName: data.channelName,
      channelType: data.channelType,
      contentType: data.contentType, 
      content: localStorage.getItem("sxAutoReply"),
      fromUser: "Bot(" + userStore.getUserInfo.username+")",
      fromUserId: "bot",
      toUser: data.toUser,
      toUserId: "",
      timeout: (data.autoReplyTimeout - data.startTimeout)/1000, //超时秒数
    }
    console.log("try add auto reply record.",record);
    //提交创建
    axios
      .post(glob.domainUrl + "/erp/crmMessage/add",record,BIZ_CONFIG)
      .then(res => { 
        console.log("auto reply item created.",res);
        //发送webhook通知
        data.content = "客户咨询消息已超时自动回复，请继续跟进客户需求。";
        sendWebhook(data);
      })
      .catch(function (error) { 
        console.log("failed create auto reply item",error);
      });
  }

/**
 * 监听postMessage事件：在助手页面监听宿主页脚本事件
 * 浏览器侧边栏工具将通过PostMessage与页面发生交互
 * 
 */
let loading = false;
export const listenPostMessage = () => {
  if(isDebug)console.log("child window start listening....");
  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  // Listen to message from parent window
  eventer(messageEvent,function(e) {
      var key = e.message ? "message" : "data";
      var data = e[key];
      if(isDebug)console.log("got message from parent window.",data);

      if(data&&data.action){//响应事件处理
          if (data.action == 'sendNotify'){//发送webhook通知
            console.log("send webhook notify...",data.data);
            //发送webhook通知
            data.content = "客户咨询消息即将超时，请尽快回复。";
            sendWebhook(data.data);
          }else if (data.action == 'sendAutoReply') {//发送自动回复通知
            console.log("send webhook notify...",data.data);
            //建立一条自动回复记录，并且发送通知
            saveAutoReplyRecord(data.data);
          }else if (data.action == 'checkToolbarStatus') {//获取工具条状态，包括登录状态及显示状态
            console.log("check toolbar status");
            checkToolbarStatus();
          }else if (data.action == 'setToolbarStatus' && data.data ) {//设置工具条状态
            console.log("set toolbar status");
            localStorage.setItem("sxToolbarStatus", JSON.stringify(data.data))
          }else if (data.action == 'logout' ) {//退出登录
            console.log("logout");
            try{
                doLogout();
            }catch(err){
                console.log("logout failed",err);
            }
          }else {//忽略
            console.log("unkown action", data);
          };
      }
  },false);
}

export const copyToClipboard = (type: string, textToCopy: string) => {
  ClipboardService.writeText(type, textToCopy).then(() => {
    console.log('copy success')
  }).catch(() => console.log('copy failed'));
};

export class ClipboardService {
  public static writeText(type: string, textToCopy: string): Promise<void> {
    return new Promise(
      (resolve, reject): void => {
        let success = false;
        const listener = (e: ClipboardEvent): void => {
          e.clipboardData.setData(type, textToCopy); //格式: text/html, text/plain 
          e.preventDefault();
          success = true;
        };
        // some browser requires selected item
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.select();

        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
        document.body.removeChild(input);
        success ? resolve() : reject();
      },
    );
  }
}
