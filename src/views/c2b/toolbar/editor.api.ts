import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';
import { router } from '/@/router';
import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, WEWORK_API, MP_API, MP_CONFIG, BIZ_API, WXMP_API, WXMP_CONFIG} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';
import { reactive } from 'vue';
import { hostname } from 'os';
import { doLogout} from '/@/api/sys/user';
import { useUserStore } from '/@/store/modules/user';
import { flatMap } from 'lodash-es';
const userStore = useUserStore();

const glob = useGlobSetting();

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
export const isDebug: boolean = true;

//操作界面状态数据
export const hot = reactive({
  replaceContent: true, //记录操作类型，是否需要替换当前内容，对于续写则为添加
  currentContent: "", //记录当前生成的内容
  product: {id: "", name: "", type: "" },

});

//上传公众号图片素材：用于插入小程序卡片时，作为永久素材上传，但不占用永久素材数量
//TBC：当前提示图片不符合规范
export const uploadImageByUrl = (imgUrl) => {
  //直接提交到ilife公众号
  return axios
    .post(WXMP_API+"/upload-media",{
      imgUrl: imgUrl
    }, WXMP_CONFIG);
}

//打开内容链接：在iframe中不能直接完成，需要postMessage 到父窗口
export const openConentLink = ( genRecord ) => {
  console.log("try jump to gen content", genRecord);
  window.parent.postMessage({
      action: 'sxRediret',
      url: genRecord.url,
      // url: MP_API+"/archives/"+genRecord.mediaId,
  }, '*');  
}

//将文字内容替换到正文区域
export const replaceText = ( genRecord ) => {
  console.log("try replace gen content");
  //将内容推送到第三方内容平台
  window.parent.postMessage({
    action: 'sxPublishContent',
    title: "",
    content: genRecord.content,
  }, '*'); 
}

//将文字内容添加到正文区域
export const appendText = ( genRecord ) => {
  console.log("try append gen content");
  //将内容推送到第三方内容平台
  window.parent.postMessage({
    action: 'sxAppendContent',
    title: "",
    content: genRecord.content,
  }, '*'); 
}


//获取并将内容推送到内容平台页面
export const sendGenContent = ( genRecord ) => {
  console.log("try send gen content");
  //从自有内容平台获取内容
  axios
    .get(MP_API + "/wp-json/wp/v2/posts/"+genRecord.mediaId, {
          ...MP_CONFIG,
          params:{}
        })
    .then(res => { 
      console.log("got content.",res);
      //将内容推送到第三方内容平台
      window.parent.postMessage({
          action: 'sxPublishContent',
          title: res.data.title.rendered,
          content: res.data.content.rendered,
      }, '*');  
    })
    .catch(function (error) { 
      console.log("failed get content",error);
    });
}

//获取并将内容复制到剪贴板
export const copyGenContent = ( genRecord ) => {
  console.log("try copy gen content");
  //从自有内容平台获取内容
  axios
    .get(MP_API + "/wp-json/wp/v2/posts/"+genRecord.mediaId, {
          ...MP_CONFIG,
          params:{}
        })
    .then(res => { 
      console.log("got content.",res);
      //将内容复制到剪贴板
      copyToClipboard("text/html", res.data.content.rendered);
    })
    .catch(function (error) { 
      console.log("failed get content",error);
    });
}

//将海报内容组织为html放入剪贴板
export const copyGenPoster = ( genRecord ) => {
  console.log("try copy gen poster");
  //将内容复制到剪贴板
  let html = `
    <p>
      <img src="__imgsrc"/>
    </p>
  `;

  copyToClipboard("text/html", html.replace(/__imgsrc/g, genRecord.url));
}

//接受图片URL，并自动发送到对话框
export const sendImageMsg = ( url ) => {
  console.log("try send img msg", url);
  window.parent.postMessage({
      action: 'sxAppendImage',
      url: url,
  }, '*');  
}

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

//通知脚本打开URL地址
export const sendRedirect = ( url ) => {
    console.log("try open url in new tab", url);
    window.parent.postMessage({
        action: 'sxRediret',
        url: url,
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

//发送AIGC请求
export const aigcGenContent = (data) => {
  console.log("try aigc generate.", data);
  //获取conversation_id
  let conversation_id = localStorage.getItem("sxConversationId") || "";
  let currentContent = data.content;
  //组织prompt： 如果在会话内，则无需带上content，节省tokens
  let query = data.prompt+" "+currentContent;
  if(conversation_id && conversation_id.trim().length>0){
    query = data.prompt;
  }
  //localStorage.setItem("sxCurrentContent", $("#_sxGenContent").val());
  let record = {
    "coversation_id": conversation_id,
    "query": data.prompt+" "+currentContent, 
    "inputs":{},
    "user":"user"+ userStore.getUserInfo?.id,
    "respond_mode":"streaming"
  };
  //提交创建
  axios
    .post(BIZ_API+"/dify/chat-messages",record,BIZ_CONFIG)
    .then(res => { 
      console.log("aigc content generated.",res);
      let answer = res.data.answer;//.replace(/\n/g, "<br/>");
      // //根据prompt类型，分别处理内容到本地缓存
      // if( data.prompt === "续写" ){
      //     currentContent = currentContent + answer;
      // }else{
      //     currentContent = answer;
      // }
      // localStorage.setItem("sxCurrentContent", currentContent ); //设置到缓存
      localStorage.setItem("sxConversationId", res.data.conversation_id ); //设置到缓存
      //发送通知到接收端
      window.parent.postMessage({
        action:'sxAigcAction',
        data:{
            prompt: data.prompt,
            content: answer
        }
      }, '*');  
    })
    .catch(function (error) { 
      console.log("failed request agic",error);
      //发送通知到接收端
      window.parent.postMessage({
        action:'sxAigcAction',
        data:{
            prompt: "续写", //出错时强制认为是续写
            content: "糟糕，出错了，请重新尝试~~"
        }
      }, '*');  
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
          }else if (data.action == 'sxAigcAction' && data.data ) {//AIGC请求内容生成
            console.log("aigc action. ", data.data);
            //调用接口完成内容生成，并将结果存储到本地缓存
            aigcGenContent(data.data);
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