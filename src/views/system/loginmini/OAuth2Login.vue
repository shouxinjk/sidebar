<template>
  <div> </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { isOAuth2AppEnv, sysOAuth2Login } from '/@/views/sys/login/useLogin';
  import { useRouter } from 'vue-router';
  import { PageEnum } from '/@/enums/pageEnum';
  import { router } from '/@/router';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { SUITE_ID } from '/@/settings/iLifeSetting';
  import { getUrlParam } from '/@/utils';
  const userStore = useUserStore();

  const isOAuth = ref<boolean>(isOAuth2AppEnv());
  const env = ref<any>({ thirdApp: false, wxWork: false, wework:false, dingtalk: false });
  const { currentRoute } = useRouter();
  const route = currentRoute.value;
  if (!isOAuth2AppEnv()) {
    router.replace({ path: PageEnum.BASE_LOGIN, query: route.query });
  }

  if (isOAuth.value) {
    checkEnv();
  }

  /**
   * 检测当前的环境
   * ilife: 采用单一路径判定，单次进入时通过 if-else检查
   */
  function checkEnv() {
    /**
    // 判断当时是否是企业微信环境
    if (/wxwork/i.test(navigator.userAgent)) {
      env.value.thirdApp = true;
      env.value.wxWork = true;
    }
    // 判断当时是否是钉钉环境
    if (/dingtalk/i.test(navigator.userAgent)) {
      env.value.thirdApp = true;
      env.value.dingtalk = true;
    }
    //** */
    console.log("check oauth2 env", route.query, window.location.href);
    if (/wxwork/i.test(navigator.userAgent) && route.query.device==="sidebar" && route.query.tab ) {     // 企微侧边栏专用路径：通过origin及tab参数判定
      //企微侧边栏进入：解决发布后在history模式下无法找到/c2b/toolbar/sidebar路由情况：
      //将/c2b/toolbar/sidebar配置到基础路由，侧边栏入口配置为进入OAuth2Login，登录完成后跳转到对应sidebar页面
      //带有参数:corpId, agentId, device=sidebar, tab
      //企微侧边栏配置形式：https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww49d117960f664305&agentid=1000049&redirect_uri=https%3A%2F%2Fsidebar.biglistoflittlethings.com%2Fc2b%2Ftoolbar%2Fsidebar%3Ftab%3Dall%26corpId%3Dww0c1081973d35aa17%26agentId%3D1000049&response_type=code&scope=snsapi_base&state=ww0c1081973d35aa17__1000049#wechat_redirect
      //侧边栏进入时，只要登录一次，即可直接跳转
      let loginInfo = userStore.getLoginInfo;
      if( loginInfo && loginInfo.isLogin ){ //表示已经登陆过，直接跳转即可
        let sidebarParams = {
              tab: route.query.tab,
              corpId: route.query.corpId,
              agentId: route.query.agentId
            };
            console.log("sxToolbar:sidebar. try nav to /c2b/toolbar/sidebar", sidebarParams);
            // await router.replace("/c2b/toolbar/sidebar"); //sidebar界面自动检查 localStorage，得到tab参数
            router.replace({path: "/c2b/toolbar/sidebar",query: sidebarParams});
      }else{
        //记录入口参数
        localStorage.setItem("sxLoginDevice", "sidebar");//固定为sidebar类型
        localStorage.setItem("sxLoginState", route.query.tab );//从参数中获取tab类型
        localStorage.setItem("sxSidebarCorpId", route.query.corpId );//corpId
        localStorage.setItem("sxSidebarAgentId", route.query.agentId );//agentId
        env.value.thirdApp = true;
        env.value.wework = true;
      }
    }else if (/wxwork/i.test(navigator.userAgent)  && route.query.device==="workplace"  ) {     // 企微工作台专用路径：device设置为
      //企微后台配置入口带有参数
      localStorage.setItem("sxLoginDevice", "workplace");//固定为workplace
      localStorage.setItem("sxLoginState", route.query.tab);//能够通过tab参数指定目标页面：subscriptions, wework, dashbaord等
      env.value.thirdApp = true;
      env.value.wework = true;
    }else if (/wxwork/i.test(navigator.userAgent)) {     // 其他企业微信登录情况
      env.value.thirdApp = true;
      env.value.wework = true;
    }/*
    else if (/wxwork/i.test(navigator.userAgent)) {     // 判断当时是否是企业微信环境：自建应用。不支持
      env.value.thirdApp = true;
      env.value.wxWork = true;
    }//** */
    else if (/dingtalk/i.test(navigator.userAgent)) {     // 判断当时是否是钉钉环境
      env.value.thirdApp = true;
      env.value.dingtalk = true;
    }    
    doOAuth2Login();
  }

  /**
   * 进行OAuth2登录操作
   */
  function doOAuth2Login() {
    if (env.value.thirdApp) {
      // 判断是否携带了Token，是就说明登录成功
      if (route.query.oauth2LoginToken) {
        console.log("third login done with token.", route.query);
        let token = route.query.oauth2LoginToken;
        //执行登录操作：增加登录环境判断，支持其业微信工作台入口
        //企业微信工作台PC端：进入到air，显示桌面版。直接用token换取用户信息完成PC端登录。进入是带有参数：state=pc，需要配置到应用后台
        //其业微信工作台手机端：进入sidebar，显示移动端界面，在sidebar内完成后续登录。进入时带有参数：state=mobile，需要配置到应用后台
        //TODO：增加判断，如果是桌面环境，则跳转到air下，根据token获取用户信息
        //获取登录上下文：
        let sxLoginDevice = localStorage.getItem("sxLoginDevice");
        console.log("got login state.", sxLoginDevice);
        if( sxLoginDevice === "pc" || sxLoginDevice === "workplace"){ //PC端跳转到air桌面，从企微工作台进入跳转到air桌面
          let url = window.location.href.replace(/sidebar\./g,"air.");//跳转到air
          window.location.href = url; //直接跳转
        }else if( sxLoginDevice === "mobile" ){ //移动端，直接获取登录信息，并接入相应界面
          thirdLogin({ token, thirdType: route.query.thirdType });
        }else{ //从sidebar等进入，则直接完成登录，在afterlogin中完成跳转
          thirdLogin({ token, thirdType: route.query.thirdType });
        }
        
      }else if (env.value.wework && route.query.code ) { // 企微服务商服务商模式：带有code及state，获取用户信息并完成登录。适用于侧边栏菜单，配置URL为构建好的oauth链接
        let code = route.query.code;
        let state = route.query.state;
        console.log("route.query.",route.query);
        console.log("wework login with code and state.",SUITE_ID, code, state, window.location.href);
        //判断是否是从企微侧边栏进入，根据地址是否为toolbar地址判定。经过微信跳转的企微侧边栏地址为：
        //https://sidebar.biglistoflittlethings.com/c2b/toolbar/sidebar?tab=solution&corpId=ww0c1081973d35aa17&agentId=1000038&code=xxx&state=xxx
        if ( window.location.href.indexOf("/toolbar") > 0 ){
          console.log("got sidebar url", route.query.tab, window.location.href );
          localStorage.setItem("sxLoginOrigin", "sidebar");//记录登录入口为sidebar
          //记录登录目标tab信息，记录在redirectUrl中的tab参数内，直接提取即可
          if( getUrlParam("tab") && getUrlParam("tab").trim().length>0)
            localStorage.setItem("sxLoginState", getUrlParam("tab"));//从参数中获取tab类型
        }else{ //注意，避免影响企微工作台入口情景，清除
          //do nothing
        }

        //执行登录操作
        thirdLogin({ //传递suiteId、code、state完成企业微信登录
          suiteId: SUITE_ID,
          code: code,
          state: state,
          thirdType: "wework" }); 
      } else if (env.value.wework) { //企业微信服务商模式：从PC企业微信或手机端企业微信 工作台进入 SaaS，需要先构建oauth授权链接再完成登录
        console.log("wework init login without code.", route.query);
        //判断state参数：从工作台进入时，移动端state=mobile，PC端state=pc；从侧边栏进入时，state为toolbar下特定编码，且redirect路径包含toolbar
        localStorage.removeItem("sxLoginContext"); //认为是初次进入，清除登录记录
        if( route.query.state ){
          localStorage.setItem("sxLoginDevice", ""+route.query.state); //从服务端配置时需要指定state参数
        }
        sysOAuth2Login('wework');
      } else if (env.value.wxWork) { //预留。当前未启用
        sysOAuth2Login('wechat_enterprise');
      } else if (env.value.dingtalk) { //预留。当前未启用
        sysOAuth2Login('dingtalk');
      }
    }
  }

  /**
   * 第三方登录
   * @param params
   */
  function thirdLogin(params) {
    const userStore = useUserStore();
    const { notification } = useMessage();
    const { t } = useI18n();
    userStore.ThirdLogin(params)
      .then((res) => {
        if (res && res.userInfo) {
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${res.userInfo.realname}`,
            duration: 3,
          });
        } else {
          notification.error({
            message: t('sys.login.errorTip'),
            description: ((res.response || {}).data || {}).message || res.message || t('sys.login.networkExceptionMsg'),
            duration: 4,
          });
        }
      })
      .catch( error => {
        console.log("thirdLogin failed with exeption.", params, error);
      }).finally( () => {
        console.log("thirdLogin finally.", params);
      });
  }
</script>