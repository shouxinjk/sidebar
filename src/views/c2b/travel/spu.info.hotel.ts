import {FormSchema} from '/@/components/Table';
import {isDebug} from './spu.api';
import 'amis/sdk/tinymce';
import 'amis/sdk/rest';

/**
 * 获取SPU详情tab列表
 * @returns 包含基本信息、图文详情等tab
 */
export const getHotelSpuInfo = () => {
  return JSON.parse(JSON.stringify(hotelInfoTabs));
}

/**
 * 获取SPU详情tab列表
 * @returns 包含基本信息、图文详情等tab
 */
export const getHotelSkuInfo = () => {
  let skuInfo = JSON.stringify(hotelInfoTabs);
  skuInfo = skuInfo.replace(/spu\./g,"sku.");
  let skuInfoJson = JSON.parse(skuInfo);
  console.log("skuInfoJson",skuInfoJson)
  return skuInfoJson;
};

//酒店SPU查询表单
export const hotelSearchFormSpu: FormSchema = {
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
          "type": "input-text",
          "label": "酒店名称",
          "name": "name",
          "id": "u:beccf187250e"
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
      "id": "u:6d4d0bf78719"
    },
    {
      "type": "container",
      "body": [
        {
          "type": "select",
          "label": "酒店星级",
          "name": "star",
          "options": [
            {
              "label": "不限",
              "value": 0
            },
            {
              "label": "1星及以上",
              "value": 1
            },
            {
              "label": "2星及以上",
              "value": 2
            },
            {
              "label": "3星及以上",
              "value": 3
            },
            {
              "label": "4星及以上",
              "value": 4
            },
            {
              "label": "5星及以上",
              "value": 5
            }
          ],
          "id": "u:4b612990c153",
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
                  "componentId": "servicespuhotel", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
                  "args":{
                    "&": "$$"
                  }
                },
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
                  "componentId": "servicespuhotel", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
export const hotelTableColumns: FormSchema = [
  {
    "label": "酒店名称",
    "name": "spu.name",
    "quickEdit": false,
    "type": "text",
    "placeholder": "-",
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
    "label": "星级",
    "name": "spu.props.stars"
  },
  {
    "type": "text",
    "label": "开业年份",
    "placeholder": "-",
    "name": "spu.props.openYear"
  },
  {
    "type": "text",
    "label": "客房数量",
    "placeholder": "-",
    "name": "spu.props.rooms"
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
export const hotelInfoTabs: FormSchema = [
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
            "label": "名称",
            "type": "input-text",
            "name": "spu.name",
          },
          {
            "label": "联系方式",
            "type": "input-text",
            "name": "spu.props.tel",
          },
          {
            "type": "input-rating",
            "label": "星级",
            "name": "spu.props.stars",
            "allowClear": false,
            "half": true,
            "colors": {
              "2": "#abadb1",
              "3": "#787b81",
              "5": "#ffa900"
            },
            "texts": {
              "1": "条件一般",
              "2": "条件较好",
              "3": "舒适",
              "4": "高档",
              "5": "豪华"
            },
          },
          {
            "type": "input-text",
            "label": "目的地/城市",
            "name": "spu.region",
          },
          {
            "type": "input-text",
            "label": "开业年份",
            "name": "spu.props.openYear",
          },
          {
            "type": "input-text",
            "label": "装修年份",
            "name": "spu.props.decorateYear",
          },
          {
            "type": "input-text",
            "label": "客房数量",
            "name": "spu.props.rooms",
          },
          {
            "type": "radios",
            "label": "是否连锁",
            "name": "spu.props.ischain",
            "options": [
              {
                "label": "是",
                "value": "yes"
              },
              {
                "label": "否",
                "value": "no"
              }
            ],
            "id": "u:b9c21c3167bb"
          },
          {
            "type": "input-tag",
            "label": "酒店设施",
            "name": "spu.props.facilities",
            "options": [
              "健身房","游泳池","无障碍设施","SPA/桑拿房","洗衣房","充电桩","多功能厅"
            ]
          },
          {
            "label": "酒店服务",
            "type": "input-tag",
            "name": "spu.props.services",
            "options": [
              "接机/送机服务","唤醒服务","送餐服务","快速入住退房","外送洗衣服务","SPA/水疗"
            ] 
          }
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
            "label": "酒店图片",
            "name": "spu.logo",
          },
          /** */
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
    "title": "位置信息",
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
    "title": "使用说明",
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
            "label": "入住时间",
            "type": "input-text",
            "name": "spu.props.checkin",
          },
          {
            "type": "input-text",
            "label": "退房时间",
            "name": "spu.props.checkout",
          },
          {
            "label": "酒店早餐",
            "type": "input-text",
            "name": "spu.props.breakfast",
          },                  
          {
            "type": "textarea",
            "label": "儿童及加床",
            "name": "spu.props.moreBeds",
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

