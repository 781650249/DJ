/**
 * 示例
 */
import { formData } from '@/services/api';

export default {
  namespace: 'example',

  state: {},

  effects: {
    *upload({ payload, callback }, { call }) {
      const res = yield call(formData, 'example/upload', payload)
      
      console.log(res)

      const { data, response } = res;

      if (response.status === 200) {
        if (callback) callback(data)
      }
    },
  },

  reducers: {},
}
