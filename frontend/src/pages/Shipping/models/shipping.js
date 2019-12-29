/**
 * 获取物流订单
 */
import { query, formData } from '@/services/api';

export default {
  namespace: 'shipping',
  state: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const res = yield call(query, 'shipping', payload);

      if (callback) callback(res);
    },
    *upload({ payload, callback }, { call }) {
      const res = yield call(formData, 'shipping/import', payload);

      if (callback) callback(res);
    },
  },

  reducers: {},
};
