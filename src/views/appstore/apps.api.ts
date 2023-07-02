import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';

import {SEARCH_API, SEARCH_CONFIG, PLATFORM_TENANT, BIZ_CONFIG, SX_API} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';

const glob = useGlobSetting();

//业务数据API
export const bizAPI = {
    "listApps": '/erp/stoSoftware/list',
    "listServices": '/erp/stoService/list',
    "listPricePlans": '/erp/stoPricePlan/list',
    "listTemplates": '/erp/modViewTemplate/list',
    "listConnectorSchemes": '/erp/stoConnectorScheme/list',
    "listConnectorSchemesByType": '/erp/stoConnectorScheme/list-by-type',
    "listConnectors": '/erp/stoConnector/list',
    "listConnectorsByType": '/erp/stoConnector/list-by-type',
}

//调试
export const isDebug: boolean = false;



/**
 * 根据out_trade_no检查支付状态
 * 采用计时器在显示支付二维码之后开始循环检查。获取检查结果后显示提示信息并关闭抽屉
 */
let paycheckTimer = null;
let paycheckInterval = 1200;
let paycheckIntervalCount = 15 * 60 * 1000 / paycheckInterval; //倒计时15分钟，超出则取消
export const checkPayResult = ( out_trade_no ) => {
  console.log("try check pay result by out_trade_no.",out_trade_no);
  //开始一个计时器
  paycheckTimer = setInterval(function(){
      console.log("try check pay result by out_trade_no.",out_trade_no, new Date().getTime());
      if(paycheckIntervalCount<0){
        console.log("timeout cancel interval.");
        clearInterval(paycheckTimer);
        paycheckTimer = null;
        return;
      }
      axios
      .post( SX_API + "/wxPay/rest/pay-result/"+out_trade_no,{},{})
      .then(res => { 
        console.log("got pay result.",res);
        if(res.data && res.data.success && res.data.data && res.data.data.tradeState==="SUCCESS"){
          clearInterval(paycheckTimer);
          paycheckTimer = null;
          //提示已经获取支付结果
          console.log("todo close drawer and show tips.");
          //通过触发按钮事件完成
          let amisBtn = document.querySelector('.__sx__btn__closeDialog>span');
          if(amisBtn){
            amisBtn.click();
          }
        }
      })
      .catch(function (error) { 
        console.log("failed check auth corp.",error);
      });
      paycheckIntervalCount--;
    }, paycheckInterval);

}

//建立空白订阅记录：订阅单个APP
//在显示二维码时就创建一条记录，等待支付完成后回调更新
export const createSubscritpionRecord = ( out_trade_no, appId, pricePlanId, subscribeType ) => {
  console.log("try add price plan subscription.",out_trade_no, appId, pricePlanId, subscribeType);
  let effectiveDate = new Date();//默认当前日期开始
  let expireDate = new Date().setFullYear(effectiveDate.getFullYear()+1);
  axios
  .post(  glob.domainUrl + "/erp/subscription/add",{
    id: out_trade_no,
    tenantId: getTenantId(),
    tradeNo: out_trade_no,
    appId: appId,
    pricePlanId: pricePlanId,
    subscribeType: subscribeType,
    effectiveOn: effectiveDate,
    expireOn: expireDate,
  },BIZ_CONFIG)
  .then(res => { 
    console.log("add price plan info done.",res);
  })
  .catch(function (error) { 
    console.log("failed add price plan info.",error);
  });

}

//建立空白订阅记录：pkg套餐订阅
//在显示二维码时就创建一条记录，等待支付完成后回调更新
export const createPkgSubscritpionRecord = ( out_trade_no, salePackageId, subscribeType ) => {
    console.log("try add pkg subscription.",out_trade_no, salePackageId, subscribeType);
    let effectiveDate = new Date();//默认当前日期开始
    let expireDate = new Date().setFullYear(effectiveDate.getFullYear()+1);
    axios
    .post(  glob.domainUrl + "/erp/subscription/add",{
      id: out_trade_no,
      tenantId: getTenantId(),
      tradeNo: out_trade_no,
      salePackageId: salePackageId,
      subscribeType: subscribeType,
      effectiveOn: effectiveDate,
      expireOn: expireDate,
    },BIZ_CONFIG)
    .then(res => { 
      console.log("add pkg info done.",res);
    })
    .catch(function (error) { 
      console.log("failed add pkg info.",error);
    });
  
  }
  
//建立空白充值记录：points产品购买
//在显示二维码时就创建一条记录，等待支付完成后回调更新
export const createPurhasePointsRecord = ( out_trade_no, pointsId, pointsPrice ) => {
    console.log("try add points purchase record.",out_trade_no, pointsId);
    axios
    .post(  glob.domainUrl + "/erp/wxPaymentPoint/add",{
      id: out_trade_no,
      brokerId: "system",//兼容分销平台，默认为system，支付成功后自动更新
      amount: pointsPrice,//为实际支付金额，采用标价填写
      transactionId: "",//兼容分销平台，默认空白，等待填写
      delFlag: "0",//兼容分销平台
      tenantId: getTenantId(),
      tradeNo: out_trade_no,
      pointsId: pointsId,
    },BIZ_CONFIG)
    .then(res => { 
      console.log("add points purchase info done.",res);
    })
    .catch(function (error) { 
      console.log("failed add points purchase info.",error);
    });
  
  }  


/**
 * 注册新的第三方平台访问账户
 * @param platformAccount 第三方平台账户信息
 * @param connector 连接器信息：注意不是连接器定义
 */
export const registerPlatformAccount = (platformAccount, connector) => {
    let id = Md5.hashStr(platformAccount.platformAccountScheme.id+getTenantId()+""+new Date().getTime()); //随机生成一个id
    platformAccount.tenantId = getTenantId();//使用当前登录TenantId填充
    platformAccount.id = getTenantId()=="0" ? platformAccount.platformAccountScheme.id : id; //随机给一个
    connector.tenantId = getTenantId(); //使用当前登录TenantId填充
    connector.id = id; //随机给一个
    connector.platformAccountId = platformAccount.id; //保持与当前新建账户一致
    console.log("try register platform account and connector", platformAccount, connector);
    //直接提交保存
    axios
    .post(glob.domainUrl + "/erp/diyPlatformAccount/register",{
        platformAccount: platformAccount,
        connector: connector,
    },BIZ_CONFIG)
    .then(res => { 
        console.log("platform account saved.",res);
        savePurchaseRecord("connector", connector.id, connector.name, connector.connectorScheme.price);
    })
    .catch(function (error) { 
        console.log("save platform account failed.",error);
    }); 
}

/** 修改第三方账号配置 */
export const updatePlatformAccount = ( platformAccount) => {
    console.log("try update platform account", platformAccount);
    //直接提交保存
    axios
    .post(glob.domainUrl + "/erp/diyPlatformAccount/upsert",platformAccount,BIZ_CONFIG)
    .then(res => { 
        console.log("platform account saved.",res);
    })
    .catch(function (error) { 
        console.log("save platform account failed.",error);
    }); 
}

/** 购买模板 */
export const buyTemplate = ( template) => {
    template.tenantId = getTenantId();//使用当前登录TenantId填充
    template.id = getTenantId()=="0"? template.id : Md5.hashStr(template.id+getTenantId()); //采用templateId+tenantId进行唯一性识别
    console.log("try buy/enable template", template);
    //直接提交保存
    axios
    .post(glob.domainUrl + "/erp/modViewTemplate/add",template,BIZ_CONFIG)
    .then(res => { 
        console.log("template saved.",res);
        savePurchaseRecord("template_"+template.contentType, template.id, template.name, template.price);
    })
    .catch(function (error) { 
        console.log("save template failed.",error);
    }); 
}

/** 购买服务 */
export const buyService = ( template) => {
    template.tenantId = getTenantId();//使用当前登录TenantId填充
    template.id = getTenantId()=="0"? template.id : Md5.hashStr(template.id+getTenantId()); //采用templateId+tenantId进行唯一性识别
    console.log("try buy/enable service", template);
    //直接提交保存
    axios
    .post(glob.domainUrl + "/erp/stoService/add",template,BIZ_CONFIG)
    .then(res => { 
        console.log("service saved.",res);
        savePurchaseRecord(template.type, template.id, template.name, template.pricePurchase);
    })
    .catch(function (error) { 
        console.log("save service failed.",error);
    }); 
}

/** 购买软件 */
//TODO 需要完成支付
export const buyApp = ( template) => {
    template.tenantId = getTenantId();//使用当前登录TenantId填充
    template.id = getTenantId()=="0"? template.id : Md5.hashStr(template.id+getTenantId()); //采用templateId+tenantId进行唯一性识别
    console.log("try buy/enable software", template);
    //直接提交保存
    axios
    .post(glob.domainUrl + "/erp/stoSoftware/add",template,BIZ_CONFIG)
    .then(res => { 
        console.log("software saved.",res);
    })
    .catch(function (error) { 
        console.log("save software failed.",error);
    }); 
}

/** 增加购买记录 */
export const savePurchaseRecord = ( purchaseType, subjectId, subjectName, price ) => {
    let record = {
        id: Md5.hashStr(purchaseType + subjectId + getTenantId()),
        purchaseType: purchaseType,
        subjectId: subjectId,
        subjectName: subjectName,
        price: price,
        tenantId: getTenantId(),
    }
    console.log("try save purchase record", record);
    //直接提交保存
    axios
    .post(glob.domainUrl + "/erp/purchase/add",record,BIZ_CONFIG)
    .then(res => { 
        console.log("purchase record saved.",res);
    })
    .catch(function (error) { 
        console.log("save purchase record failed.",error);
    }); 
}