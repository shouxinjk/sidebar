import axios from 'axios';
import {Md5} from 'ts-md5';

import { getTenantId, getToken } from "/@/utils/auth";
import { getTenantById } from '/@/views/system/tenant/tenant.api';

import {SEARCH_API, SEARCH_CONFIG, PLATFORM_TENANT} from '/@/settings/iLifeSetting';
import { useGlobSetting } from '/@/hooks/setting';
import { timestamp } from '@vueuse/shared';

const glob = useGlobSetting();

//业务数据API
export const bizAPI = {
    "listApps": '/erp/intTenantSoftware/list-full',
    "listServices": '/erp/intTenantService/list-full',
    "listPricePlans": '/erp/stoPricePlan/list',
    "listTemplates": '/erp/intTenantViewTemplate/list-full',
    "listConnectorSchemes": '/erp/stoConnectorScheme/list',
    "listConnectorSchemesByType": '/erp/stoConnectorScheme/list-by-type',
    "listConnectors": '/erp/stoConnector/list',
    "listConnectorsByType": '/erp/stoConnector/list-by-type',
}

//调试
export const isDebug: boolean = false;


