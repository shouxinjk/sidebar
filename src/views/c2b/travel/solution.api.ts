import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';

import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, PLATFORM_TENANT, MESSAGE_API, MESSAGE_CONFIG} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';
import { reactive } from 'vue';
import { hostname } from 'os';

const glob = useGlobSetting();

//业务数据API
export const bizAPI = {
    solution: {
      get: '/erp/diySolution/queryById', 
      list: '/erp/diySolution/list', 
      save: '/erp/diySolution/add',
      edit: '/erp/diySolution/edit',
      delete: '/erp/diySolution/delete',
    },
    solutionSection: {
      get: '/erp/diySolutionSection/queryById', 
      list: '/erp/diySolutionSection/list',
      items: '/erp/diySolutionSection/list-items',
      save: '/erp/diySolutionSection/add',
      edit: '/erp/diySolutionSection/edit',
      delete: '/erp/diySolutionSection/delete',
    },
    solutionItem: {
      get: '/erp/diySolutionItem/queryById', 
      list: '/erp/diySolutionItem/list',
      save:'/erp/diySolutionItem/add',
      edit: '/erp/diySolutionItem/edit',
      delete: '/erp/diySolutionItem/delete',
    },
    solutionItemOption: {
      get: '/erp/intSolutionItemOption/queryById', 
      list: '/erp/intSolutionItemOption/list',
      save: '/erp/intSolutionItemOption/add',
      edit: '/erp/intSolutionItemOption/edit',
      delete: '/erp/intSolutionItemOption/delete',
    },
    solutionNote: {
      get: '/erp/diySolutionNote/queryById',
      list: '/erp/diySolutionNote/list',
      save: '/erp/diySolutionNote/add',
      edit: '/erp/diySolutionNote/edit',
      delete: '/erp/diySolutionNote/delete',
    },
    priceRule:{
      list: '/erp/diyPriceRule/list',
    },
    itemStock: {
      list: '/erp/diyItemStock/list',
    }
}

//调试
export const isDebug: boolean = true;

//solution价格汇总
const priceSum = {
  costSum:0,
  priceSum: 0,
  priceDiscount: 0,
  profitRatio: 0,
  profitAmount: 0,
}

//新建solution默认天数
const defaultDays = 3;
//solution扩展信息
const solutionExtJson = {
  startDate: "",
  persons: 2, 
  days: defaultDays, 
  from:"",
  region: "", 
  budget: "",
  ...priceSum
}

/**报价策略及系统默认策略 */
const defaultPriceRule = {
  id: "system",
  itemType: "",
  margin: 15,
  marginMax: 20,
  marginMin: 10,
  marginUser: 15,
  name: "系统默认报价策略",
  priority: -1,
  spu: "",
};
const priceRules = [defaultPriceRule];

//默认选中条目保持毫秒数
const defaultTimeout = 30000;//默认30秒

//操作界面状态数据
export const hot = reactive({
  solution: {id: "0", extJson:solutionExtJson, price: 0, priceSum: priceSum, priceRuleDesc: "", priceStatus: "" },//当前solution信息，包含概要信息
  section: {id: "0", extJson: {region: ""}, priceSum: priceSum, priceRuleDesc: "", priceStatus: ""}, //当前section
  item:{id: "0", spu: {}} //当前item
});

//solutionSection列表，包含目的地及排序信息
export const solutionSections = reactive( [
  { id: "1", name: '成都' ,priority: 10, region: ""},
  { id: "2", name: '北京' ,priority: 20, region: ""},
  { id: "3", name: '东京' ,priority: 30, region: ""},
  { id: "5", name: '纽约' ,priority: 40, region: ""},
  { id: "4", name: '曼谷' ,priority: 50, region: ""}
]);

//选定section下的条目信息：注意一次获取一个section的列表
export const solutionItems = reactive([
  { id: "1", name: '请添加方案内容', priority: 1, section:{id:1},options:[], spu:{type:{item:"hotel"}}, sku:[], amount: 1, price: 0, prioritySpu: 1, prioritySku: 0},
]);

/**
 * 新建一个笔记记录。
 */
export const addNote = () => {
  let note = {
    id: Md5.hashStr(hot.solution.id+"note"+new Date().getTime()),//组织唯一id
    solutionId: hot.solution.id,
    name:  solutionSections[0].date +"出发"+ hot.solution.extJson.region+ hot.solution.extJson.days + "日游笔记",
  }
  console.log("try add note.",note);
  //提交创建
  const that = this;
  axios
    .post(glob.domainUrl + bizAPI.solutionNote.save,note,BIZ_CONFIG)
    .then(res => { 
      console.log("note created.",res);
      //跳转到笔记编辑界面
      that.$router.push({ 
          path:'/c2b/travel/note',
          query:{
              id:note.id
          }
      })
    })
    .catch(function (error) { 
      console.log("failed create note",error);
    });
}
/**
 * 加载价格策略
 * 默认一次性加载所有价格策略，按照优先级倒序排列
 * 匹配规则：
 * 1，优先itemType+spu匹配
 * 2，按照itemType匹配
 * 3，没有则返回系统默认
 */
export const loadPriceRules = () => {
  console.log("try load price rules");
  //加载pricerule
  axios
    .get(glob.domainUrl + bizAPI.priceRule.list+"?column=priority&order=desc",{...BIZ_CONFIG,
      params:{} //仅支持通过query参数进行查询
    })
    .then(res => { 
      console.log("got price rules.",res);
      if(res.data.result){
        priceRules.splice(0, priceRules.length, ...res.data.result.records, defaultPriceRule); //缓存价格列表
      } 
    })
    .catch(function (error) { 
      console.log("failed load price rules",error);
    });
}

//根据id加载solution
export const loadSolution = (id) => {
  console.log("try load solution by id.......",id);
  hot.solution.id = id; //修改当前solutionId，能够对空白solution建立section和item
  console.log("access token",getToken());
  //加载solution
  axios
    .get(glob.domainUrl + bizAPI.solution.get,{...BIZ_CONFIG,
      params:{
        id: id
      }
    })
    .then(res => { 
      console.log("got solution.",res);
      if(res.data.result){
        let solution = res.data.result;
        //解析扩展信息
        let extJson = solutionExtJson;
        try{
          extJson = {...solutionExtJson, ...JSON.parse(solution.extInfo)};
        }catch(err){}
        solution.extJson = extJson;
        //设置价格汇总信息
        solution.priceSum = {...priceSum};
        console.log("got solution", solution);
        //更新当前solution
        hot.solution = solution;
        //
      } 
    })
    .catch(function (error) { 
      console.log("failed load solution by id",error);
    });
}

//保存solution
export const saveSolution = () => {
  //需要将extJson转为extInfo
  let solution = {...hot.solution, extInfo: JSON.stringify(hot.solution.extJson)};
  console.log("try save solution", solution);
  //直接提交
  axios
    .post(glob.domainUrl + bizAPI.solution.edit,solution,BIZ_CONFIG)
    .then(res => { 
      console.log("solution saved.",res);
      //建立索引：注意：当前未根据状态过滤
      indexSolution();
    })
    .catch(function (error) { 
      console.log("failed save solution",error);
    });
}

//根据solutionId加载section列表
export const loadSections = (solutionId) => {
  //清空当前section及section列表
  hot.section = {id: "0", extJson: {region: ""}, priceSum: priceSum, priceRuleDesc: "", priceStatus: ""};
  solutionSections.splice(0, solutionSections.length);
  //加载solution
  console.log("try load sections by solution id",solutionId);
  axios
    .get(glob.domainUrl + bizAPI.solutionSection.list,{...BIZ_CONFIG,
      params:{
        solutionId: solutionId
      }
    })
    .then(res => { 
      console.log("got sections.",res);
      if(res.data.result && res.data.result.records && res.data.result.records.length>0){ //装载sections， 按照优先级排序，默认设置第一个为当前选定section
        //排序
        let sections = res.data.result.records;
        sections.sort((a, b) => { 
          return a.priority - b.priority
        });
        //解析扩展属性
        sections.forEach( ( item ) => {
          let itemExt = item;
          let extJson = {region: "目的地?"};
          try{
            extJson = {...extJson, ...JSON.parse(item.extInfo)};
          }catch(err){
          }
          itemExt.extJson = extJson;
          //设置价格小计
          itemExt.priceSum = priceSum;
          let idx = sections.findIndex( d => d.id === item.id);
          sections.splice(idx, 1, itemExt) //替换
        });
        //清空并装载
        solutionSections.splice(0, solutionSections.length, ...sections);
        //设置第一个为选中
        hot.section = sections[0];
        //根据solution设置计算日期
        changeStartDate();
        //装载items
        loadSolutionItems();
      }else{//无section则根据solution日期创建，且
        let sections  = defaultDays; //默认自动创建
        try{
          sections = hot.solution.extJson.days;
        }catch(err){}
        for(let i=0; i<sections; i++){
          addSection();
        }
        //loadSections(solutionId); //初次添加后无需加载
      }
    })
    .catch(function (error) { 
      console.log("failed load sections by solution id",error);
    });
}


//切换section
export const changeSection = (source) => {
  hot.section = source;
  console.log("change section",source);
  //重新加载items
  loadSolutionItems(source.id);
}

/**
 * 拖动section，并调整次序
 * 比较两个section位置，如果目标section位置小则前移，否则后移
 * @param e 
 * @param originalEvent 
 * @returns 
 */
export const moveSection = (e) => { 
  console.log("try move section.",e);
  //调整次序:
  let source = e.draggedContext.element;
  let target = e.relatedContext.element;
  hot.section = source; //将发起拖拽操作的section作为当前选中section
  console.log("move section", e, source, target);

  //根据source、target前后设置新的priority
  let idx = solutionSections.findIndex( item => item.id === target.id );
  let priorityTo = source.priority; //默认位置不变
  if(target.priority<source.priority){ //找到target，以及target之前的元素
    priorityTo = idx>0 ? solutionSections[idx-1].priority: 0;
  }else{ //找到之后的元素
    priorityTo = idx<solutionSections.length-1 ? solutionSections[idx+1].priority: solutionSections[solutionSections.length-1].priority+10;
  }
  source.priority = (priorityTo + target.priority)/2; //设置为中间值

  //提交修改：注意仅需提交即可，前端界面已调整
  console.log("try update section.",source);
  axios
    .post(glob.domainUrl + bizAPI.solutionSection.edit,source,BIZ_CONFIG)
    .then(res => { 
      console.log("section updated.",res);
    })
    .catch(function (error) { 
      console.log("failed update setion",error);
      
    });

  //false表示阻止拖拽
  return true;
}

/**
 * 新建section。默认名称为空白，添加在最后一个
 */
export const addSection = () => {
  let section = {
    id: Md5.hashStr(hot.solution.id+new Date().getTime()),//组织唯一id
    solutionId: hot.solution.id,
    name: "",
    extInfo: "{region:''}", //默认目的地为空
    tenantId: getTenantId(), //手动指定tenantId
    priority: solutionSections.length>0 ? solutionSections[solutionSections.length-1].priority+10 : 10,
  }
  console.log("try add section.",section);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.solutionSection.save,section,BIZ_CONFIG)
    .then(res => { 
      console.log("section created.",res);
      //更新界面：当前直接刷新，需要改进
      section.extJson = {region:""};//默认目的地设为空
      section.priceSum = priceSum;
      solutionSections.push(section);
      hot.section = section;
      changeStartDate();//更新日期
      //loadSolutionItems();//加载solutionItem 初次添加无需加载
    })
    .catch(function (error) { 
      console.log("failed create option",error);
      
    });
}

/**
 * 删除section
 * 注意后端删除section时将同时删除所有solutionItem及option
 */
export const removeSection = (section) => {
  console.log("try remove section.",section);
  //提交删除
  axios
    .delete(glob.domainUrl + bizAPI.solutionSection.delete+"?id="+section.id,BIZ_CONFIG)
    .then(res => { 
      console.log("section removed.",res);
      //更新界面：删除后往前获取，不存在在往后获取
      let idx = solutionSections.findIndex(item => item.id === section.id);
      solutionSections.splice(idx,1);
      if(idx>0){
        hot.section = solutionSections[idx-1];
      }else if(solutionSections.length>0){
        hot.section = solutionSections[idx+1];
      }else{
        hot.section = {"id":"0"};
      }
      changeStartDate();//更新日期
      loadSolutionItems();//加载solutionItem
    })
    .catch(function (error) { 
      console.log("failed remove section",error);
    });
}

/**
 * 选中solutionItem：选中后能够对指定条目添加sku
 * 仅用于点击选择按钮
 */
export const chooseSolutionItem = (event, source) => {
  event.stopPropagation();//禁止冒泡
  console.log("try choose solution item.",source);
  if(hot.item.id === "0"){ //默认设置
    hot.item = source;
    //默认10秒后自动消失
    setTimeout(function(){
      hot.item = {id: "0"}
    },defaultTimeout);
  }else if(hot.item.id !== source.id){ //切换选中
    hot.item = source;
    //默认10秒后自动消失
    setTimeout(function(){
      hot.item = {id: "0"}
    },defaultTimeout);
  }else{ //再次点击取消
    hot.item = {id: "0"}
  }
}

/**
 * 切换solutionItem是自动打开抽屉，显示对应条目详情
 * 当前通过Hack方式完成，触发按钮操作完成
 * @param source 点选的item
 */
export const changeSolutionItem = (source) => {
  hot.item = source;
  //默认10秒后自动消失
  setTimeout(function(){
    hot.item = {id: "0"}
  },defaultTimeout);
  console.log("change solution item.",source);

  //点击时尝试打开详情抽屉：注意需要通过dom操作触发查看详情界面完成
  let cardBtn = document.querySelector('.__sx__btn>span');
  if(cardBtn){
    console.log("try display drawer.");
    cardBtn.click();
  }

  //在展开抽屉后设置抽屉的数据
  setTimeout(
    function(){
      let setSpuBtn = document.querySelector('.__sx__btn__setSpu>span');
      if(setSpuBtn){
        console.log("try set value to drawer.", hot.item.spu);
        setSpuBtn.click();
      }
    },800);
}

/**
 * 调整solutionItem次序
 */
export const moveSolutionItem = (e,originalEvent) => { 
  console.log("try move solution item.",e);
  //调整次序:
  let source = e.draggedContext.element;
  let target = e.relatedContext.element;

  console.log("move item solution", e, source, target);

  //根据source、target前后设置新的priority
  let idx = solutionItems.findIndex( item => item.id === target.id );
  let priorityTo = source.priority; //默认位置不变
  if(target.priority<source.priority){ //找到target，以及target之前的元素
    priorityTo = idx>0 ? solutionItems[idx-1].priority: 0;
  }else{ //找到之后的元素
    priorityTo = idx<solutionItems.length-1 ? solutionItems[idx+1].priority: solutionItems[solutionItems.length-1].priority+10;
  }
  source.priority = (priorityTo + target.priority)/2; //设置为中间值

  //提交修改：注意仅需提交即可，前端界面已调整
  console.log("try update solution item.",source);
  axios
    .post(glob.domainUrl + bizAPI.solutionItem.edit,source,BIZ_CONFIG)
    .then(res => { 
      console.log("solution item updated.",res);
    })
    .catch(function (error) { 
      console.log("failed update solution item",error);
      
    });
  //false表示阻止拖拽
  return true;
}

/**
 * 删除solutionItem：删除solutionItem，同时删除所有关联的option
 * 
 */
export const removeSolutionItem = (event, source) => {
  event.stopPropagation();//禁止冒泡
  console.log("try remove solution item.",source);
  //循环删除所有下属的sku
  let targetSolutionItem = solutionItems.find( item => {item.id === source.id} );
  targetSolutionItem?.options.forEach(option => {
    removeOption(option);
  });
  //然后删除item自身
  axios
    .delete(glob.domainUrl + bizAPI.solutionItem.delete+"?id="+source.id,BIZ_CONFIG)
    .then(res => { 
      console.log("solution item removed.",res);
      //更新界面
      let idx = solutionItems.findIndex(d=>d.id===source.id);
      console.log("remove solution item done", source);
      solutionItems.splice(idx, 1);
      //计算价格
      calcPrice();
    })
    .catch(function (error) { 
      console.log("failed remove solution item",error);
    });
}

/**
 * 根据sectionId加载item列表：包括solutionItem，及SPU、SKU
 * 处理逻辑：
 * 1，后端根据solutionSection查询所有item以及item下的spu、sku
 * 2，前端遍历option，并且以item为主体组织sku信息。注意：需要同时考虑公库、私库数据
 */
export const loadSolutionItems = () => {
  let sectionId = hot.section.id;
  console.log("try load items by solution id and section id......", hot.solution.id,sectionId);

  //加载solution
  axios
    .get(glob.domainUrl + bizAPI.solutionSection.items,{...BIZ_CONFIG,
      params:{
        id: sectionId
      }
    })
    .then(res => { 
      console.log("got items.",res);
      if(res.data.result){ //装载items， 按照优先级排序
        //汇总到临时列表：以solutionItem为主体，将SKU合并到数组。默认后端已经按照item优先级及spu优先级排序
        let items = res.data.result;
        let processedItems = new Array();
        items.forEach(item => {
          console.log("iterate item. ", item);
          //将option合并到sku内
          let processedItem = {...item.solutionItem, ...{options:[]}}; //默认sku为空
          item.solutionOptions.forEach(option =>{
            //将spu放置到solutionItem下，支持直接查看
            if(!processedItem.spu){ //直接解析第一个option的spuInfo
              try{
                processedItem.spu = JSON.parse(option.spuInfo);
              }catch(err){
                console.log("parse spu info error.", err);
              }
            }
            //将关联的sku组合到options下
            if(option.itemSpecific && option.itemSpecific.id){ //如果是私有库SKU，包含有itemSpecific，直接装载
              processedItem.options.push({
                ...option, //以option为主组织，将sku作为附加信息，支持删除和修改
                ...{skuJson: option.itemSpecific},
              });
            }else if(option.skuInfo && option.skuInfo.trim().length>3){ //如果是公共库SKU，则包含有spuInfo，需要解析后装载
              try{
                let sku = JSON.parse(option.skuInfo);
                //由于公库存储字段与私库有差异，需要转换
                sku = {
                  ...sku,
                  ...{
                    priceCost: sku.price.sale, //注意：公库售价才是私有库的成本价！！！
                    priceSale: sku.price.sale * 1.15, //注意：公库资源直接按照15%加价作为私有库卖价
                    priceBid: sku.price.bid
                  }
                }
                
                processedItem.options.push({
                  ...option, //以option为主组织，将sku作为附加信息，支持删除和修改
                  ...{skuJson: sku, sku: sku.id},
                });
              }catch(err){
                console.log("parse sku info error.", err);
                //do nothing
              }
            }
          });
          //加载到列表内
          processedItems.push(processedItem);
        });
        //按照优先级排序
        processedItems.sort( (a, b) => {
          return a.priority - b.priority;
        });
        //清空并装载
        solutionItems.splice(0, solutionItems.length, ...processedItems);
        console.log("final solution items.", solutionItems);
        //计算价格
        calcPrice();
      }
    })
    .catch(function (error) { 
      console.log("failed load items by solution id and section id",error);
    });
}

/**
 * 修改指定section的region
 * 数据值存储于section.extJson.region，显示通过section.region更新
 */
export const changeRegion = () =>{
  console.log("change region", hot.section)
  let idx = solutionSections.findIndex( item => item.id === hot.section.id);
  let section = solutionSections[idx];
  section.region = hot.section.extJson.region;
  solutionSections.splice(idx, 1, section);

  //直接通过DOM操作更新AMISregion区域
  document.querySelector("._sx_region input").value = hot.section.extJson.region;
  
  //TODO：更新section
}
/**
 * 根据顺序获取日期
 * @returns 
 */
export const changeStartDate = () => {
  //先提交修改
  saveSolution();

  //根据日期计算section显示
  let startDate = new Date();
  if(hot.solution.extJson.startDate){
   let dateStr = hot.solution.extJson.startDate.split("-"); //yyyy-MM-dd
   if(dateStr.length === 3){
    startDate.setFullYear(Number(dateStr[0]));
    startDate.setMonth(Number(dateStr[1])-1);
    startDate.setDate(Number(dateStr[2])-1);
   }
  }
  //逐条修改section日期
  let idx = 0;
  solutionSections.forEach( item => {
    let date = new Date();
    date.setTime(startDate.getTime() + (idx+1) * 24 * 60 * 60 * 1000 );
    let dayStr = ["日","一","二","三","四","五","六"];
    let day = date.getDay();
    item.date = (date.getMonth()+1 ) + "月" + date.getDate()+ "日 周" + dayStr[day];
    solutionSections.splice(idx, 1, item);
    idx ++;
  });
}

/**
 * 修改SKU价格后检查是否符合报价策略。仅用于修改提示标志
 * @param option 已修改的sku条目
 */
export const checkPriceMargin = (option) => {
  //优先按照itemType、spuId同时匹配查找
  let priceRule = priceRules.find( item => item.itemType === option.itemType && item.spu === option.skuJson.spu.id );
  //如果没有则按照itemType匹配查找
  if(!priceRule){ 
    priceRule = priceRules.find( item => item.itemType === option.itemType );
  }
  //还没有就以默认策略为准
  if(!priceRule){ 
    priceRule = defaultPriceRule;
  }

  //比较当前价格及计算价格
  let priceMin = option.skuJson.priceCost * (1+priceRule.marginMin*0.01);
  let priceMax = option.skuJson.priceCost * (1+priceRule.marginMax*0.01);

  //修改标志
  let priceRuleDesc = "成本价："+ option.skuJson.priceCost +
                    "\n报价策略："+ priceRule.name +
                    "\n加价区间："+ priceRule.marginMin + "-" + priceRule.marginMax+"%" +
                    "\n参考范围："+ Math.ceil(priceMin) + "-" + Math.floor(priceMax);
  option.priceRuleDesc = priceRuleDesc;
  if(option.price>priceMax){
    option.priceStatus = "warn";
  }else if(option.price<priceMin){
    option.priceStatus = "error";
  }else{
    option.priceStatus = "success";
  }
  
  //刷新数据列表
  //根据option上的solutionItemId找到需要修改的SolutionItem
  let idxSolutionItem = solutionItems.findIndex( item => item.id === option.solutionItemId);
  let targetSolutionItem = solutionItems[idxSolutionItem];
  //根据option找到sku在SKU列表的位置
  let options = targetSolutionItem.options;
  let idxOption = options.findIndex( item => item.id === option.id );
  
  //修改options
  options.splice(idxOption, 1, option);
  //修改solutionItem
  targetSolutionItem.options = options;
  solutionItems.splice(idxSolutionItem, 1, targetSolutionItem);
}

/**
 * 检查section利润报价策略
 * 直接获取优先级最高，itemType=solution的价格策略，如果没有则根据平台策略检查
 */
export const checkSectionProfitMargin = () => {
  //优先按照itemType、spuId同时匹配查找
  let priceRule = priceRules.find( item => item.itemType === "solution" );
  //如果没有以默认策略为准
  if(!priceRule){ 
    priceRule = defaultPriceRule;
  }
  //修改标志
  let priceRuleDesc = "报价策略："+ priceRule.name +
                  "\n利润区间："+ priceRule.marginMin + "-" + priceRule.marginMax+"%";

  //检查section报价
  let sectionProfitRatio = 0;
  if(hot.section.priceSum.priceSum>0)
    sectionProfitRatio = (hot.section.priceSum.priceSum - hot.section.priceSum.costSum)/hot.section.priceSum.priceSum*100;

  hot.section.priceRuleDesc = priceRuleDesc;
  if(hot.section.priceSum.priceSum==0){
    hot.section.priceStatus = "";
  }else if(sectionProfitRatio>priceRule.marginMax){
    hot.section.priceStatus = "warn";
  }else if(sectionProfitRatio<priceRule.marginMin){
    hot.section.priceStatus = "error";
  }else{
    hot.section.priceStatus = "success";
  }
}


/**
 * 修改方案报价。
 * 根据总价或优惠价修改方案报价，修改后提交保存
 * @param type price,discount 表示修改总价或discount
 */
export const changeSolutionPrice = (e, type) => {
  e.stopPropagation();//禁止冒泡
  //获取当前价格汇总
  let solutionPriceSum = hot.solution.priceSum;

  //计算折扣或总价
  let solutionPrice = hot.solution.price;
  let solutionDiscount = hot.solution.priceSum.priceDiscount;
  if( type === "price" ){ //变更总价时，需要同步修改优惠
    solutionPriceSum.priceDiscount =  hot.solution.priceSum.priceSum - solutionPrice;
  }else if(type === "discount" ){ //变更优惠价时，需要同步修改总价
    solutionPrice = hot.solution.priceSum.priceSum - solutionDiscount
    hot.solution.price = solutionPrice;
  }

  //保存修改：注意要在修改完价格之后
  saveSolution();

  //查找报价策略
  let priceRule = priceRules.find( item => item.itemType === "solution" );
  //如果没有以默认策略为准
  if(!priceRule){ 
    priceRule = defaultPriceRule;
  }
  //修改标志
  let priceRuleDesc = "报价策略："+ priceRule.name +
                  "\n利润区间："+ priceRule.marginMin + "-" + priceRule.marginMax+"%";

  //重新计算利润、利润率、报价状态
  solutionPriceSum.profitAmount = solutionPrice - solutionPriceSum.costSum;
  if(solutionPrice != 0){
    solutionPriceSum.profitRatio = Number((solutionPriceSum.profitAmount/solutionPrice*100).toFixed(1));
  }else{
    solutionPriceSum.profitRatio = 0;
  }
  //修改价格汇总
  hot.solution.priceSum = solutionPriceSum;
  //设置报价状态
  hot.solution.priceRuleDesc = priceRuleDesc;
  if(hot.solution.priceSum.costSum == 0){ //无条目时不检查
    hot.solution.priceStatus = "warn";
  }else if(Number(solutionPriceSum.profitRatio)>priceRule?.marginMax){
    hot.solution.priceStatus = "warn";
  }else if(Number(solutionPriceSum.profitRatio)<priceRule?.marginMin){
    hot.solution.priceStatus = "error";
  }else{
    hot.solution.priceStatus = "success";
  }                 
}

/**
 * @deprecated: 需要调整为由服务器端完成汇总。避免大量数据请求
 * 注意：该操作需要显式触发，否则导致大量HTTP请求！！！
 * 检查方案利润报价策略: 用于初次加载solution时检查所有报价，后续直接在前端操作
 * 直接获取优先级最高，itemType=solution的价格策略，如果没有则根据平台策略检查
 */
export const checkSolutionProfitMargin = () => {
  //优先按照itemType、spuId同时匹配查找
  let priceRule = priceRules.find( item => item.itemType === "solution" );
  //如果没有以默认策略为准
  if(!priceRule){ 
    priceRule = defaultPriceRule;
  }
  //修改标志
  let priceRuleDesc = "报价策略："+ priceRule.name +
                  "\n利润区间："+ priceRule.marginMin + "-" + priceRule.marginMax+"%";

  //遍历查询solutionItem及options
  let totalCost = 0;
  let totalPrice = 0;
  axios
  .get(glob.domainUrl + bizAPI.solutionItem.list,{...BIZ_CONFIG,
    params:{
      solutionId: hot.solution.id
    } //查询所有solutionItem
  })
  .then(res => { 
    console.log("got all solution items.",res);
    //遍历所有option
    res.data.result.records.forEach(item => {
      axios
        .get(glob.domainUrl + bizAPI.solutionItemOption.list,{...BIZ_CONFIG,
          params:{
            solutionItemId: item.id
          } 
        })
        .then(res => { 
          res.data.result.records.forEach(option => {
            totalPrice += option.amount * option.price;
            if(option.itemSpecific){
              totalCost += option.amount * option.itemSpecific.priceCost;//私库以成本价为准
              console.log("private cost and total price.",option.itemSpecific.priceCost,totalCost,option.price,totalPrice);
            }else{
              try{
                let skuJson = JSON.parse(option.skuInfo);
                totalCost += option.amount * skuJson.price.sale;//公库以售价为准
                console.log("public cost and total price.",skuJson,skuJson.price.sale,totalCost,option.price,totalPrice);
              }catch(err){
                console.log("error cost and total price.",option.skuInfo,err);
              }
            }
          });

          //检查solution报价： 从后端直接加载时，默认以自动汇总价格计算
          let solutionPrice = totalPrice;
          let solutionCost = totalCost;

          let solutionPriceSum = {...priceSum};
          console.log("solution price sum init",solutionPriceSum);
          solutionPriceSum.priceSum = solutionPrice;
          if(hot.solution.price && hot.solution.price>0){ //有报价按照设置的价格计算
            solutionPriceSum.priceDiscount = solutionPrice - hot.solution.price;
            solutionPrice = hot.solution.price;
          }else{ //无报价时直接以价格汇总计算
            solutionPriceSum.priceDiscount = 0;
          }
          solutionPriceSum.costSum = solutionCost;
          solutionPriceSum.profitAmount = solutionPrice - solutionCost;
          if(solutionPrice>0)
            solutionPriceSum.profitRatio = Number((solutionPriceSum.profitAmount/solutionPrice*100).toFixed(1));
          hot.solution.priceSum = solutionPriceSum;

          console.log("solution price sum.",hot.solution.priceSum, solutionPrice);

          //设置报价状态
          hot.solution.priceRuleDesc = priceRuleDesc;
          if(solutionCost == 0){ //无条目时不检查
            hot.solution.priceStatus = "warn";
          }else if(Number(solutionPriceSum.profitRatio)>priceRule?.marginMax){
            hot.solution.priceStatus = "warn";
          }else if(Number(solutionPriceSum.profitRatio)<priceRule?.marginMin){
            hot.solution.priceStatus = "error";
          }else{
            hot.solution.priceStatus = "success";
          }
        })
    });
  })
}

/**
 * 计算当前section价格信息：注意是当前section，solution总价需要另外计算
 * 遍历所有条目计算成本小计及价格小计。
 */
export const calcPrice = () => {
  let sectionPriceSum = {...priceSum};//默认价格汇总信息
  //计算section价格汇总
  solutionItems.forEach( item => {
    //逐条获取option并计算
    item.options.forEach( option => {
      sectionPriceSum.costSum += option.amount * option.skuJson.priceCost;
      sectionPriceSum.priceSum += option.amount * option.price;

      //检查价格
      checkPriceMargin(option);//TODO 该操作循环操作列表，待改进
    });
  });
  //计算利润及利润率
  sectionPriceSum.profitAmount = sectionPriceSum.priceSum - sectionPriceSum.costSum;
  if(sectionPriceSum.priceSum>0)
    sectionPriceSum.profitRatio = Number((sectionPriceSum.profitAmount / sectionPriceSum.priceSum * 100).toFixed(1)); //为百分比
  //放入当前section的价格小计
  hot.section.priceSum = sectionPriceSum;

  //检查section报价
  checkSectionProfitMargin();

  //检查solution报价: 禁止自动汇总，需要手动触发
  checkSolutionProfitMargin();
}

/**
 * 修改option数量或价格
 * @param option 当前修改的option
 */
export const changeOption = (option) => {
  //保存修改
  saveOption(option);
  //检查价格策略
  checkPriceMargin(option);
  //汇总section价格小计
  calcPrice();
}

/**
 * 添加SPU或SKU时同时新建SolutionItem：如果无选中条目则默认新建
 * @param itemType  sku、spu
 * @param itemOption 具体json
 */
export const addOptionWithSolutionItem = (itemType, itemOption) => {
  let solutionItem = {
    id: Md5.hashStr(hot.solution.id+hot.section.id+itemOption.id+new Date().getTime()),//组织唯一id
    solutionId: hot.solution.id,
    sectionId: hot.section.id,
    name: itemType==="spu"?itemOption.name:itemOption.spu.name,
    priority: solutionItems.length>0 ? solutionItems[solutionItems.length-1].priority + 10 : 10,//作为最后一个添加
    description: "auto create by option",
    type: itemOption.type.item,
  };
  console.log("try add solution item",solutionItem);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.solutionItem.save,solutionItem,BIZ_CONFIG)
    .then(res => { 
      console.log("solution item created.",res);
      //设置当前item为选中支持连续添加sku
      if(itemType=="sku"){
        hot.item = solutionItem;
        setTimeout(function(){
          hot.item = {id: "0"}
        },defaultTimeout);
      }
      //完成后继续创建option
      addOption(solutionItem, itemType, itemOption);
    })
    .catch(function (error) { 
      console.log("failed create solution item",error);
      
    });
}

/**
 * 根据itemType及spu查询价格策略，并计算默认价格。仅用于首次添加时计算价格
 * @param itemType 资源类型
 * @param spuId 产品类型
 */
function getMargin(itemType, spuId){
  //优先按照itemType、spuId同时匹配查找
  let priceRule = priceRules.find( item => item.itemType === itemType && item.spu === spuId );
  //如果没有则按照itemType匹配查找
  if(!priceRule){ 
    priceRule = priceRules.find( item => item.itemType === itemType );
  }
  //返回默认加价
  if(priceRule){ 
    return 1 + priceRule.margin*0.01; //默认为%
  }else{
    return 1 + defaultPriceRule.margin*0.01; //否则返回默认加价
  }
}

/**
 * 新建SolutionItemOption：添加SPU或SKU，并关联到到指定solutionItem
 * @param solutionItem 目标solutionItem。如有选中则默认使用
 * @param itemType spu、sku
 * @param itemOption 具体option信息
 */
export const addOption = (solutionItem, itemType, itemOption) => {
  let option = {
    id: Md5.hashStr(hot.solution.id+hot.section.id+solutionItem.id+itemOption.id+new Date().getTime()),//组织唯一id
    itemType: itemOption.type.item,
    solutionItemId: solutionItem.id,
    solutionSectionId: hot.section.id,
    amount: 1, //默认为1
    price: 0, //默认价格为0，仅对于SKU需要计算价格
    priceStatus: "success", //默认价格为符合要求
    spu: null,
    sku: null,
    spuInfo: JSON.stringify({}),
    skuInfo: JSON.stringify({}),
    priorityspu: new Date().getTime()*0.00000001, //默认用时间排序
    prioritysku: new Date().getTime()*0.00000001, //默认用时间排序
  }
  if(itemType === "spu"){ //仅需设置spu 
    option.spu = itemOption.id;
    option.spuInfo = JSON.stringify(itemOption);
  }else if(itemType === "sku"){ //需要设置spu及sku
    option.spu = itemOption.spu.id;
    option.spuInfo = JSON.stringify(itemOption.spu);
    option.sku = itemOption.id;
    option.skuInfo = JSON.stringify(itemOption);
    option.price = itemOption.price.sale * 
          getMargin(itemOption.type.item, itemOption.spu && itemOption.spu.id ? itemOption.spu.id:""); //计算默认价格
  }else{
    console.log("unkonwn item type. ignore.", itemType);
  }
  console.log("try add option.",option);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.solutionItemOption.save,option,BIZ_CONFIG)
    .then(res => { 
      console.log("option created.",res);
      //更新界面：当前直接刷新，需要改进
      loadSolutionItems();
      //计算价格
      calcPrice();
    })
    .catch(function (error) { 
      console.log("failed create option",error);
    });
}

/**
 * 修改OptionItem：支持修改价格及数量
 * @param option 待修改option
 */
export const saveOption = (option) => {
  console.log("try save option",option);
  //提交创建
  axios
  .post(glob.domainUrl + bizAPI.solutionItemOption.edit, option,BIZ_CONFIG)
  .then(res => { 
    console.log("option saved.",res);
    //loadSolutionItems();
  })
  .catch(function (error) { 
    console.log("failed save option",error);
  });
}

/**
 * 删除一个OptionItem：直接删除对应的option
 * @param option 待删除option
 */
export const removeOption = (option) => {
  console.log("try remove option",option);
  //提交创建
  axios
  .delete(glob.domainUrl + bizAPI.solutionItemOption.delete +"?id="+option.id,BIZ_CONFIG)
  .then(res => { 
    console.log("option removed.",res);
    //TODO 待改进，仅删除前端即可，不需要交互
    loadSolutionItems();
    //计算价格
    calcPrice();
  })
  .catch(function (error) { 
    console.log("failed remove option",error);
  });
}

//在指定Section下增加SPU：直接根据SPU信息在当前section下增加item
export const addSpu = (spu) => {
  console.log("try insert spu.......",spu);
  if(hot.item && hot.item.id !== "0"){ //如果有选中solutionItem则直接添加
    addOption(hot.item, "spu", spu);
  }else{ //否则创建solutionItem后再添加
    addOptionWithSolutionItem("spu", spu);
  }
}

//在指定Item下增加SKU：使用当前SPU，并且设置SKU为添加内容
export const addSku = (sku) => {
  console.log("try insert sku.......",sku);
  if(hot.item && hot.item.id !== "0"){ //如果有选中solutionItem则直接添加
    addOption(hot.item, "sku", sku);
  }else{ //否则创建solutionItem后再添加
    addOptionWithSolutionItem("sku", sku);
  }
}

//根据当前选中的SolutionItem获取SPU
export const getSpu = () => {
  console.log("got current spu", hot.item.spu);
  return hot.item.spu;
}

//提交索引：将solution提交加入索引，能够在小程序等检索
export const indexSolution = () => {
  //tags根据空格分隔，并且添加目的地
  let tags = new Array();
  if(hot.solution.tags && hot.solution.tags.trim().length>0 ){//添加tags
    hot.solution.tags.split(" ").forEach( tag => {
      if(tag.trim().length>0 && tags.indexOf(tag.trim()) <0 )
        tags.push(tag.trim());
    });
  }
  if(hot.solution.extJson && hot.solution.extJson.region && hot.solution.extJson.region.trim().length>0 ){ //添加目的地到tags
    hot.solution.extJson.region.split(" ").forEach( tag => {
      if(tag.trim().length>0 && tags.indexOf(tag.trim()) <0 )
        tags.push(tag.trim());
    });
  }
  //将所有solutionItem概要组织为content
  let content = "";
  solutionItems.forEach( solutionItem => {
    content += solutionItem.name + " ";
  });
  //组织doc
  let doc = {
    tenant: {
      id: hot.solution.tenantId || getTenantId(),
      name: hot.solution.tenantId_dictText || "",
    },
    id: hot.solution.id,
    name: hot.solution.name,
    content: content, //直接用solutionItem条目名称拼接
    scheme: {
      id: hot.solution.schemeId || "",
      name: hot.solution.schemeId_dictText || "",
      //logo: hot.solution.scheme?.logo,
    },
    refer: {
      id: hot.solution.referId || "",
      name: hot.solution.referId_dictText || "",
      //logo: hot.solution.refer?.logo,
    },
    status: hot.solution.status,   
    broker:{
      id: hot.solution.brokerId || "",
      nickname: hot.solution.brokerId_dictText || "",
    },
    thirdUser:{
      id: hot.solution.thirdUserId || "",
      realname: hot.solution.thirdUserId_dictText || "",
    },
    description: hot.solution.description, 
    tags: tags,              
    logo: hot.solution.logo,
    extInfo: hot.solution.extJson,
    price: hot.solution.price,
  }    
  console.log("try to index solution doc.",doc);
  let data = {
      records:[{
          value:doc
      }]
  };
  //提交创建
  axios
    .post(MESSAGE_API+"/topics/solution",data,MESSAGE_CONFIG)
    .then(res => { 
      console.log("solution indexed.",res);
    })
    .catch(function (error) { 
      console.log("failed index solution",error);
    });


}

