/**
 * 上传物流订单
 */
import { formData } from '@/services/api';

export default {
  namespace: 'upload',
  state: {},

  effects: {
    *upload({ payload, callback }, { call }) {
      const res = yield call(formData, 'shipping/import', payload);
      // console.log(res);

      if (callback) callback(res);
    },
  },

  reducers: {},
};
