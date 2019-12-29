/**
 * 获取日志上传信息
 */
import { query } from '@/services/api';

export default {
  namespace: 'logMsg',
  state: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const res = yield call(query, 'activity_log/shipping_import', payload);
      if (callback) callback(res);
    },
  },

  reducers: {},
};
