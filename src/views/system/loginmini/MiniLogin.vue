<template>
  <div :class="prefixCls" class="login-background-img">
    <AppLocalePicker class="absolute top-4 right-4 enter-x xl:text-gray-600" :showText="false"/>
    <AppDarkModeToggle class="absolute top-3 right-7 enter-x" />
    <div class="aui-logo" v-if="!getIsMobile">
      <div>
        <h3>
          <img :src="logoImg" alt="jeecg" />
        </h3>
      </div>
    </div>
    <div v-else class="aui-phone-logo">
      <img :src="logoImg" alt="jeecg" />
    </div>
    <div v-show="type === 'login'">
      <div class="aui-content">
        <div class="aui-container">
          <div class="aui-form">
            <div class="aui-image">
              <div class="aui-image-text">
                <img :src="adTextImg" />
              </div>
            </div>
            <div class="aui-formBox">
              <div class="aui-formWell">
                <div class="aui-flex aui-form-nav investment_title">
                  <div class="aui-flex-box" :class="activeIndex === 'accountLogin' ? 'activeNav on' : ''" @click="loginClick('accountLogin')"
                    >{{ t('sys.login.signInFormTitle') }}
                  </div>
                  <!--
                  <div class="aui-flex-box" :class="activeIndex === 'phoneLogin' ? 'activeNav on' : ''" @click="loginClick('phoneLogin')"
                    >{{ t('sys.login.mobileSignInFormTitle') }}
                  </div>
                  -->
                  <!--需要设置登录type，并且触发二维码显示。通过mousedown、mouseup事件监听完成，其中mousedown在前，mouseup在后，确保次序-->
                  <div class="aui-flex-box" :class="activeIndex === 'weworkLogin' ? 'activeNav on' : ''" @mousedown.native="loginClick('weworkLogin');" @mouseup.native="loginHandleClick"
                    >{{ t('sys.login.weworkSignInFormTitle') }}
                  </div>
                </div>
                <div class="aui-form-box" style="height: 340px">
                  <a-form ref="loginRef" :model="formData" v-if="activeIndex === 'accountLogin'" @keyup.enter.native="loginHandleClick">
                    <div class="aui-account">
                      <div class="aui-inputClear">
                        <i class="icon icon-code"></i>
                        <a-form-item>
                          <a-input class="fix-auto-fill" :placeholder="t('sys.login.userName')" v-model:value="formData.username" />
                        </a-form-item>
                      </div>
                      <div class="aui-inputClear">
                        <i class="icon icon-password"></i>
                        <a-form-item>
                          <a-input class="fix-auto-fill" type="password" :placeholder="t('sys.login.password')" v-model:value="formData.password" />
                        </a-form-item>
                      </div>
                      <div class="aui-inputClear">
                        <i class="icon icon-code"></i>
                        <a-form-item>
                          <a-input class="fix-auto-fill" type="text" :placeholder="t('sys.login.inputCode')" v-model:value="formData.inputCode" />
                        </a-form-item>
                        <div class="aui-code">
                          <img v-if="randCodeData.requestCodeSuccess" :src="randCodeData.randCodeImage" @click="handleChangeCheckCode" />
                          <img v-else style="margin-top: 2px; max-width: initial" :src="codeImg" @click="handleChangeCheckCode" />
                        </div>
                      </div>
                      <div class="aui-flex">
                        <div class="aui-flex-box">
                          <div class="aui-choice">
                            <a-input class="fix-auto-fill" type="checkbox" v-model:value="rememberMe" />
                            <span style="margin-left: 5px">{{ t('sys.login.rememberMe') }}</span>
                          </div>
                        </div>
                        <div class="aui-forget">
                          <a @click="forgetHandelClick"> {{ t('sys.login.forgetPassword') }}</a>
                        </div>
                      </div>
                    </div>
                    <!--登录按钮：仅用于表单登录-->
                    <div class="aui-flex" style="margin-top:40px;">
                      <a-button :loading="loginLoading" class="aui-link-login aui-flex-box" type="primary" @click="loginHandleClick">
                        {{ t('sys.login.loginButton') }}</a-button>
                    </div>
                  </a-form>
                  <!--
                  <a-form v-else ref="phoneFormRef" :model="phoneFormData" @keyup.enter.native="loginHandleClick">
                    <div class="aui-account phone">
                      <div class="aui-inputClear phoneClear">
                        <a-input class="fix-auto-fill" :placeholder="t('sys.login.mobile')" v-model:value="phoneFormData.mobile" />
                      </div>
                      <div class="aui-inputClear">
                        <a-input class="fix-auto-fill" :maxlength="6" :placeholder="t('sys.login.smsCode')" v-model:value="phoneFormData.smscode" />
                        <div v-if="showInterval" class="aui-code" @click="getLoginCode">
                          <a>{{ t('component.countdown.normalText') }}</a>
                        </div>
                        <div v-else class="aui-code">
                          <span class="aui-get-code code-shape">{{ t('component.countdown.sendText', [unref(timeRuning)]) }}</span>
                        </div>
                      </div>
                    </div>
                  </a-form>
                  -->
                  <!--企微二维码-->
                  <a-form ref="weworkFormRef" >
                    <div id="wework_login" v-if="activeIndex === 'weworkLogin'" >

                    </div>
                  </a-form>
                </div>
                <div class="aui-formButton">
                  <!--ilife：已将登录按钮移入表单登录界面，仅限于表单登录界面显示-->
                  <!--
                  <div class="aui-flex">
                    <a-button :loading="loginLoading" class="aui-link-login aui-flex-box" type="primary" @click="loginHandleClick">
                      {{ t('sys.login.loginButton') }}</a-button>
                  </div>
                  -->
                  <!--ilife：禁止其他登录方式-->
                  <!--
                  <div class="aui-flex">
                    <a class="aui-linek-code aui-flex-box" @click="codeHandleClick">{{ t('sys.login.qrSignInFormTitle') }}</a>
                  </div>
                  <div class="aui-flex">
                    <a class="aui-linek-code aui-flex-box" @click="registerHandleClick">{{ t('sys.login.registerButton') }}</a>
                  </div>
                  -->
                </div>
              </div>
              <!--禁用第三方登录-->

              <a-form @keyup.enter.native="loginHandleClick">
                <!--
                <div class="aui-flex aui-third-text">
                  <div class="aui-flex-box aui-third-border">
                    <span>{{ t('sys.login.otherSignIn') }}</span>
                  </div>
                </div>
                <div class="aui-flex" :class="`${prefixCls}-sign-in-way`">
                  <div class="aui-flex-box">
                    <div class="aui-third-login">
                      <a title="github" @click="onThirdLogin('github')"><GithubFilled /></a>
                    </div>
                  </div>
                  <div class="aui-flex-box">
                    <div class="aui-third-login">
                      <a title="企业微信" @click="onThirdLogin('wechat_enterprise')"><icon-font class="item-icon" type="icon-qiyeweixin3" /></a>
                    </div>
                  </div>
                  <div class="aui-flex-box">
                    <div class="aui-third-login">
                      <a title="钉钉" @click="onThirdLogin('dingtalk')"><DingtalkCircleFilled /></a>
                    </div>
                  </div>
                  <div class="aui-flex-box">
                    <div class="aui-third-login">
                      <a title="微信" @click="onThirdLogin('wechat_open')"><WechatFilled /></a>
                    </div>
                  </div>
                </div>
                -->
              </a-form>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="type === 'forgot'" :class="`${prefixCls}-form`">
      <MiniForgotpad ref="forgotRef" @go-back="goBack" @success="handleSuccess" />
    </div>
    <div v-show="type === 'register'" :class="`${prefixCls}-form`">
      <MiniRegister ref="registerRef" @go-back="goBack" @success="handleSuccess" />
    </div>
    <div v-show="type === 'codeLogin'" :class="`${prefixCls}-form`">
      <MiniCodelogin ref="codeRef" @go-back="goBack" @success="handleSuccess" />
    </div>
    <!-- 第三方登录相关弹框 -->
    <ThirdModal ref="thirdModalRef"></ThirdModal>
  </div>
</template>
<script lang="ts" setup name="login-mini">
  import { getCaptcha, getCodeInfo } from '/@/api/sys/user';
  import { computed, onMounted, reactive, ref, toRaw, unref } from 'vue';
  import codeImg from '/@/assets/images/checkcode.png';
  import { Rule } from '/@/components/Form';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { SmsEnum } from '/@/views/sys/login/useLogin';
  import ThirdModal from '/@/views/sys/login/ThirdModal.vue';
  import MiniForgotpad from './MiniForgotpad.vue';
  import MiniRegister from './MiniRegister.vue';
  import MiniCodelogin from './MiniCodelogin.vue';
  import logoImg from '/@/assets/loginmini/icon/jeecg_logo.png';
  import adTextImg from '/@/assets/loginmini/icon/jeecg_ad_text.png';
  import { AppLocalePicker, AppDarkModeToggle } from '/@/components/Application';
  import { useLocaleStore } from '/@/store/modules/locale';
  import { useDesign } from "/@/hooks/web/useDesign";
  import { useAppInject } from "/@/hooks/web/useAppInject";
  import { GithubFilled, WechatFilled, DingtalkCircleFilled, createFromIconfontCN } from '@ant-design/icons-vue';

  import {WEB_API, PROVIDER_SUITE_ID, SUITE_ID} from '/@/settings/iLifeSetting';
  import * as ww from '@wecom/jssdk'; //引入企业微信jssdk

  const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2316098_umqusozousr.js',
  });
  const { prefixCls } = useDesign('mini-login');
  const { notification, createMessage } = useMessage();
  const userStore = useUserStore();
  const { t } = useI18n();
  const localeStore = useLocaleStore();
  const showLocale = localeStore.getShowPicker;
  const randCodeData = reactive<any>({
    randCodeImage: '',
    requestCodeSuccess: false,
    checkKey: null,
  });
  const rememberMe = ref<string>('0');
  //手机号登录还是账号登录
  const activeIndex = ref<string>('accountLogin');
  const type = ref<string>('login');
  //账号登录表单字段
  const formData = reactive<any>({
    inputCode: '',
    username: 'admin',
    password: '123456',
  });
  //手机登录表单字段
  const phoneFormData = reactive<any>({
    mobile: '',
    smscode: '',
  });
  const loginRef = ref();
  //第三方登录弹窗
  const thirdModalRef = ref();
  //扫码登录
  const codeRef = ref();
  //是否显示获取验证码
  const showInterval = ref<boolean>(true);
  //60s
  const timeRuning = ref<number>(60);
  //定时器
  const timer = ref<any>(null);
  //忘记密码
  const forgotRef = ref();
  //注册
  const registerRef = ref();
  const loginLoading = ref<boolean>(false);
  const { getIsMobile } = useAppInject();

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  /**
   * 获取验证码
   */
  function handleChangeCheckCode() {
    formData.inputCode = '';

    randCodeData.checkKey = 1629428467008;
    getCodeInfo(randCodeData.checkKey).then((res) => {
      randCodeData.randCodeImage = res;
      randCodeData.requestCodeSuccess = true;
    });
  }

  /**
   * 切换登录方式
   */
  function loginClick(type) {
    console.log("change login type.",type);
    activeIndex.value = type;
  }

  /**
   * 账号或者手机登录
   */
  async function loginHandleClick() {
    if (unref(activeIndex) === 'accountLogin') {
      accountLogin();
    }else if (unref(activeIndex) === 'weworkLogin') { //企业微信登录
      weworkLogin();
    } else {
      //手机号登录
      phoneLogin();
    }
  }

  async function accountLogin() {
    if (!formData.username) {
      createMessage.warn(t('sys.login.accountPlaceholder'));
      return;
    }
    if (!formData.password) {
      createMessage.warn(t('sys.login.passwordPlaceholder'));
      return;
    }
    try {
      loginLoading.value = true;
      const { userInfo } = await userStore.login(
        toRaw({
          password: formData.password,
          username: formData.username,
          captcha: formData.inputCode,
          checkKey: randCodeData.checkKey,
          mode: 'none', //不要默认的错误提示
        })
      );
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realname}`,
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: t('sys.api.errorTip'),
        description: error.message || t('sys.login.networkExceptionMsg'),
        duration: 3,
      });
      handleChangeCheckCode();
    } finally {
      loginLoading.value = false;
    }
  }

  /**
   * iLife：检查登录来源。支持toolbar从浏览器侧边栏进入登录界面。登录完成后直接跳转到目标页
   * 通过 localStorage 传递信息
   */
  function checkLoginOrigin(){
    let from = document.referrer;
    if( from && from.indexOf("/editor")>0){ //内容插件
      console.log("oring is editor.", from);
      localStorage.setItem("sxLoginOrigin", "editor"); //记录登录入口
      localStorage.setItem("sxLoginState", "editor"); //记录目标地址：浏览器插件仅一个单一地址，区分不同的浏览器插件即可
    }else if( from && from.indexOf("/helper")>0){ //OTA及电商插件
      console.log("oring is helper.", from);
      localStorage.setItem("sxLoginOrigin", "helper"); //记录登录入口
      localStorage.setItem("sxLoginState", "helper"); //记录目标地址：浏览器插件仅一个单一地址，区分不同的浏览器插件即可
    }else{ //
      console.log("ignore login origin.", from);
    }
  }

  /**
   * 企业微信登录
   * 支持网页端通过企业微信登录面板扫码授权完成登录
   */
  function weworkLogin() {
    console.log("start generate wework login panel.", ww.SDK_VERSION);
    // 判断来源：toolbar、helper、sidebar
    let to = WEB_API+'/c2b/toolbar/sidebar'; //'/dashboard/analysis'; //默认到dashboard
    let from = document.referrer;
    if( from && from.indexOf("/editor")>0){ //内容插件
      to = from; // '/c2b/toolbar/editor';
      localStorage.setItem("sxLoginOrigin", "editor"); //记录登录入口
      localStorage.setItem("sxLoginState", "editor"); //记录目标地址：浏览器插件仅一个单一地址，区分不同的浏览器插件即可
    }else if( from && from.indexOf("/helper")>0){ //OTA及电商插件
      to = from; // '/c2b/toolbar/helper';
      localStorage.setItem("sxLoginOrigin", "helper"); //记录登录入口
      localStorage.setItem("sxLoginState", "helper"); //记录目标地址：浏览器插件仅一个单一地址，区分不同的浏览器插件即可
    }else if( from && from.indexOf("/sidebar")>0){ //企微侧边栏
      to = from; // '/c2b/toolbar/sidebar'; //sidebar不会进入此逻辑，将直接进入OAuth2Login
      // localStorage.setItem("sxLoginOrigin", "sidebar"); //记录登录入口
      // localStorage.setItem("sxLoginState", "sidebar"); //记录目标地址：浏览器插件仅一个单一地址，区分不同的浏览器插件即可
    }
    // 初始化
    const wwLogin = ww.createWWLoginPanel({
      el: '#wework_login',
      params: {
        login_type: 'ServiceApp', 
        appid: PROVIDER_SUITE_ID,//注意，是登录授权 suite_id,
        //agentid: '10000xx',
        //redirect_uri: WEB_API+'/dashboard/analysis', //默认跳转到到首页:TODO 有问题，需要跳转到TAB对应的页面
        redirect_uri: to, //默认跳转到相应界面
        state: 'dashboard',
        redirect_type: 'callback', //需要在回调内检查用户信息并完成登录
        panel_size: 'small', //middle: 默认 480x416px, small:小尺寸: 320x380px
      },
      onCheckWeComLogin({ isWeComLogin }) {
        console.log("onCheckWeComLogin",isWeComLogin)
      },
      onLoginSuccess({ code }) {
        //检查本地登录设置
        let state = "home";//默认为home
        if ( localStorage.getItem("sxLoginState") && localStorage.getItem("sxLoginState").trim().length>0 )
          state = localStorage.getItem("sxLoginState") ;
        //根据code完成登录
        console.log("onLoginSuccess",{ code })
        weworkThirdLogin({//传递suiteId、code、state完成企业微信登录
          suiteId: PROVIDER_SUITE_ID, //注意这里使用服务商suite_id完成登录
          code: code,
          state: state, //"home", //跳转到用户首页
          thirdType: "wework"
        });
      },
      onLoginFail(err) {
        notification.error({
          message: t('sys.login.weworkLoginFailTitle'),
          description: `${t('sys.login.weworkLoginFailDesc')}`,
          duration: 3,
        });
        console.log("onLoginFail",err)
      },
    })
    // 卸载
    //wwLogin.unmount()
  }
  /**
   * 通过第三方登录完成企业微信扫码过程
   * @param params
   */
   function weworkThirdLogin(params) {
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
          message: t('sys.login.errorTip'),
          description: ((res.response || {}).data || {}).message || res.message || t('sys.login.networkExceptionMsg'),
          duration: 4,
        });
      }
    });
  }  
  /**
   * 手机号登录
   */
  async function phoneLogin() {
    if (!phoneFormData.mobile) {
      createMessage.warn(t('sys.login.mobilePlaceholder'));
      return;
    }
    if (!phoneFormData.smscode) {
      createMessage.warn(t('sys.login.smsPlaceholder'));
      return;
    }
    try {
      loginLoading.value = true;
      const { userInfo }: any = await userStore.phoneLogin({
        mobile: phoneFormData.mobile,
        captcha: phoneFormData.smscode,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realname}`,
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: t('sys.api.errorTip'),
        description: error.message || t('sys.login.networkExceptionMsg'),
        duration: 3,
      });
    } finally {
      loginLoading.value = false;
    }
  }

  /**
   * 获取手机验证码
   */
  async function getLoginCode() {
    if (!phoneFormData.mobile) {
      createMessage.warn(t('sys.login.mobilePlaceholder'));
      return;
    }
    const result = await getCaptcha({ mobile: phoneFormData.mobile, smsmode: SmsEnum.FORGET_PASSWORD });
    if (result) {
      const TIME_COUNT = 60;
      if (!unref(timer)) {
        timeRuning.value = TIME_COUNT;
        showInterval.value = false;
        timer.value = setInterval(() => {
          if (unref(timeRuning) > 0 && unref(timeRuning) <= TIME_COUNT) {
            timeRuning.value = timeRuning.value - 1;
          } else {
            showInterval.value = true;
            clearInterval(unref(timer));
            timer.value = null;
          }
        }, 1000);
      }
    }
  }

  /**
   * 第三方登录
   * @param type
   */
  function onThirdLogin(type) {
    thirdModalRef.value.onThirdLogin(type);
  }

  /**
   * 忘记密码
   */
  function forgetHandelClick() {
    type.value = 'forgot';
    setTimeout(() => {
      forgotRef.value.initForm();
    }, 300);
  }

  /**
   * 返回登录页面
   */
  function goBack() {
    activeIndex.value = 'accountLogin';
    type.value = 'login';
  }

  /**
   * 忘记密码/注册账号回调事件
   * @param value
   */
  function handleSuccess(value) {
    Object.assign(formData, value);
    Object.assign(phoneFormData, { mobile: "", smscode: "" });
    type.value = 'login';
    activeIndex.value = 'accountLogin';
    handleChangeCheckCode();
  }

  /**
   * 注册
   */
  function registerHandleClick() {
    type.value = 'register';
    setTimeout(() => {
      registerRef.value.initForm();
    }, 300);
  }

  /**
   * 注册
   */
  function codeHandleClick() {
    type.value = 'codeLogin';
    setTimeout(() => {
      codeRef.value.initFrom();
    }, 300);
  }

  onMounted(() => {
    //加载验证码
    handleChangeCheckCode();
    //iLife: 记录登录源头
    checkLoginOrigin();
  });
</script>

<style lang="less" scoped>
  @import '/@/assets/loginmini/style/home.less';
  @import '/@/assets/loginmini/style/base.less';

  :deep(.ant-input:focus) {
    box-shadow: none;
  }
  .aui-get-code {
    float: right;
    position: relative;
    z-index: 3;
    background: #ffffff;
    color: #1573e9;
    border-radius: 100px;
    padding: 5px 16px;
    margin: 7px;
    border: 1px solid #1573e9;
    top: 12px;
  }

  .aui-get-code:hover {
    color: #1573e9;
  }

  .code-shape {
    border-color: #dadada !important;
    color: #aaa !important;
  }

  :deep(.jeecg-dark-switch){
    position:absolute;
    margin-right: 10px;
  }
  .aui-link-login{
    height: 42px;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 8px;
    margin-top: 15px;
    margin-bottom: 8px;
  }
  .aui-phone-logo{
    position: absolute;
    margin-left: 10px;
    width: 60px;
    top:2px;
    z-index: 4;
  }
  .top-3{
    top: 0.45rem;
  }
</style>

<style lang="less">
@prefix-cls: ~'@{namespace}-mini-login';
@dark-bg: #293146;

html[data-theme='dark'] {
  .@{prefix-cls} {
    background-color: @dark-bg !important;
    background-image: none;

    &::before {
      background-image: url(/@/assets/svg/login-bg-dark.svg);
    }
    .aui-inputClear{
      background-color: #232a3b !important;
    }
    .ant-input,
    .ant-input-password {
      background-color: #232a3b !important;
    }

    .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
      border: 1px solid #4a5569 !important;
    }

    &-form {
      background: @dark-bg !important;
    }

    .app-iconify {
      color: #fff !important;
    }
    .aui-inputClear input,.aui-input-line input,.aui-choice{
      color: #c9d1d9 !important;
    }

    .aui-formBox{
      background-color: @dark-bg !important;
    }
    .aui-third-text span{
      background-color: @dark-bg !important;
    }
    .aui-form-nav .aui-flex-box{
      color: #c9d1d9 !important;
    }

    .aui-formButton .aui-linek-code{
      background:  @dark-bg !important;
      color: white !important;
    }
    .aui-code-line{
      border-left: none !important;
    }
    .ant-checkbox-inner,.aui-success h3{
      border-color: #c9d1d9;
    }
  }

  input.fix-auto-fill,
  .fix-auto-fill input {
    -webkit-text-fill-color: #c9d1d9 !important;
    box-shadow: inherit !important;
  }

  &-sign-in-way {
    .anticon {
      font-size: 22px !important;
      color: #888 !important;
      cursor: pointer !important;

      &:hover {
        color: @primary-color !important;
      }
    }
  }
  .ant-divider-inner-text {
    font-size: 12px !important;
    color: @text-color-secondary !important;
  }
  .aui-third-login a{
    background: transparent;
  }
}
</style>
