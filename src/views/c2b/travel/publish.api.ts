import axios from 'axios';
import {Md5} from 'ts-md5';
import { Buffer } from 'buffer';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';

import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, WEOPEN_COMPONENT_APP_ID, BIZ_API, SX_API, CK_API, CK_CONFIG,} from '/@/settings/iLifeSetting';
import { timestamp } from '@vueuse/shared';
import { reactive } from 'vue';
import { hostname } from 'os';

/**
 * 获取已发布商品URL列表：包括发布到到ilife、miniprog，以及第三方电商平台的url
  需要进行额外处理：
  1，获取platform列表及url列表，补充platform信息及链接、二维码
  2，检查是否包含ilife默认发布，如果没有则补充默认链接即二维码
  3，返回经过补全的发布记录列表
 * @param pubRecords 发布记录列表：包含sku、spu、solution
 */
export const getPublishUrls = async ( pubRecords ) => {
  console.log("try get urls.",pubRecords);
  let itemType = "";
  let itemId = "";
  if(pubRecords.length>0){
    itemType = pubRecords[0].itemType;
    itemId = pubRecords[0].itemId;
  }
  let urls = new Array(); //空白列表
  //加载platformSource: 加载全部platform
  let getPlatformSources = axios.get(BIZ_API + "/erp/modPlatformSource/list",{...BIZ_CONFIG,
                        params:{}
                      });
  //加载所有已发布url列表：根据生成记录加载
  let getUrlsByItemId = axios.get(CK_API + "?query=select * from ilife.qrcodes where itemType='"+itemType+"' and itemId='"+itemId+"' order by ts format JSON",{...CK_CONFIG,
                        params:{}
                      });
  
  //加载
  let  res = await Promise.all([getPlatformSources, getUrlsByItemId]);

  console.log("got platform sources and publish urls.",res);
  let platformSources = await res[0].data.result.records;
  let publishedUrls = await res[1].data.data;

  //将platform信息及url信息装载到发布记录上
  pubRecords.forEach( record => {
    let platformSource = platformSources.find( ({ id }) => id === record.platformSourceId );
    let publishedUrl = publishedUrls.find( ( itemType, itemId, platform ) => itemType === record.itemType && itemId === record.itemId  &&  platform === platformSource?.platform );
    if( platformSource && publishedUrl ){ //装配
      urls.push ({
        ...pubRecords,
        platform: platformSource.platform,
        url: publishedUrl
      });
    }
  });
  
  //返回已发布地址列表
  console.log("got qrcode urls.", urls);
  return urls;
}

/**
 * 增加默认发布记录。包括sku及solution。
 * @param pubRecord 发布记录：包含sku、spu、solution
 */
  export const addPublishRecord = async ( pubRecord ) => {
    console.log("try add pub record.",pubRecord);
    //直接提交新记录即可
    axios
    .post(BIZ_API + "/erp/diyPublishProduct/add", pubRecord, BIZ_CONFIG)
    .then(res => { 
      console.log("pub record added.",res);
    })
    .catch(function (error) { 
      console.log("failed add pub record",error);
      
    });
    
  }
  




