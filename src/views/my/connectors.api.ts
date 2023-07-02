import axios from 'axios';
import { reactive } from 'vue';

import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, WEOPEN_COMPONENT_APP_ID} from '/@/settings/iLifeSetting';
import { getTenantId, getToken } from "/@/utils/auth";

const glob = useGlobSetting();

//业务数据API
export const bizAPI = {
  "listApps": '/erp/stoSoftware/list',
  "listServices": '/erp/stoService/list',
  "listPricePlans": '/erp/stoPricePlan/list',
  "listTemplates": '/erp/modViewTemplate/list',
  "listConnectors": '/erp/stoConnector/list',
  "getConnectoryById": '/erp/stoConnector/queryById',
  "listConnectorsByType": '/erp/stoConnector/list-by-type',
  "getWxAuthMiniprogById": '/erp/wxAuthMiniprog/queryById',
  "getWxAuthMpById": '/erp/wxAuthMp/queryById',
}

export const isDebug = false;

/**
 * 获取授权信息
 * @param authCode 授权auth_code
 * @param schemeId 连接器SchemeId
 * @param cb 授权完成后的回调
 * @returns 
 */
export const getAuthInfo = async ( authCode, schemeId, cb ) => {
  console.log("try get auth info", authCode);
  //直接获取: 注意是同步调用
  await axios
    .post(glob.domainUrl + "/weopen/auth/"+WEOPEN_COMPONENT_APP_ID,{
      authCode: authCode,
      schemeId: schemeId,
      tenantId: getTenantId(),
    },BIZ_CONFIG)
    .then(res => { 
      console.log("got auth info.",res);
      //授权完成后刷新连接器列表
      if( typeof cb == "function"){
        cb();
      }
    })
    .catch(function (error) { 
      console.log("failed get auth info.",error);
    });

}