import {FormSchema} from '/@/components/Table';
import {isDebug} from './spu.api';

/**
 * 获取SPU详情tab列表
 * @returns 包含基本信息、图文详情等tab
 */
export const getShowSpuInfo = () => {
  return JSON.parse(JSON.stringify(showInfoTabs));
}

/**
 * 获取SPU详情tab列表
 * @returns 包含基本信息、图文详情等tab
 */
export const getShowSkuInfo = () => {
  let skuInfo = JSON.stringify(showInfoTabs);
  skuInfo = skuInfo.replace(/spu\./g,"sku.");
  let skuInfoJson = JSON.parse(skuInfo);
  console.log("skuInfoJson",skuInfoJson)
  return skuInfoJson;
};

//酒店SPU查询表单
export const showSearchFormSpu: FormSchema = {
  "type": "flex",
  "className": "p-1",
  "items": [
    {
      "type": "container",
      "body": [
        {
          "type": "input-text",
          "label": "目的地/城市",
          "name": "region",
          "id": "u:071bc16926f8"
        }
      ],
      "size": "xs",
      "style": {
        "position": "static",
        "display": "block",
        "flex": "1 1 auto",
        "flexGrow": 1,
        "flexBasis": "auto"
      },
      "wrapperBody": false,
      "isFixedHeight": false,
      "isFixedWidth": false,
      "id": "u:974269b02572"
    },
    {
      "type": "container",
      "body": [
        {
          "type": "select",
          "label": "演出主题",
          "name": "type",
          "options": [
            {
              "label": "不限",
              "value": ""
            },
            {
              "label": "舞台剧",
              "value": 8
            },
            {
              "label": "历史故事",
              "value": 16
            },
            {
              "label": "娱乐歌舞",
              "value": 24
            },
            {
              "label": "互动体验",
              "value": 4
            },
          ],
          "multiple": false
        }
      ],
      "size": "xs",
      "style": {
        "position": "static",
        "display": "block",
        "flex": "1 1 auto",
        "flexGrow": 1,
        "flexBasis": "auto"
      },
      "wrapperBody": false,
      "isFixedHeight": false,
      "isFixedWidth": false,
      "id": "u:2f6f51be2d9f"
    },
    {
      "type": "container",
      "body": [
        {
          "type": "input-text",
          "label": "关键字",
          "name": "keyword",
          "id": "u:a1f668543851"
        }
      ],
      "size": "xs",
      "style": {
        "position": "static",
        "display": "block",
        "flex": "1 1 auto",
        "flexGrow": 1,
        "flexBasis": "auto"
      },
      "wrapperBody": false,
      "isFixedHeight": false,
      "isFixedWidth": false,
      "id": "u:5cbf5be5c593"
    },
    {
      "type": "container",
      "body": [
        {
          "type": "button",
          "label": "搜索",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                  "componentId": "servicespushow", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                  "args":{
                    "&": "$$"
                  }
                }
              ]
            }
          },
          "size": "md",
          "level": "primary"
        },
        {
          "type": "button",
          "label": "新增",
          "className":"ml-2",
          "onEvent": {
            "click": {
              "actions": [
                {
                  "actionType": "reload", // 重新加载SPU表格，根据新的搜索条件
                  "componentId": "servicespushow", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                  "args":{
                    "__sxSpu":"addNew",//设置隐藏变量，将新增数据放在第一条
                    "&": "$$"
                  }
                },
              ]
            }
          },
          "size": "md",
          "level": "success"
        }
      ],
      "size": "xs",
      "style": {
        "position": "static",
        "display": "block",
        "flex": "1 1 auto",
        "flexGrow": 1,
        "flexBasis": "auto"
      },
      "wrapperBody": false,
      "isFixedHeight": false,
      "isFixedWidth": false,
      "id": "u:6b3a2bc5c39e"
    }
  ],
  "style": {
    "position": "static",
    "flexWrap": "nowrap"
  },
  "direction": "row",
  "justify": "space-evenly",
  "alignItems": "stretch",
  "id": "u:0fef52614e51",
  "isFixedHeight": false,
  "isFixedWidth": false
};


/**
 * 列表字段：适用于spu公库、spu私库
 */
export const showTableColumns: FormSchema = [
  {
    "label": "演出名称",
    "name": "spu.name",
    "quickEdit": false,
    "type": "text",
    "placeholder": "-"
  },
  {
    "label": "城市/目的地",
    "name": "spu.region",
    "quickEdit": false,
    "type": "text",
    "placeholder": "-"
  },
  {
    "type": "text",
    "label": "演出类型",
    "name": "spu.props.type"
  },
  {
    "type": "text",
    "label": "内容主题",
    "name": "spu.props.subject"
  },
  {
    "type": "text",
    "label": "演出时长",
    "name": "spu.props.playTime"
  },
  {
    "type": "text",
    "label": "推荐度",
    "name": "spu.props.rank"
  },
  {
    "type": "text",
    "label": "来源平台",
    "placeholder": "-",
    "name": "spu.distributor.name"
  },
  {
    "type": "text",
    "label": "供应商",
    "placeholder": "-",
    "name": "spu.seller.name"
  },
  {
    "type": "text",
    "label": "网络评分",
    "placeholder": "-",
    "name": "spu.rank.score"
  },
  {
    "type": "text",
    "label": "热度",
    "placeholder": "-",
    "name": "spu.rank.amount"
  }
];

/**
 * 侧边栏SPU表单详情，包含Tab结构，用于在不同界面中引用，包括SPU公库、SPU私库、SKU私库、solution定制页面
 * 默认为SPU表单，SKU表单需要替换字段设置
 */
export const showInfoTabs: FormSchema = [
  {
    "title": "基本信息",
    "body": [
      {
        "type": "container", //重要：必须使用container，不能使用form，会导致rowItem无法传递
        "id": "spuBaseInfo",
        "title": "表单",
        "wrapWithPanel": false,
        "data": "${rowItem}", //传递当前选中SPU
        "debug": isDebug,
        "debugConfig": {
          "enableClipboard": true,
          "displayDataTypes": true
        },
        "body": [
          {
            "label": "演出名称",
            "type": "input-text",
            "name": "spu.name",
          },
          {
            "label": "演出场馆",
            "type": "input-text",
            "name": "spu.props.tel",
          },
          {
            "type": "input-tag",
            "label": "演出类型",
            "name": "spu.props.type",
            "options": [
              "歌舞表演","舞台剧","历史剧","互动体验","民俗歌舞"
            ]
          },
          {
            "type": "input-text",
            "label": "目的地/城市",
            "name": "spu.region",
          },
          {
            "type": "input-text",
            "label": "演出时长",
            "name": "spu.props.playTime",
          },
          {
            "type": "textarea",
            "label": "演出场次",
            "name": "spu.props.timeTable",
          },         
        ],
        "mode": "horizontal"
      }
    ],
  },
  {
    "title": "图文详情",
    "id": "spuHtmlInfo",
    "body": [
      {
        "type": "form",
        "title": "表单",
        "data": "${rowItem}", //传递当前选中SPU
        "wrapWithPanel": false,
        "debug": isDebug,
        "debugConfig": {
          "enableClipboard": true,
          "displayDataTypes": true
        },
        "body": [
          {
            "label": "概要介绍",
            "type": "textarea",
            "name": "spu.summary",
          },
          {
            "type": "input-tag",
            "label": "亮点/标签",
            "name": "spu.tags",
          },
          /**
          {
            "type": "input-image",
            "label": "演出图片",
            "name": "spu.logo",
          },
          //** */
          {
            "type": "images",
            "enlargeAble": true,
            "name": "spu.images",
          },
          {
            "type": "input-rich-text",
            "label": "图文详情",
            "name": "spu.content",
            //"receiver": "/api/upload/image",
            "vendor": "tinymce",
            "options": {
              "menubar": "true",
              "height": 600,
              "plugins": [
                "advlist",
                "autolink",
                "link",
                "image",
                "lists",
                "charmap",
                "preview",
                "anchor",
                "pagebreak",
                "searchreplace",
                "wordcount",
                "visualblocks",
                "visualchars",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "nonbreaking",
                "table",
                "emoticons",
                "template",
                "help"
              ],
              "toolbar": "undo redo | formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
            }
          }
        ],
      }
    ]
  },
  {
    "title": "演出场馆",
    "id": "spuExtInfo",
    "body": [
      {
        "type": "form",
        "title": "表单",
        "data": "${rowItem}", //传递当前选中SPU
        "wrapWithPanel": false,
        "debug": isDebug,
        "debugConfig": {
          "enableClipboard": true,
          "displayDataTypes": true
        },
        "body": [
          {
            "label": "地理位置",
            //"type": "location-picker",
            "type": "input-text",
            "name": "spu.loc.location",
            "ak": "XwNTgTOf5mYaZYhQ0OiIb6GmOHsSZWul",
          },
          {
            "type": "input-tag",
            "label": "附近商圈",
            "name": "spu.loc.pois",
            "options": [
              "景点","车站", "商场","高铁站"
            ]
          },
          {
            "type": "input-text",
            "label": "离机场距离",
            "name": "spu.loc.airport",
            "minRows": 3,
            "maxRows": 20
          },
          {
            "type": "input-text",
            "label": "离火车站/高铁站距离",
            "name": "spu.loc.railwaystation",
            "minRows": 3,
            "maxRows": 20
          }
        ],
        "mode": "normal",
      }
    ]
  },
  {
    "title": "费用说明",
    "body": [
      {
        "type": "form",
        "title": "表单",
        "wrapWithPanel": false,
        "data": "${rowItem}", //传递当前选中SPU
        "debug": isDebug,
        "debugConfig": {
          "enableClipboard": true,
          "displayDataTypes": true
        },
        "body": [
          {
            "type": "textarea",
            "label": "费用包含",
            "name": "spu.cost.include",
          },
          {
            "type": "textarea",
            "label": "费用不含",
            "name": "spu.cost.exclude",
          },
          {
            "type": "textarea",
            "label": "补充说明",
            "name": "spu.cost.tips",
          },
        ],
        "mode": "horizontal"
      }
    ],
  },
  {
    "title": "退改政策",
    "body": [
      {
        "type": "form",
        "id": "spuPolicyInfo",
        "title": "表单",
        "wrapWithPanel": false,
        "data": "${rowItem}", //传递当前选中SPU
        "debug": isDebug,
        "debugConfig": {
          "enableClipboard": true,
          "displayDataTypes": true
        },
        "body": [
          {
            "type": "textarea",
            "label": "退款政策",
            "name": "spu.policy.refund",
          },
          {
            "type": "textarea",
            "label": "变更政策",
            "name": "spu.policy.change",
          },
          {
            "type": "textarea",
            "label": "特殊情况",
            "name": "spu.policy.exception",
          },
        ],
        "mode": "horizontal"
      }
    ],
  },
  {
    "title": "观演须知",
    "body": [
      {
        "type": "form",
        "id": "spuPolicyInfo",
        "title": "表单",
        "wrapWithPanel": false,
        "data": "${rowItem}", //传递当前选中SPU
        "debug": isDebug,
        "debugConfig": {
          "enableClipboard": true,
          "displayDataTypes": true
        },
        "body": [                 
          {
            "label": "开放时间",
            "type": "input-text",
            "name": "spu.props.openTime",
          },
          {
            "type": "textarea",
            "label": "能否携带宠物",
            "name": "spu.policy.pets",
          },                  
          {
            "type": "textarea",
            "label": "温馨提示",
            "name": "spu.props.tips",
          }
        ],
        "mode": "horizontal"
      }
    ],
  },
  {
    "title": "预订须知",
    "body": [
      {
        "type": "form",
        "id": "spuPolicyInfo",
        "title": "表单",
        "wrapWithPanel": false,
        "data": "${rowItem}", //传递当前选中SPU
        "debug": isDebug,
        "debugConfig": {
          "enableClipboard": true,
          "displayDataTypes": true
        },
        "body": [
          {
            "type": "textarea",
            "label": "预订必读",
            "name": "spu.policy.requirement",
          },
          {
            "type": "textarea",
            "label": "人群要求",
            "name": "spu.policy.person",
          },    
          {
            "type": "textarea",
            "label": "付款要求",
            "name": "spu.policy.payment",
          },               
          {
            "type": "textarea",
            "label": "注意事项",
            "name": "spu.policy.tips",
          }
        ],
        "mode": "horizontal"
      }
    ],
  }
]

