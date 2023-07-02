import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';

import {SEARCH_API, SEARCH_CONFIG,BIZ_CONFIG, PLATFORM_TENANT} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';

const glob = useGlobSetting();

//业务数据API
export const bizAPI = {
    "spu": '/erp/opeItem/add',
    "spuEdit": '/erp/opeItem/edit',
    "sku": '/erp/diyItemSpecific/add',
    "skuEdit": '/erp/diyItemSpecific/edit',
    "itemStockList": '/erp/diyItemStock/list'
}

//调试
export const isDebug: boolean = false;

/** 新增spu设置 */
export const sxNewSpu = {
  addNew: false,//默认不显示该条目
  tpl: {
    id: "",
    name:"新增自有资源",
    logo: null,
    images:[],
    code:"",
    address:"",
    meta: {status: "pending"},
    price:{
      currency:"¥",
      bid:null,
      sale:null,
    },
    distributor:{
      name: "确幸定制",
    },
    seller:{
      name: "",
    },
    producer:{
      name: "",
    },
    rank:{
      score:null,
      base:null,
      count:null,
      match:0.75,
    },
    props:{},
    source:"ilife",
    status:"in-selling",
    summary:"",
    tags:[],
    tenant:{
      id: getTenantId(),
      name: "",
    },
    type:{
      item: "",//根据选定类型设置
      stock: "contract",
      scope: "private",
    },
    url: "",//待设置

  }
};

/** 新增sku设置 */
export const sxNewSku = {
  addNew: false,//默认不显示该条目
  tpl: {
    id: "",
    name:"新增自有产品",
    logo: null,
    images:[],
    type: {
      item: "",//根据选定类型设置
      stock: "contract",
      scope: "private",
    },
    spu:{
      id: "",
      name: "请选择",
    },
    code: {
      spu: "",
      option: "",
      specific: "",
    },
    price:{
      currency:"¥",
      bid:null,
      sale:null,
    },
    distributor:{
      name: "确幸定制",
    },
    seller:{
      name: "",
    },
    producer:{
      name: "",
    },
    rank:{
      score:null,
      base:null,
      count:null,
      match:0.75,
    },
    props:{},
    source:"ilife",
    status:"in-selling",
    summary:"",
    tags:[],
    tenant:{
      id: getTenantId(),
      name: "",
    },
    url: "",//待设置

  }
};

//将SPU搜索结果转换装载为提示条目
export const mappingSpuCompletions = (hits) =>{
  let spus = new Array();
  hits.forEach(hit => {
    spus.push({
      "value": hit._source.id, //数值
      "label": hit._source.name, //显示内容
    });
  });

  return spus;
}

//将SPU搜索结果转换装载到数据表格
export const mappingSpu = (hits) =>{
  let spus = new Array();
  let idx = 1;
  hits.forEach(hit => {
    spus.push({
      "spu": hit._source, //完整记录：展示详情时通过 spu.xxx.xx 进行
      "id": idx++, //序号，用于奇偶行显示。当前不工作
      "badgeText": "推荐",
      "badgeLevel": "info" //info, error, 
    });
  });

  //检查是否新增记录
  if(sxNewSpu.addNew){ //把新增纪录加到第一条，等待修改
    spus.splice(0,0,{
      "spu": sxNewSpu.tpl, 
      "id": 0, //序号，用于奇偶行显示。当前不工作
      "badgeText": "新增",
      "badgeLevel": "error" //info, error, 
    });
    sxNewSpu.addNew = false; //清除状态
  }

  return spus;
}

//将SKU搜索结果转换装载到数据表格
export const mappingSku = (hits) =>{
  let skus = new Array();
  let idx = 1;
  hits.forEach(hit => {
    skus.push({
      "sku": {
        ...hit._source, //完整记录：展示详情时通过 spu.xxx.xx 进行
        spuOptions:[{ //将SPU选择项作为初始options
          value: hit._source.spu.id,
          label: hit._source.spu.name,
        }]
      },
      "id": idx++, //序号，用于奇偶行显示。当前不工作
      "badgeText": "",
      "badgeLevel": "" //info, error, 
    });
  });

  //检查是否新增记录
  if(sxNewSku.addNew){ //把新增纪录加到第一条，等待修改
    skus.splice(0,0,{
      "sku": sxNewSku.tpl, 
      "id": 0, //序号，用于奇偶行显示。当前不工作
      "badgeText": "新增",
      "badgeLevel": "error" //info, error, 
    });
    sxNewSku.addNew = false; //清除状态
  }

  return skus;
}

/**
 * 将SPU复制到私有库：ID=spuId+tenantId；refer = 原始SPU ID；tenant = 当前Tenant
 * @param spu 原始SPU数据
 */
export async function copySpu(spu){
  console.log("try copy SPU. ", spu);
  //获取tenant信息
  let tenant = await getTenantById({ id: getTenantId() });
  //组织私有库ID：MD5(spuId+tenantId)
  let docId = Md5.hashStr(spu.id + getTenantId());
  console.log("got my id.",spu.id, getTenantId(),docId);
  //根据ID检查是否已存在：如果已存在则直接忽略
  axios
    .get(SEARCH_API+'/spu/doc/'+docId, SEARCH_CONFIG)
    .then(res => { //如果存在则忽略
      console.log("doc exists. ignore.",res);
    })
    .catch(function (error) { // 如果不存在，则直接复制
      console.log("doc not exist. start copy ... ",error);
      //添加到ES
      let tenantSpu = {...spu};
      tenantSpu.id = docId;
      tenantSpu.tenant = {
        id: getTenantId(),
        name: tenant.name
      };
      tenantSpu.refer = {
        "id": spu.id,
        "name": spu.name
      };
      console.log("tenant spu. ", tenantSpu);
      commitEs("spu", tenantSpu); //添加到ES
      //添加到MySQL
      let record = {
        id: tenantSpu.id,
        itemType: tenantSpu.type.item,
        name: tenantSpu.name,
        summary: tenantSpu.summary,
        logo: tenantSpu.logo,
        url: tenantSpu.url,
        status: tenantSpu.status,
        tenantId: tenantSpu.tenant.id
      };
      commitBizData("spu","insert", record);
    });
}

/**
 * 根据SPUID检查复制到私有库：ID=spuId+tenantId；refer = 原始SPU ID；tenant = 当前Tenant
 * 用于复制SKU时，同步检查复制SPU
 * @param originalSpuId 原始spuId数据，即待复制公库SPU ID
 */
export async function copySpuById(originalSpuId){
  console.log("try copy SPU by id. ", originalSpuId);
  //组织私有库ID：MD5(spuId+tenantId)
  let docId = Md5.hashStr(originalSpuId + getTenantId());
  console.log("got my id.",originalSpuId, getTenantId(),docId);
  //根据ID检查是否已存在：如果已存在则直接忽略
  axios
    .get(SEARCH_API+'/spu/doc/'+docId, SEARCH_CONFIG)
    .then(res => { //如果存在则忽略
      console.log("doc exists. ignore.",res);
    })
    .catch(function (error) { // 如果不存在，则根据原始spuId获取文档复制
      console.log("doc not exist. start copy ... ");
      axios
      .get(SEARCH_API+'/spu/doc/'+originalSpuId, SEARCH_CONFIG)
      .then(res => { //如果找到则复制
        console.log("got spu doc by originalId.",originalSpuId,res);
        copySpu(res.data._source);
      })
      .catch(function (error) { // 如果不存在直接忽略
        console.log("cannot find doc by spu id. ignore. ", originalSpuId);
      });
    });
}

/**
 * 将SKU复制到私有库：ID=skuId+tenantId；refer = 原始SKU ID；tenant = 当前Tenant
 * @param sku 原始SKU数据
 */
export async function copySku(sku){
  console.log("try copy SKU. ", sku);
  //获取tenant信息
  let tenant = await getTenantById({ id: getTenantId() });
  //组织私有库ID：MD5(spuId+tenantId)
  let docId = Md5.hashStr(sku.id + getTenantId());
  console.log("got my id.",sku.id, getTenantId(),docId);
  //同步检查复制SPU，如果不存在则直接复制： SPU ID规则： MD5(原始SPUID+TenantID)
  copySpuById(sku.spu.id);
  //根据ID检查SKU是否已存在：如果已存在则直接忽略
  axios
    .get(SEARCH_API+'/sku/doc/'+docId, SEARCH_CONFIG)
    .then(res => { //如果存在则忽略
      console.log("doc exists. ignore.",res);
    })
    .catch(function (error) { // 如果不存在，则直接复制
      console.log("doc not exist. start copy ... ",error);
      //添加到ES
      let tenantSku = {...sku};
      tenantSku.id = docId;
      tenantSku.tenant = {
        id: getTenantId(),
        name: tenant.name
      };
      tenantSku.refer = {
        "id": sku.id,
        "name": sku.name
      };
      tenantSku.spu = {
        "id": Md5.hashStr(sku.spu.id + getTenantId()), //同步复制SPU，SPU也成为租户私有资源
        "name": sku.spu.name
      };
      //重要：在复制时，将公库的供货价设置为成本价，并且设置默认供货价 = min(成本价*15%, 销售价)
      let mySalePrice = tenantSku.price.sale * 1.15;//默认加价15%
      if(tenantSku.price.bid && mySalePrice>tenantSku.price.bid){
        mySalePrice = (tenantSku.price.sale+tenantSku.price.bid)/2; //否则取供货价、零售价中间值
      }
      tenantSku.price.cost = tenantSku.price.sale;
      tenantSku.price.sale = mySalePrice;
      //价格设置结束
      console.log("tenant sku. ", tenantSku);
      commitEs("sku", tenantSku); //添加到ES
      //添加到MySQL
      let record = mapSkuDoc2Record(tenantSku);
      commitBizData("sku","insert", record);
    });
}

/**
 * 提交数据到ES
 * @param type 类型：spu、sku
 * @param data 提交的文档数据
 */
export const commitEs = (type, data) => {
  console.log("try commit data to ES.",type, data);
  axios
    .post(SEARCH_API+'/'+type+'/doc/'+data.id, data, SEARCH_CONFIG)
    .then(res => { // 创建成功
      console.log("commit ES success.",res);
    })
    .catch(function (error) { // 创建出错
      console.log("commit ES error.",error);
    });
}

/**
 * 提交数据到MySQL
 * @param type 类型：spu、sku
 * @param data 提交的文档数据
 */
export const commitBizData = (type, action, data) => {
  console.log("try commit data to ES.",type, data, getToken());
  axios
    .post(glob.domainUrl + ( type=='spu'?
                              (action=='insert'?bizAPI.spu:bizAPI.spuEdit):
                              (action=='insert'?bizAPI.sku:bizAPI.skuEdit)
                            ), data, BIZ_CONFIG)
    .then(res => { // 创建成功
      console.log("commit biz data success.",res);
    })
    .catch(function (error) { // 创建出错
      console.log("commit biz data error.",error);
    });
}

/**
 * 修改SPU并保存
 * @data 原始SPU JSON数据
 */
export const saveSpu = ( data ) => {
  //先保存ES
  //添加到ES
  let tenantSpu = {...data};
  tenantSpu["@timestamp"] = new Date(); //修改时间戳

  commitEs("spu", tenantSpu);
  //转换为BIZ后保存
  let record = mapSpuDoc2Record(tenantSpu);
  commitBizData("spu","insert", record);
}

/**
 * 修改SKU并保存
 * @data 原始SKU JSON数据
 */
export const saveSku = ( data ) => {
  //先保存ES
  //添加到ES
  let tenantSku = {...data};
  tenantSku["@timestamp"] = new Date(); //修改时间戳

  commitEs("sku", tenantSku);
  //转换为BIZ后保存
  let record = mapSkuDoc2Record(tenantSku);
  commitBizData("sku","insert", record);
}

/**
 * 将表单内SKU JSON数据转换为数据库记录
 * @json 原始表单JSON数据
 * 
 */
export const mapSkuDoc2Record = ( json ) => {
  console.log("try to map sku doc to db record.", json);
  let record = {
    spuId: json.spu.id,
    id: json.id,
    name: json.name,
    optionCode: json.option?json.option.code:"",
    specificCode: json.specific?json.specific.code:"",
    priceCost: json.price.cost,
    priceBid: json.price.bid,
    priceSale: json.price.sale,
    skuType: json.type.item,
    //stockType: json.type.stock,
    url: json.url,
    status: json.status,
    tenantId: json.tenant.id,
    origin: json.refer?json.refer.id:""
  };
  return record;
}

/**
 * 将表单内SPU JSON数据转换为数据库记录
 * @json 原始表单JSON数据
 * 
 */
export const mapSpuDoc2Record = ( json ) => {
  console.log("try to map spu doc to db record.", json);
  let record = {
    id: json.id,
    itemType: json.type.item,
    name: json.name,
    summary: json.summary,
    logo: json.logo,
    url: json.url,
    status: json.status,
    tenantId: json.tenant.id,
    origin: json.refer?json.refer.id:""
  };
  return record;
}

/**
 * 将SPU复制到私有库：ID=spuId+tenantId；refer = 原始SPU ID；tenant = 当前Tenant
 * @param spu 原始SPU数据
 */
export async function publishSpu(spu){
  console.log("try copy SPU. ", spu);
  //组织公共库ID：MD5(spuId+tenantId)
  let docId = Md5.hashStr(spu.id + PLATFORM_TENANT.id);
  console.log("got my id.",spu.id, PLATFORM_TENANT.id,docId);
  //根据ID检查是否已存在：如果已存在则直接忽略
  axios
    .get(SEARCH_API+'/spu/doc/'+docId, SEARCH_CONFIG)
    .then(res => { //如果存在则忽略
      console.log("doc exists. ignore.",res);
    })
    .catch(function (error) { // 如果不存在，则直接复制
      console.log("doc not exist. start copy ... ",error);
      //添加到ES
      let tenantSpu = {...spu};
      tenantSpu.id = docId;
      tenantSpu.tenant = {
        id: getTenantId(),
        name: PLATFORM_TENANT.name
      };
      tenantSpu.refer = {
        "id": spu.id,
        "name": spu.name
      };
      console.log("tenant spu. ", tenantSpu);
      commitEs("spu", tenantSpu); //添加到ES
      //添加到MySQL
      let record = {
        id: tenantSpu.id,
        itemType: tenantSpu.type.item,
        name: tenantSpu.name,
        summary: tenantSpu.summary,
        logo: tenantSpu.logo,
        url: tenantSpu.url,
        status: tenantSpu.status,
        tenantId: tenantSpu.tenant.id
      };
      commitBizData("spu","insert", record);
    });
}

/**
 * 根据SPUID检查复制到公共库：ID=spuId+tenantId；refer = 原始SPU ID；tenant = 平台Tenant
 * 用于复制SKU时，同步检查复制SPU
 * @param originalSpuId 原始spuId数据，即待复制私库SPU ID
 */
export async function publishSpuById(originalSpuId){
  console.log("try copy SPU by id. ", originalSpuId);
  //组织私有库ID：MD5(spuId+tenantId)
  let docId = Md5.hashStr(originalSpuId + PLATFORM_TENANT.id);
  console.log("got my id.",originalSpuId, PLATFORM_TENANT.id,docId);
  //根据ID检查是否已存在：如果已存在则直接忽略
  axios
    .get(SEARCH_API+'/spu/doc/'+docId, SEARCH_CONFIG)
    .then(res => { //如果存在则忽略
      console.log("doc exists. ignore.",res);
    })
    .catch(function (error) { // 如果不存在，则根据原始spuId获取文档复制
      console.log("doc not exist. start copy ... ");
      axios
      .get(SEARCH_API+'/spu/doc/'+originalSpuId, SEARCH_CONFIG)
      .then(res => { //如果找到则复制
        console.log("got spu doc by originalId.",originalSpuId,res);
        copySpu(res.data._source);
      })
      .catch(function (error) { // 如果不存在直接忽略
        console.log("cannot find doc by spu id. ignore. ", originalSpuId);
      });
    });
}

/**
 * 将SKU复制到公共库：ID=skuId+tenantId；refer = 原始SKU ID；tenant = 平台Tenant
 * @param sku 原始SKU数据
 */
export async function publishSku(sku){
  console.log("try copy SKU. ", sku);
  //组织公共库ID：MD5(spuId+tenantId)
  let docId = Md5.hashStr(sku.id + PLATFORM_TENANT.id);
  console.log("got my id.",sku.id, PLATFORM_TENANT.id,docId);
  //同步检查复制SPU，如果不存在则直接复制： SPU ID规则： MD5(原始SPUID+TenantID)
  publishSpuById(sku.spu.id);
  //根据ID检查SKU是否已存在：如果已存在则直接忽略
  axios
    .get(SEARCH_API+'/sku/doc/'+docId, SEARCH_CONFIG)
    .then(res => { //如果存在则忽略
      console.log("doc exists. ignore.",res);
    })
    .catch(function (error) { // 如果不存在，则直接复制
      console.log("doc not exist. start copy ... ",error);
      //添加到ES
      let tenantSku = {...sku};
      tenantSku.id = docId;
      tenantSku.tenant = {
        id: PLATFORM_TENANT.id,
        name: PLATFORM_TENANT.name
      };
      tenantSku.refer = {
        "id": sku.id,
        "name": sku.name
      };
      tenantSku.spu = {
        "id": Md5.hashStr(sku.spu.id + PLATFORM_TENANT.id), //同步复制SPU，SPU也成为租户私有资源
        "name": sku.spu.name
      };
      //重要：在发布时，需要隐藏成本价
      tenantSku.price.cost = null;
      //价格设置结束
      console.log("tenant sku. ", tenantSku);
      commitEs("sku", tenantSku); //添加到ES
      //添加到MySQL
      let record = mapSkuDoc2Record(tenantSku);
      commitBizData("sku","insert", record);
    });
}
