import axios from 'axios';
import {Md5} from 'ts-md5';
import { Buffer } from 'buffer';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';

import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, WEOPEN_COMPONENT_APP_ID,} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';
import { reactive } from 'vue';
import { hostname } from 'os';
const glob = useGlobSetting();

/**
 * 商品发布基础服务
 * 接收SPU、SKU、定制方案发布到电商平台
 */

//调试
export const isDebug: boolean = true;

//存储当前选中的spu sku等，在发布时引用
export const hot = {
  product: {}
};

/**
 * 保存商品发布记录，并且消耗虚拟豆，完成后进入已生成列表
 * @param product 内容生成记录
 * @param connector 选择的连接器
 */
export const savePublishRecord = (product, connector, publishInfo) => {
  console.log("try save publish record.",product, connector);
  //根据当前选定模板生成
  let record = {
    id: Md5.hashStr(product.id+connector.id),//组织唯一id
    solutionNoteId: product.stockType=="note"?product.solutionNoteId:"",
    solutionId: product.stockType=="solution"?product.solutionId:"",
    itemId: product.stockType!="solution" && product.stockType!="note" ? product.itemId:"", 
    stockType: product.stockType,
    contentId: product.id,
    platformSourceId: connector.platformSourceId,
    status: publishInfo.status,
    publishId: publishInfo.publishId,
    publishStatus: publishInfo.publishStatus,
    publishUrl: publishInfo.publishUrl,
  }
  console.log("try add publish record.",record);
  //提交创建
  /**
  axios
    .post(glob.domainUrl + bizAPI.diyPublishContent.save,record,BIZ_CONFIG)
    .then(res => { 
      console.log("publish item created.",res);
    })
    .catch(function (error) { 
      console.log("failed create publish item",error);
    });
    //** */
}


/**
 * 发布商品到微信小商店
 * @param spu 待发布商品数据，包含spu，及可选sku列表
 * @param connector 选择的连接器
 */
export const publishMinishop = async (spu, connector) => {
  console.log("try publish minishop ", spu, connector)
  //检查logo及descimg，如果为空则增加默认图片
  //let defaultImg = "https://www.biglistoflittlethings.com/static/logo/distributor/ilife.png";
  let defaultImg = "https://store.mp.video.tencent-cloud.com/161/20304/snscosdownload/SZ/reserved/6059ade300096eb200000000f19f9d09000000a000004f50";
  if(!spu.headImgs || spu.headImgs.length ==0 )
    spu.headImgs.push(defaultImg);
  if(!spu.descInfoImgs || spu.descInfoImgs.length ==0 )
    spu.descInfoImgs.push(defaultImg);

  //直接提交
  axios
  .post(glob.domainUrl + "/weopen/shop/spu/"+WEOPEN_COMPONENT_APP_ID+"/"+connector.extInfo.appId,spu,BIZ_CONFIG)
  .then(res => { 
    console.log("prodcut published.",res);
    //建立发布记录
    savePublishRecord(spu, connector, {
      status: res.data.success,
      publishId: res.data.mediaId,
      publishStatus: res.data.success,
      publishUrl: connector.platformSource.url,
    });
  })
  .catch(function (error) { 
    console.log("publish product failed.",error);
  }); 
}

