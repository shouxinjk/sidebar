import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';
import { router } from '/@/router';
import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, WEB_API, SUITE_ID} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';
import { reactive } from 'vue';
import { hostname } from 'os';
import { doLogout} from '/@/api/sys/user';
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();

const glob = useGlobSetting();

//调试
export const isDebug: boolean = false;

//操作界面状态数据
export const hot = reactive({
  showAuthUrl: true,//预授权链接
  authCorp: {}, //已授权企业微信
  sidebar:[],//侧边栏列表
});

export const sidebarName = {
  solution: "方案库",
  kb:"知识库",
  ai:"AI生成",
  note:"笔记库",
  product: "产品库",
};
export const sidebarDesc = {
  solution: "显示所有定制方案列表，能够直接发送图文到聊天对话框",
  kb:"显示知识库内容，支持搜索，能够快速发送到聊天对话框",
  ai:"支持AI自动生成，能够根据客户问答快速生成回复，并且支持发送到聊天对话框",
  note:"显示所有笔记内容，能够直接发送给客户或客户群，支持客户编辑内容",
  product: "显示自有产品列表，能够发送到聊天对话框，方便快速回复客户。支持下单链接及二维码。",
};
export const sidebarOauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=__SUITE_ID&agentid=__AGENT_ID&redirect_uri=__URI&response_type=code&scope=snsapi_base&state=__STATE#wechat_redirect";
export const sidebarUrl = WEB_API+"/c2b/toolbar/sidebar?tab=__TYPE&corpId=__CORPID&agentId=__AGENTID" ;//https%3A//air.biglistoflittlethings.com/c2b/toolbar/sidebar%3Ftab%3Dsolution
export const sidebarTpl = { //侧边栏模板
  url: "",
  name: "",
};

/**
 * 根据当前用户tenantId查询是否已经存在企业微信授权
 */
export const checkAuthCorpInfo = () => {
  console.log("try check auth corp.");
  axios
    .post( glob.domainUrl + "/wework/cptp/auth-corp/"+SUITE_ID,{
      tenantId: getTenantId(),
    },{})
    .then(res => { 
      console.log("got auth corp.",res);
      if(res.data && res.data.success){
        hot.showAuthUrl = false;
        hot.authCorp = res.data.data;
      }
    })
    .catch(function (error) { 
      console.log("failed check auth corp.",error);
    });
}

/**
 * 根据当前用户tenantId查询已经授权的Agent信息，用于构建侧边栏URL
 */
export const checkAuthCorpInfoExt = () => {
  console.log("try check auth corp extend.");
  axios
    .post( glob.domainUrl + "/wework/cptp/auth-corp-extend/"+SUITE_ID,{
      tenantId: getTenantId(),
    },{})
    .then(res => { 
      console.log("got auth corp extend.",res);
      if(res.data && res.data.success && res.data.data){
        //装载侧边栏URL列表，包括方案库、知识库、AI助手、笔记库、产品库等，可由管理员自行添加
        hot.sidebar = [];
        //仅处理agentId最大的一个：应用重新安装后agentId将自增长
        res.data.data.sort((a, b) => {  //根据agentId排序，
          return a.agentId - b.agentId
        });
        let corpId = res.data.data[res.data.data.length-1].corpId; //取最大的一个
        let agentId = res.data.data[res.data.data.length-1].agentId; //取最大的一个
        Object.keys(sidebarName).forEach( type => {
          let url = sidebarUrl.replace(/__TYPE/g,type).replace(/__AGENTID/g,""+agentId).replace(/__CORPID/g,corpId);
          let oauthUrl = sidebarOauthUrl.replace(/__SUITE_ID/g, SUITE_ID)
                                        .replace(/__AGENT_ID/g,""+agentId)
                                        .replace(/__URI/g,""+encodeURIComponent(url))
                                        .replace(/__STATE/g,corpId+"__"+agentId);
          hot.sidebar.push({
            name: sidebarName[type],
            desc: sidebarDesc[type],
            url: oauthUrl,
          });

        });
      }
    })
    .catch(function (error) { 
      console.log("failed check auth corp extend.",error);
    });
}

/**
 * 获取预授权链接
 * @param e 
 * @returns 
 */
export const getPreAuthUrl = () => { 
  console.log("try get pre auth url.",BIZ_CONFIG);
  axios
    .post( glob.domainUrl + "/wework/cptp/pre-auth-url/"+SUITE_ID,{
      url: WEB_API+"/settings/wework", //回到企业微信设置界面
      state: "auth",
    },BIZ_CONFIG)
    .then(res => { 
      console.log("got pre auth url.",res);
      //跳转到授权地址
      window.location.href = res.data.data;
    })
    .catch(function (error) { 
      console.log("failed get pre auth url",error);
    });
}

/**
 * 获取永久授权码
 * @param authCode 临时授权码
 * @returns 
 */
export const getPermanentCode = ( authCode ) => { 
  console.log("try get permanent code.",BIZ_CONFIG);
  axios
    .post( glob.domainUrl + "/wework/cptp/permanent-code/"+SUITE_ID,{
      authCode: authCode, //回到企业微信设置界面
    },BIZ_CONFIG)
    .then(res => { 
      console.log("got permanent code.",res);
    })
    .catch(function (error) { 
      console.log("failed get permanent code.",error);
    });
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