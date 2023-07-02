import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';
import { BIZ_API, BIZ_CONFIG, WEB_API, SUITE_ID, SX_API} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { reactive } from 'vue';
import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();

const glob = useGlobSetting();

//调试
export const isDebug: boolean = false;

//操作界面状态数据
export const hot = reactive({
  tenant: {},//租户信息
  tenantUsers: 0, //租户用户数
  tenantPoints: {}, //租户余额信息
  merchant: {},// 特约商户信息

  salePackage: {},//基础产品套餐：仅一个
  tenantSalePackage: {},//租户订阅的套餐：仅一个
  pricePlans: [], //租户订阅套餐：支持多个
  pricePlanResources: {},//订阅套餐下包含的资源清单

  services: [], //已订阅服务
  templates: [], //已订阅模板
  softwares: [], //已订阅软件/插件/工具

  authCorp: {}, //企业微信授权信息
  authMiniprog: {}, //小程序授权

  currentSalePackage: {}, //当前选中salePackage，切换时修改
  currentPricePlan: {}, //当前选中pricePlan，切换时修改
  currentSoftware: {}, //当前选中APP
});

/**
 * 检查租户订阅详情：包括租户信息、
 */
export const checkTenantMetricsInfo = () => {
  console.log("try check tenant metrics.");
  axios
    .get(glob.domainUrl + "/erp/metrics/summary",{...BIZ_CONFIG,
      params:{
        tenantId: getTenantId(),
      }
    })
    .then(res => { 
      console.log("got tenant metrics.",res);
      if(res.data){
        hot.tenant = res.data.tenant || {};
        if(hot.tenant.createTime){
          hot.tenant.createTime = hot.tenant.createTime.split(" ")[0];
        }
        hot.tenantUsers = res.data.tenantUsers || 0;
        hot.tenantPoints = res.data.tenantPoints || {};
        hot.merchant = res.data.merchant || {};

        hot.salePackage = res.data.salePackage || {};
        hot.tenantSalePackage = res.data.tenantSalePackage || {};
        hot.pricePlans = res.data.pricePlans || [];
        hot.pricePlanResources = res.data.pricePlanResources || [];
        
        hot.services = res.data.services || [];
        hot.templates = res.data.templates || [];
        hot.softwares = res.data.softwares || [];

        hot.authCorp = res.data.authCorp || {};
        hot.authMiniprog = res.data.authMiniprog || {};

        hot.currentSalePackage = res.data.salePackage || {}; //设置当前选中salePackage
        console.log("current hot", hot);
      }
    })
    .catch(function (error) { 
      console.log("failed check tenant metrics.",error);
    });
}

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
        hot.authCorp = res.data.data;
      }
    })
    .catch(function (error) { 
      console.log("failed check auth corp.",error);
    });
}