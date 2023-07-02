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
//import { useRouter, useRoute } from 'vue-router'

//const { currentRoute, replace } = useRouter();
const glob = useGlobSetting();

//存储当前选中的生成记录，在发布时引用
export const hot = {
  genRecord: {}
};

//业务数据API
export const bizAPI = {
    diyGenContent: {
      save: '/erp/diyGenContent/add',
    },
    diyPublishContent: {
      save: '/erp/diyPublishContent/add',
    },
}

//调试
export const isDebug: boolean = false;

/**
 * 显示模板列表
 */
export const showTemplateList = () => {
  console.log("try show template list.");
  //点击时尝试打开详情抽屉：注意需要通过dom操作触发查看详情界面完成
  let amisBtn = document.querySelector('.__sx__contentbtn>span');
  if(amisBtn){
    amisBtn.click();
  }
}

/**
 * 显示预览表单
 */
export const showPreview = () => {
  console.log("try show template list.");
  //点击时尝试打开详情抽屉：注意需要通过dom操作触发查看详情界面完成
  let amisBtn = document.querySelector('.__sx__previewbtn>span');
  if(amisBtn){
    amisBtn.click();
  }
}

/**
 * 显示连接器列表
 */
export const showConnectorList = () => {
  console.log("try show connector list.");
  //点击时尝试打开详情抽屉：注意需要通过dom操作触发查看详情界面完成
  let amisBtn = document.querySelector('.__sx__connectorbtn>span');
  if(amisBtn){
    amisBtn.click();
  }
}

/**
 * 更改模板
 * 更改模板后设置缓存，在生成时引用当前选定模板ID
 */
export const changeTemplate = (template) => {
  console.log("change template.", template);
  //TODO：修改模板
  //TODO：生成内容，用于预览
}

/**
 * 保存内容生成记录，并且消耗虚拟豆，完成后进入已生成列表
 * 注意：此处无需再次生成内容 一个内容仅能根据模板生成一次
 * @param stockType solution/note/hotel/scene/... 与字典 stock_type 一致
 * @param stockSubject: 对应的数据对象
 * @param tempalte : 选定的模板对象
 */
export const saveGenerateRecord = (stockType, stockSubject, contentType, template) => {
  console.log("try save generate record.");
  //根据当前选定模板生成
  let record = {
    id: Md5.hashStr(stockType+stockSubject.id+template.id),//组织唯一id
    solutionNoteId: stockType=="note"?stockSubject.id:"",
    solutionId: stockType=="solution"?stockSubject.id:"",
    itemId: stockType!="solution" && stockType!="note" ? stockSubject.id:"", 
    stockType: stockType,
    contentType: contentType,
    templateId: template.id,
    status: "success",
    title: "图文："+stockSubject.name,
    summary: "",
  }
  console.log("try add generation record.",record);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.diyGenContent.save,record,BIZ_CONFIG)
    .then(res => { 
      console.log("generation item created.",res);
      //跳转到发布界面
      console.log("try go solution.");
      //replace({ path: '/c2b/travel/content' });
    })
    .catch(function (error) { 
      console.log("failed create generation item",error);
    });
}

/** 增加billing记录 */
export const saveBillingRecord = ( billingType, subjectType, subjectId, subjectName, amount=0, summary="", extInfo={} ) => {
  let record = {
      id: Md5.hashStr(billingType + subjectType + subjectId + getTenantId()),
      billingType: billingType,
      subjectType: subjectType,
      subjectId: subjectId,
      subjectName: subjectName,
      amount: amount,
      summary: summary,
      extInfo: JSON.stringify(extInfo),
      tenantId: getTenantId(),
  }
  console.log("try save billing record", record);
  //直接提交保存
  axios
  .post(glob.domainUrl + "/erp/billing/add",record,BIZ_CONFIG)
  .then(res => { 
      console.log("billing record saved.",res);
  })
  .catch(function (error) { 
      console.log("save billing record failed.",error);
  }); 
}

/**
 * 保存内容发布记录，并且消耗虚拟豆，完成后进入已生成列表
 * 注意：此处无需再次生成内容 一个内容对一个连接器仅发布一次
 * @param genRecord 内容生成记录
 * @param connector 选择的连接器
 */
export const savePublishRecord = (genRecord, connector, publishInfo) => {
  console.log("try save publish record.",genRecord, connector);
  //根据当前选定模板生成
  let record = {
    id: Md5.hashStr(genRecord.id+connector.id),//组织唯一id
    solutionNoteId: genRecord.stockType=="note"?genRecord.solutionNoteId:"",
    solutionId: genRecord.stockType=="solution"?genRecord.solutionId:"",
    itemId: genRecord.stockType!="solution" && genRecord.stockType!="note" ? genRecord.itemId:"", 
    stockType: genRecord.stockType,
    contentId: genRecord.id,
    platformSourceId: connector.platformSourceId,
    status: publishInfo.status,
    publishId: publishInfo.publishId,
    publishStatus: publishInfo.publishStatus,
    publishUrl: publishInfo.publishUrl,
  }
  console.log("try add publish record.",record);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.diyPublishContent.save,record,BIZ_CONFIG)
    .then(res => { 
      console.log("publish item created.",res);
      //创建billing记录：均为虚拟豆消耗类型
      saveBillingRecord("cost", 
        genRecord.contentType, 
        genRecord.id, 
        genRecord.title,
        connector.connectorScheme.price, 
        connector.name, 
        publishInfo  );
    })
    .catch(function (error) { 
      console.log("failed create publish item",error);
    });
}

/**
 * 发布内容到微信公众号草稿箱
 * @param thumbImgUrl 缩略图原始URL。发布过程中将作为永久素材上传
 * @param content 内容。与公众号草稿发布内容一致，包含标题、作者、内容、摘要、原文链接
 * @param connector 选择的连接器
 */
export const publishContentWxMp = async (thumbImgUrl, content, connector, genRecord) => {
  let fileName = thumbImgUrl.substring(thumbImgUrl.lastIndexOf("/")+1);
  const response = await fetch(thumbImgUrl);
  const blob = await response.blob();
  console.log("got image data from response.",response, blob);
  let formData = new FormData();          
  formData.append('file', blob, fileName);
  console.log("got form data.", formData);
  uploadImageAndPublish(formData, content, connector, genRecord);
}

function uploadImageAndPublish(formData, content, connector, genRecord){
  console.log("try upload material", formData)
  //先上传为永久素材
  axios
  .post(
    glob.domainUrl + "/weopen/mp/material/"+WEOPEN_COMPONENT_APP_ID+"/"+connector.extInfo.appId,
    formData,
    {
      headers:{
        "Content-Type": "multipart/form-data",
      }
    }
  )
  .then(res => { 
    console.log("material uploaded.",res);
    //发布内容
    content.thumbMediaId = res.data.data.mediaId;
    axios
    .post(glob.domainUrl + "/weopen/mp/draft/"+WEOPEN_COMPONENT_APP_ID+"/"+connector.extInfo.appId,{
      content:content,
      genRecord: genRecord,
    },BIZ_CONFIG)
    .then(res => { 
      console.log("draft published.",res);
      //建立发布记录
      savePublishRecord(genRecord, connector, {
        status: res.data.success,
        publishId: res.data.mediaId,
        publishStatus: res.data.success,
        publishUrl: connector.platformSource.url,
      });
    })
    .catch(function (error) { 
      console.log("publish draft failed.",error);
    }); 
    //发布内容结束
  })
  .catch(function (error) { 
    console.log("upload material failed.",error);
  });  
}


