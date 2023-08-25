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

  const isOAuth = ref<boolean>(isOAuth2AppEnv());
  const env = ref<any>({ thirdApp: false, wxWork: false, dingtalk: false });
  const { currentRoute } = useRouter();
  const route = currentRoute.value;

  console.log("OAuth2Login.vue check route query", window.location.href, route.query);

  if (!isOAuth2AppEnv()) {
    router.replace({ path: PageEnum.BASE_LOGIN, query: route.query });
  }

  if (isOAuth.value) {
    checkEnv();
  }

  /**
   * 检测当前的环境
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
    if (/wxwork/i.test(navigator.userAgent) /* && route.query.code  && route.query.state */  ) {     // 判断当时是否是企业微信环境：服务商。
      //当前判断不严格：受限于应用场景，与企微侧边栏配置保持一致。企微侧边栏配置中直接通过oauth链接获取code和state后进入SaaS
      //企微侧边栏配置需要带入授权企业的corpId及agentId信息，可以据此判定是服务商应用，state结构为 corpId__agentId
      //let stateInfo = route.query.state.toString().split("__");
      //if(stateInfo.length>0)sessionStorage.setItem("corpId",stateInfo[0]);
      //if(stateInfo.length>1)sessionStorage.setItem("agentId",stateInfo[1]);
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
   * ilife：区分进入入口
   * 1）企微侧边栏：redirectUrl包含toolbar，并且state 为特定指向。在配置时直接构建oauth链接
   * 2）企微工作台PC端： state=pc 配置为主页： https://sidebar.biglistoflittlethings.com?state=pc
   * 3）企微工作台手机端：state=mobile 配置为主页： https://sidebar.biglistoflittlethings.com?state=mobile
   * 4）
   *
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
        if( sxLoginDevice === "pc" ){ //PC端跳转到air桌面
          let url = window.location.href.replace(/sidebar\./g,"air.");//跳转到air
          window.location.href = url; //直接跳转
        }else if( sxLoginDevice === "mobile" ){ //移动端，直接获取登录信息，并接入相应界面
          thirdLogin({ token, thirdType: route.query.thirdType });
        }else{
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
    userStore.ThirdLogin(params).then((res) => {
      if (res && res.userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${res.userInfo.realname}`,
          duration: 3,
        });
      } else {
        notification.error({
          message: '登录失败',
          description: ((res.response || {}).data || {}).message || res.message || '请求出现错误，请稍后再试',
          duration: 4,
        });
      }
    });
  }
</script>