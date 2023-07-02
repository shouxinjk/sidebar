import axios from 'axios';

import {FormSchema} from '/@/components/Table';
import { useGlobSetting } from '/@/hooks/setting';
import {SEARCH_API, SEARCH_CONFIG, BIZ_CONFIG, WEOPEN_COMPONENT_APP_ID} from '/@/settings/iLifeSetting';
import { getTenantId, getToken } from "/@/utils/auth";
import { Md5 } from 'ts-md5';

const glob = useGlobSetting();

export const isDebug = false;
