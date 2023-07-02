
import { useGlobSetting } from '/@/hooks/setting';
import { isDebug } from  './spu.api';

//typed drawer and forms 
import { getHotelSpuInfo, getHotelSkuInfo, hotelSearchFormSpu, hotelTableColumns, hotelInfoTabs } from  './spu.info.hotel';
import { getSceneSpuInfo, getSceneSkuInfo, sceneSearchFormSpu, sceneTableColumns, sceneInfoTabs } from './spu.info.scene';
import { getVisaSpuInfo, getVisaSkuInfo, visaSearchFormSpu, visaTableColumns, visaInfoTabs } from './spu.info.visa';
import { getCarSpuInfo, getCarSkuInfo, carSearchFormSpu, carTableColumns, carInfoTabs } from './spu.info.car';
import { getVehicleSpuInfo, getVehicleSkuInfo, vehicleSearchFormSpu, vehicleTableColumns, vehicleInfoTabs } from './spu.info.vehicle';
import { getTourSpuInfo, getTourSkuInfo, tourSearchFormSpu, tourTableColumns, tourInfoTabs } from './spu.info.tour';
import { getShowSpuInfo, getShowSkuInfo, showSearchFormSpu, showTableColumns, showInfoTabs } from './spu.info.show';
import { getRestaurantSpuInfo, getRestaurantSkuInfo, restaurantSearchFormSpu, restaurantTableColumns, restaurantInfoTabs } from './spu.info.restaurant';
import { getGuideSpuInfo, getGuideSkuInfo, guideSearchFormSpu, guideTableColumns, guideInfoTabs } from './spu.info.guide';
import { getGoodsSpuInfo, getGoodsSkuInfo, goodsSearchFormSpu, goodsTableColumns, goodsInfoTabs } from './spu.info.goods';
import { getLeisureSpuInfo, getLeisureSkuInfo, leisureSearchFormSpu, leisureTableColumns, leisureInfoTabs } from './spu.info.leisure';
import { getServiceSpuInfo, getServiceSkuInfo, serviceSearchFormSpu, serviceTableColumns, serviceInfoTabs } from './spu.info.service';

const glob = useGlobSetting();

let spuInfos = {
  "goods": {
    spuInfo: getGoodsSpuInfo(),
    skuInfo: getGoodsSkuInfo(),
    tableColumns: goodsTableColumns,
    searchForm: goodsSearchFormSpu,
  },
  "leisure": {
    spuInfo: getLeisureSpuInfo(),
    skuInfo: getLeisureSkuInfo(),
    tableColumns: leisureTableColumns,
    searchForm: leisureSearchFormSpu,
  },
  "service": {
    spuInfo: getServiceSpuInfo(),
    skuInfo: getServiceSkuInfo(),
    tableColumns: serviceTableColumns,
    searchForm: serviceSearchFormSpu,
  },
  "car": {
    spuInfo: getCarSpuInfo(),
    skuInfo: getCarSkuInfo(),
    tableColumns: carTableColumns,
    searchForm: carSearchFormSpu,
  },
  "guide": {
    spuInfo: getGuideSpuInfo(),
    skuInfo: getGuideSkuInfo(),
    tableColumns: guideTableColumns,
    searchForm: guideSearchFormSpu,
  },
  "restaurant": {
    spuInfo: getRestaurantSpuInfo(),
    skuInfo: getRestaurantSkuInfo(),
    tableColumns: restaurantTableColumns,
    searchForm: restaurantSearchFormSpu,
  },
  "visa": {
    spuInfo: getVisaSpuInfo(),
    skuInfo: getVisaSkuInfo(),
    tableColumns: visaTableColumns,
    searchForm: visaSearchFormSpu,
  },
  "vehicle": {
    spuInfo: getVehicleSpuInfo(),
    skuInfo: getVehicleSkuInfo(),
    tableColumns: vehicleTableColumns,
    searchForm: vehicleSearchFormSpu,
  },
  "tour": {
    spuInfo: getTourSpuInfo(),
    skuInfo: getTourSkuInfo(),
    tableColumns: tourTableColumns,
    searchForm: tourSearchFormSpu,
  },
  "show": {
    spuInfo: getShowSpuInfo(),
    skuInfo: getShowSkuInfo(),
    tableColumns: showTableColumns,
    searchForm: showSearchFormSpu,
  },
  "hotel": {
    spuInfo: getHotelSpuInfo(),
    skuInfo: getHotelSkuInfo(),
    tableColumns: hotelTableColumns,
    searchForm: hotelSearchFormSpu,
  },
  "scene": {
    spuInfo: getSceneSpuInfo(),
    skuInfo: getSceneSkuInfo(),
    tableColumns: sceneTableColumns,
    searchForm: sceneSearchFormSpu,
  },
};
//根据类型获取SPU显示元素，包括查询表单、tab页信息
export const getSpuInfo = ( itemType ) => {
  if( spuInfos[itemType] && spuInfos[itemType].spuInfo)
    return spuInfos[itemType].spuInfo;
  return "";
}

//根据类型获取SPU表格列
export const getTableColumns = ( itemType ) => {
  if( spuInfos[itemType] && spuInfos[itemType].tableColumns)
    return spuInfos[itemType].tableColumns;
  return "";
}

//根据类型获取SKU显示元素，包括查询表单、tab页信息
export const getSkuInfo = ( itemType ) => {
  if( spuInfos[itemType] && spuInfos[itemType].skuInfo)
    return spuInfos[itemType].skuInfo;
  return "";
}

//根据类型获取SPU查询表单
export const getSpuSearchForm = ( itemType ) => {
  if( spuInfos[itemType] && spuInfos[itemType].searchForm)
    return spuInfos[itemType].searchForm;
  return "";
}

let spuskuNames = {
  "hotel":{
    "sku":"房型列表",
    "spu":"酒店详情",
    "itemType": "酒店",
  },
  "scene":{
    "sku":"门票类型",
    "spu":"景点详情",
    "itemType": "景点门票",
  },
  "show":{
    "sku":"门票类型",
    "spu":"演出详情",
    "itemType": "演出赛事",
  },
  "car":{
    "sku":"车型列表",
    "spu":"车辆信息",
    "itemType": "租车/包车产品",
  },
  "tour":{
    "sku":"体验类型",
    "spu":"行程详情",
    "itemType": "观光日游",
  },
  "vehicle":{
    "sku":"接驳服务",
    "spu":"服务详情",
    "itemType": "接驳服务",
  },
  "service":{
    "sku":"服务类型",
    "spu":"服务详情",
    "itemType": "旅行服务",
  },
  "visa":{
    "sku":"服务类型",
    "spu":"服务详情",
    "itemType": "签证服务",
  },
  "guide":{
    "sku":"导游服务",
    "spu":"服务详情",
    "itemType": "导游服务",
  },
  "goods":{
    "sku":"特色商品",
    "spu":"商品详情",
    "itemType": "特色商品",
  },
  "leisure":{
    "sku":"休闲服务",
    "spu":"服务详情",
    "itemType": "休闲娱乐产品",
  },
  "restaurant":{
    "sku":"餐饮美食",
    "spu":"餐饮美食详情",
    "itemType": "餐厅/美食",
  },
};

export const getSkuName = (itemType) => {
  let name = "产品列表";
  if(spuskuNames[itemType] && spuskuNames[itemType].sku)
    name = spuskuNames[itemType].sku;
  return name;
}

export const getSpuName = (itemType) => {
  let name = "产品详情";
  if(spuskuNames[itemType] && spuskuNames[itemType].spu)
    name = spuskuNames[itemType].spu;
  return name;
}

export const getItemTypeName = (itemType) => {
  let name = "自有产品";
  if(spuskuNames[itemType] && spuskuNames[itemType].itemType)
    name = spuskuNames[itemType].itemType;
  return name;
}