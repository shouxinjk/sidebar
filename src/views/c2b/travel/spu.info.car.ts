import {FormSchema} from '/@/components/Table';
import {isDebug} from './spu.api';

/**
 * 获取SPU详情tab列表
 * @returns 包含基本信息、图文详情等tab
 */
export const getCarSpuInfo = () => {
  return JSON.parse(JSON.stringify(carInfoTabs));
}

/**
 * 获取SPU详情tab列表
 * @returns 包含基本信息、图文详情等tab
 */
export const getCarSkuInfo = () => {
  let skuInfo = JSON.stringify(carInfoTabs);
  skuInfo = skuInfo.replace(/spu\./g,"sku.");
  let skuInfoJson = JSON.parse(skuInfo);
  console.log("skuInfoJson",skuInfoJson)
  return skuInfoJson;
};

//SPU查询表单
export const carSearchFormSpu: FormSchema = {
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
          "label": "车辆类型",
          "name": "type",
          "options": [
            {
              "label": "不限",
              "value": ""
            },
            {
              "label": "奢华",
              "value": 8
            },
            {
              "label": "高档",
              "value": 16
            },
            {
              "label": "舒适",
              "value": 24
            },
            {
              "label": "其他",
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
    // {
    //   "type": "container",
    //   "body": [
    //     {
    //       "type": "select",
    //       "label": "驾照类型",
    //       "name": "type",
    //       "options": [
    //         {
    //           "label": "不限",
    //           "value": ""
    //         },
    //         {
    //           "label": "A类",
    //           "value": 8
    //         },
    //         {
    //           "label": "B类",
    //           "value": 16
    //         },
    //         {
    //           "label": "C类",
    //           "value": 24
    //         },
    //       ],
    //       "multiple": false
    //     }
    //   ],
    //   "size": "xs",
    //   "style": {
    //     "position": "static",
    //     "display": "block",
    //     "flex": "1 1 auto",
    //     "flexGrow": 1,
    //     "flexBasis": "auto"
    //   },
    //   "wrapperBody": false,
    //   "isFixedHeight": false,
    //   "isFixedWidth": false,
    //   "id": "u:2f6f51be2d9f"
    // },
    {
      "type": "container",
      "body": [
        {
          "type": "input-text",
          "label": "座位数",
          "name": "name",
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
                  "componentId": "servicespucar", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
                  "componentId": "servicespucar", // 触发spu数据加载：注意需要触发service，table仅负责显示数据
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
export const carTableColumns: FormSchema = [
  {
    "label": "名称",
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
    "label": "车辆类型",
    "name": "spu.props.type"
  },
  {
    "type": "text",
    "label": "品牌",
    "name": "spu.props.brand"
  },  
  {
    "type": "text",
    "label": "座位数",
    "name": "spu.props.seats"
  },
  {
    "type": "text",
    "label": "驾照要求",
    "name": "spu.props.license"
  },
  {
    "type": "text",
    "label": "使用类型",
    "name": "spu.props.bizType"
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
export const carInfoTabs: FormSchema = [
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
            "label": "车辆类型",
            "type": "input-text",
            "name": "spu.props.type",
          },
          {
            "type": "input-text",
            "label": "品牌",
            "name": "spu.props.brand",
          },
          {
            "label": "座位数",
            "type": "input-text",
            "name": "spu.props.seats",
          },
          {
            "type": "input-text",
            "label": "上牌时间",
            "name": "spu.props.openYear",
          },
          {
            "type": "input-text",
            "label": "里程数",
            "name": "spu.props.miles",
          },
          {
            "type": "input-text",
            "label": "目的地/城市",
            "name": "spu.region",
          },
          {
            "type": "input-tag",
            "label": "用车类型",
            "name": "spu.props.bizType",
            "options": [
              "日租车","按里程","时间+里程"
            ] 
          },
          {
            "type": "radios",
            "label": "是否带司机",
            "name": "spu.props.hasDriver",
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
            "label": "车辆图片",
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

