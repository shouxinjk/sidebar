import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';

import {SEARCH_API, SEARCH_CONFIG, PLATFORM_TENANT, BIZ_CONFIG, SX_API} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';

const glob = useGlobSetting();

//调试
export const isDebug: boolean = true;

//完成充值：仅在支付成功后提交。其他不做考虑：如果支付取消，或中途退出？？
//提交数据包括：达人ID或达人openid，阅豆产品
// export const purchasePoints = ( out_trade_no, productId, ) => {
//     console.log("try save purchase record.", out_trade_no, productId);
//     //提交购买记录
//     axios
//     .post(SX_API+"/wx/wxPaymentPoint/rest/tenant-purchase",{
//         productId:productId,
//         tenantId: getTenantId(),
//         out_trade_no:out_trade_no,//直接用前台组织的out_trade_no
//         result_code:"pending" //默认为待支付
//     },BIZ_CONFIG)
//     .then(res => { 
//         console.log("purchase record saved.",res);
//     })
//     .catch(function (error) { 
//         console.log("save purchase record failed.",error);
//     }); 

// }

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