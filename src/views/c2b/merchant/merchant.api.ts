import axios from 'axios';
import { UploadFileParams } from '/#/axios';
import {BIZ_API, BIZ_CONFIG} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { reactive } from 'vue';
import { truncate } from 'fs';
const glob = useGlobSetting();

export const isDebug = true;

//商户信息数据
export const hot = reactive({
	"business_code": "1596785690732", //自行生成，前缀为服务商户号，数字及字母
	"subject_info": {
		"subject_type": "SUBJECT_TYPE_ENTERPRISE",
    // "finance_institution": false, //我们不会遇到这类客户，直接false
		"business_license_info": { //营业执照
			"license_copy": "mxX07DyfM-bJyGJYCTyW-4wrXpJ5fq_bgYfWkIZZgjenf6Ct1gKV_FpkzgyQrf5ETVEyOWhC_0cbhOATODuLBAkxGl6Cvj31lh6OFAIHnwI",
			"license_number": "123456789012345678",
			"merchant_name": "腾讯科技有限公司",
			"legal_person": "张三"
		},
		"identity_info": { //经营者、法人信息
			"id_doc_type": "IDENTIFICATION_TYPE_IDCARD",
			"id_card_info": {
				"id_card_copy": "mxX07DyfM-bJyGJYCTyW-4wrXpJ5fq_bgYfWkIZZgjenf6Ct1gKV_FpkzgyQrf5ETVEyOWhC_0cbhOATODuLBAkxGl6Cvj31lh6OFAIHnwI",
				"id_card_national": "mxX07DyfM-bJyGJYCTyW-4wrXpJ5fq_bgYfWkIZZgjenf6Ct1gKV_FpkzgyQrf5ETVEyOWhC_0cbhOATODuLBAkxGl6Cvj31lh6OFAIHnwI",
				"id_card_name": "张三",
				"id_card_number": "110110202001011234",
        "id_card_address": "与身份证保持一致",
				"card_period_begin": "2016-06-06",
				"card_period_end": "2026-06-06"
			},
			"owner": true //是否是最终受益人
		},
		"ubo_info": { //最终受益人信息
			"id_type": "IDENTIFICATION_TYPE_IDCARD",
			"id_card_copy": "mxX07DyfM-bJyGJYCTyW-4wrXpJ5fq_bgYfWkIZZgjenf6Ct1gKV_FpkzgyQrf5ETVEyOWhC_0cbhOATODuLBAkxGl6Cvj31lh6OFAIHnwI",
			"id_card_national": "mxX07DyfM-bJyGJYCTyW-4wrXpJ5fq_bgYfWkIZZgjenf6Ct1gKV_FpkzgyQrf5ETVEyOWhC_0cbhOATODuLBAkxGl6Cvj31lh6OFAIHnwI",
			"id_doc_copy": "mxX07DyfM-bJyGJYCTyW-4wrXpJ5fq_bgYfWkIZZgjenf6Ct1gKV_FpkzgyQrf5ETVEyOWhC_0cbhOATODuLBAkxGl6Cvj31lh6OFAIHnwI",
			"name": "张三",
			"id_number": "110110202001011234",
			"id_period_begin": "2016-06-06",
			"id_period_end": "2026-06-06"
		}
	},
	"business_info": { //经营资料
		"merchant_shortname": "商户简称",
		"service_phone": "13212345678",
		"sales_info": {
			"sales_scenes_type": ["SALES_SCENES_MINI_PROGRAM"],
			"mini_program_info": {
				"mini_program_appid": "wxe5f52902cf4de896" //TODO 填写服务商APPID
			}
		}
	},
	"settlement_info": { //行业资质/结算规则：注意，优惠费率仅在申请完成后填写
		"settlement_id": "716",
		"qualification_type": "餐饮",
	},
  "bank_account_info": { //结算银行账户
    "bank_account_type": "BANK_ACCOUNT_TYPE_CORPORATE",//对公账户
    "account_name":"需与营业执照一致",
    "account_bank": "", //仅支持17家直连银行
    "bank_address_code":"",
    "account_number":"",
  },
  "contact_info": { //超级管理员
    "contact_type": "LEGAL", //超级管理员类型：LEGAL经营者法人，SUPER经办人
		"contact_name": "张三",
		"mobile_phone": "13112345678",
		"contact_email": "abc@qq.com",
    //以下为经办人时必填
    "contact_id_doc_type": "IDENTIFICATION_TYPE_IDCARD", //
		"contact_id_number": "110110202001011234",
    "contact_id_doc_copy": "",//证件正面照片mediaId
    "contact_id_doc_copy_back":"",//证件背面mediaId
    "contact_period_begin":"",
    "contact_period_end":"",
    "business_authorization_letter":"",//授权文件图片mediaId
    "openid":"", //选填： 如果填写则签约时需要核验身份一致
	},
  "addition_info":{ //审核中需要的附加材料：仅在审核需要补充时才填写
    "legal_person_commitment":"", //法人开户承诺函mediaId
    "legal_person_video":"",//法人开户承诺视频mediaId
    "business_addition_pics":[], //最多5张，附加材料mediaId
    "business_addition_msg": "", //补充说明
  }
});


/** 
 * @deprecated 文件上传 ：采用手动方式上传，当前未启用。
 * 采用JUpload控件，通过api指定后端上传接口，通过checkFileType上传前检查，通过handleUploaded处理回调
 * */
export function uploadFile( file ) {
    console.log("try upload merchant file");
  return new Promise(function (resolve, reject) { //TODO 直接从搜索引擎获取所有笔记
    console.log("try upload");

    axios
    .post(BIZ_API,file,BIZ_CONFIG)
    .then(res => { 
      console.log("file uploaded.",res);
      resolve(res) //获取数据结果
    })
    .catch(function (error) { 
      console.log("upload failed",error);
      reject(error)
    });

  });
}

/** 文件上传后更新表单数据 
 * @param file: 上传文件信息
 * @param fileList: 上传结果列表
*/
export function handleUploaded( {file, fileList} ) {
  console.log("file uploaded", file, fileList);
}

/** 文件上传前检查文件类型 */
export function checkFileType( file ) {
    console.log("check file type before upload.", file);
  }
