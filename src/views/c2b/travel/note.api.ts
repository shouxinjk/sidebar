import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';
import { router } from '/@/router';
import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, MESSAGE_API, MESSAGE_CONFIG } from '/@/settings/iLifeSetting';
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
    solutionNote: {
      get: '/erp/diySolutionNote/queryById',
      list: '/erp/diySolutionNote/list',
      save: '/erp/diySolutionNote/add',
      edit: '/erp/diySolutionNote/edit',
      delete: '/erp/diySolutionNote/delete',
    },
    solutionNoteItem: {
      get: '/erp/diySolutionNoteItem/queryById',
      list: '/erp/diySolutionNoteItem/list',
      save: '/erp/diySolutionNoteItem/add',
      edit: '/erp/diySolutionNoteItem/edit',
      delete: '/erp/diySolutionNoteItem/delete',
    },
}

//调试
export const isDebug: boolean = false;

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
  note: {id: "0", name: "", solutionId:"0" },//当前note信息，包含引用的solution
  solution: {id: "0", extJson:solutionExtJson, price: 0, priceSum: priceSum, priceRuleDesc: "", priceStatus: "" },//当前solution信息，包含概要信息
  section: {id: "0", extJson: {region: ""}, priceSum: priceSum, priceRuleDesc: "", priceStatus: ""}, //当前section
  item:{id: "0"}, //当前solutionItem
  noteItem:{id: "0",name:"",content:""}, //当前noteItem
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
  { id: "1", name: '新加坡', priority: 1, section:{id:1},options:[], spu:{type:{item:"hotel"}}, sku:[], amount: 1, price: 0, prioritySpu: 1, prioritySku: 0},
  { id: "2", name: '纽约', priority:2, section:{id:1}, options:[], spu:{type:{item:"scene"}},sku:[], amount: 1, price: 0, prioritySpu: 1, prioritySku: 0},
]);

//选定section下的笔记条目信息：注意一次获取一个section下的列表
export const noteItems = reactive([
  { id: "1", name: '笔记1', priority: 1.0, sectionId:"0", solutionId: "0", solutionItemId: "0", contentType: "chatgpt", content: "笔记能够直接生成，包括AI生成、定制师生成、用户生成" },
  { id: "2", name: '笔记2', priority:2.0, sectionId:"0", solutionId: "0", solutionItemId: "0", contentType: "hotel", content: "也可以从资源库、素材库、知识库中选取" },
]);

//根据id加载solutionNote
export const loadNote = (id) => {
  console.log("try load note by id.......",id);
  hot.note.id = id; //修改当前note id
  console.log("access token",getToken());
  //加载solution
  axios
    .get(glob.domainUrl + bizAPI.solutionNote.get,{...BIZ_CONFIG,
      params:{
        id: id
      }
    })
    .then(res => { 
      console.log("got note.",res);
      if(res.data.result){
        //更新当前note
        hot.note = res.data.result;
        //继续加载对应的solution
        loadSolution(hot.note.solutionId);
        //加载section
        loadSections(hot.note.solutionId);
      } 
    })
    .catch(function (error) { 
      console.log("failed load solution by id",error);
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
          let extJson = {regison: "目的地?"};
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
        //装载note items
        loadNoteItems();
      }else{//无section则根据solution日期创建，且
        console.log("hey dude, please add at least one section.")
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
  //重新加载solution items
  loadSolutionItems(source.id);
  //重新加载note items
  loadNoteItems(source.id); //根据sectionId加载
}

//显示提示词界面
export const goPrompts = () => {
  router.push("/prompts/chatgpt");
}

/**
 * 切换solutionItem是自动打开抽屉，显示对应条目详情
 * 当前通过Hack方式完成，触发按钮操作完成
 * @param source 点选的item
 */
export const changeSolutionItem = (source) => {
  if(hot.item.id == source.id) //可以取消选择
    hot.item = {id:"0"};
  else
    hot.item = source;

  console.log("change solution item.",source);

  //点击时尝试打开详情抽屉：注意需要通过dom操作触发查看详情界面完成

  let amisBtn = document.querySelector('.__sx__btn>span');
  if(amisBtn){
    amisBtn.click();
  }
}

/**
 * 切换noteItem是自动打开抽屉，显示对应条目详情
 * 当前通过Hack方式完成，触发按钮操作完成
 * @param source 点选的item
 */
export const changeNoteItem = (source) => {
  hot.noteItem = source;
  console.log("change note item.",source);

  //点击时尝试打开详情抽屉：注意需要通过dom操作触发查看详情界面完成
  let amisBtn = document.querySelector('.__sx__notebtn>span');
  if(amisBtn){
    amisBtn.click();
  }
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
      }
    })
    .catch(function (error) { 
      console.log("failed load items by solution id and section id",error);
    });
}

/**
 * 根据sectionId加载noteItem列表
 */
export const loadNoteItems = () => {
  let sectionId = hot.section.id;
  console.log("try load note items by note id and section id", hot.note.id, sectionId);

  //加载solution
  axios
    .get(glob.domainUrl + bizAPI.solutionNoteItem.list,{...BIZ_CONFIG,
      params:{
        solutionNoteId: hot.note.id,
        sectionId: hot.section.id,
      }
    })
    .then(res => { 
      console.log("got note items.",res);
      if(res.data.result && res.data.result.records ){ //装载items， 按照优先级排序
        let processedItems = res.data.result.records;
        //按照优先级排序
        processedItems.sort( (a, b) => {
          return a.priority - b.priority;
        });
        //清空并装载
        noteItems.splice(0, noteItems.length, ...processedItems);
        console.log("processed note items.", noteItems);
      }
    })
    .catch(function (error) { 
      console.log("failed load note items by solution id and section id",error);
    });
}


/**
 * 拖动noteItem，并调整次序
 * 比较两个noteItem位置，并且修改
 * @param e 
 * @param originalEvent 
 * @returns 
 */
export const moveNoteItem = (e) => { 
  console.log("try move note item.",e);
  //调整次序:
  let source = e.draggedContext.element;
  let target = e.relatedContext.element;
  console.log("move note item", e, source, target);

  //根据source、target前后设置新的priority
  let idx = noteItems.findIndex( item => item.id === target.id );
  let priorityTo = source.priority; //默认位置不变
  if(target.priority<source.priority){ //找到target，以及target之前的元素
    priorityTo = idx>0 ? noteItems[idx-1].priority: 0;
  }else{ //找到之后的元素
    priorityTo = idx<noteItems.length-1 ? noteItems[idx+1].priority: noteItems[noteItems.length-1].priority+10;
  }
  source.priority = (priorityTo + target.priority)/2; //设置为中间值

  //提交修改：注意仅需提交即可，前端界面已调整
  console.log("try update note item.",source);
  axios
    .post(glob.domainUrl + bizAPI.solutionNoteItem.edit,source,BIZ_CONFIG)
    .then(res => { 
      console.log("note item updated.",res);
    })
    .catch(function (error) { 
      console.log("failed update note item",error);
      
    });

  //false表示阻止拖拽
  return true;
}

/**
 * 新建note item。默认名称为空白，添加在最后一个
 * 包含两种情况：
 * 1，从侧边栏spu或素材库直接添加时，将读取图文内容保存
 * 2，从侧边栏编辑表单添加时，直接提交内容
 * 
 * @param type 类型：ai、spu、manual、kb、material等
 * @param name 笔记条目名称或类型名称，如文心一言、ChatGPT等
 * @param content 笔记内容，原始图文内容
 */
export const addNoteItem = (type, name, content) => {
  let noteItem = {
    id: Md5.hashStr(hot.note.id+hot.section.id+new Date().getTime()),//组织唯一id
    solutionNoteId: hot.note.id,
    sectionId: hot.section.id,
    solutionItemId: hot.item.id,
    name: name,
    contentType: type,
    content: content,
    priority: new Date().getTime()*0.00000001, //默认用时间排序
  }
  console.log("try add note item.",noteItem);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.solutionNoteItem.save,noteItem,BIZ_CONFIG)
    .then(res => { 
      console.log("note item created.",res);
      //更新界面
      noteItem.solutionItemId_dictText = hot.item.name;
      noteItems.push(noteItem);
    })
    .catch(function (error) { 
      console.log("failed create note item",error);
      
    });
}

/**
 * 保存修改后的笔记条目
 * 
 * @param name 笔记条目名称或类型名称，如文心一言、ChatGPT等
 * @param content 笔记内容，原始图文内容
 */
export const saveNoteItem = (name, content) => {
  let noteItem = hot.noteItem;
  noteItem.name = name;
  noteItem.content = content;
  hot.noteItem = noteItem;
  console.log("try save note item.",noteItem);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.solutionNoteItem.edit,noteItem,BIZ_CONFIG)
    .then(res => { 
      console.log("note item created.",res);
      //更新界面
      let idx = noteItems.findIndex(item => item.id === noteItem.id );
      if(idx>=0){
        noteItems.splice(idx, 1, noteItem);
      }
      
    })
    .catch(function (error) { 
      console.log("failed save note item",error);
      
    });
}

/**
 * 删除note item
 */
export const removeNoteItem = (e, noteItem) => {
  e.stopPropagation();
  console.log("try remove note item.",noteItem);
  //提交删除
  axios
    .delete(glob.domainUrl + bizAPI.solutionNoteItem.delete+"?id="+noteItem.id,BIZ_CONFIG)
    .then(res => { 
      console.log("solution note item removed.",res);
      //更新界面：删除后往前获取，不存在在往后获取
      let idx = noteItems.findIndex(item => item.id === noteItem.id);
      noteItems.splice(idx,1);
    })
    .catch(function (error) { 
      console.log("failed remove note item",error);
    });
}

//增加SPU素材为笔记条目：直接获取图文内容提交新建，同时将类型名称设置为spu的名称
export const addSpu = (spu) => {
  console.log("try insert spu.......",spu);
  if(hot.section && hot.section.id !== "0"){ //如果有选中section则直接添加
    //TODO 获取SPU内容并保存
    addNoteItem(spu.type && spu.type.item ? spu.type.item:"unknown", spu.name, spu.content?spu.content:spu.summary);
  }
}

//根据当前选中的SolutionItem获取SPU
export const getSpu = () => {
  return hot.item.spu;
}

/**
 * 根据顺序获取日期
 * @returns 
 */
export const changeStartDate = () => {
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
 * 保存笔记
 */
export const saveNote = () => {
  console.log("try save note.",hot.note);
  //提交创建
  axios
    .post(glob.domainUrl + bizAPI.solutionNote.edit,hot.note,BIZ_CONFIG)
    .then(res => { 
      console.log("note saved.",res);
      //建立索引
      indexNote();
    })
    .catch(function (error) { 
      console.log("failed save note",error);
    });
}


//提交索引：将note提交加入索引，能够在小程序等检索
export const indexNote = () => {
  //tags根据空格分隔，并且添加目的地
  let tags = new Array();
  if(hot.note.tags && hot.note.tags.trim().length>0 ){//添加note tags
    hot.note.tags.split(" ").forEach( tag => {
      if(tag.trim().length>0 && tags.indexOf(tag.trim()) <0 )
        tags.push(tag.trim());
    });
  }
  if(hot.solution.tags && hot.solution.tags.trim().length>0 ){//添加solution tags
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
  //组织content
  let content = "";
  noteItems.forEach( noteItem => { //将所有noteItem的content加入
    content += noteItem.content + " ";
  });
  solutionItems.forEach( solutionItem => {
    content += solutionItem.name + " ";
  });
  //组织doc
  let doc = {
    tenant: {
      id: hot.note.tenantId || getTenantId(),
      name: hot.note.tenantId_dictText || "",
    },
    id: hot.note.id,
    name: hot.note.name,
    content: content, //直接用solutionItem条目名称拼接
    solution: {
      id: hot.solution.id || "",
      name: hot.solution.name || "",
      //logo: hot.solution.logo || "",
    },
    status: hot.note.status,   
    broker:{
      id: hot.note.brokerId || "",
      nickname: hot.note.brokerId_dictText || "",
    },
    thirdUser:{
      id: hot.note.thirdUserId || "",
      realname: hot.note.thirdUserId_dictText || "",
    },
    description: hot.note.description, 
    tags: tags,              
    logo: hot.note.logo,
  }    
  console.log("try to index note doc.",doc);
  let data = {
      records:[{
          value:doc
      }]
  };
  //提交创建
  axios
    .post(MESSAGE_API+"/topics/note",data,MESSAGE_CONFIG)
    .then(res => { 
      console.log("note indexed.",res);
    })
    .catch(function (error) { 
      console.log("failed index note",error);
    });


}