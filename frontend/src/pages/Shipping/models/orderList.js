/**
 * 获取物流订单
 */
import { query } from '@/services/api';

export default {
  namespace: 'orderList',
  state: {},

  effects: {
    *fetch({ payload, callback }, { call }) {
      const res = yield call(query, 'shipping', payload);
      if (callback) callback(res);
    },
  },

  reducers: {},
};
