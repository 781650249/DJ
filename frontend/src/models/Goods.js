import { getGoods, addGoods, delGoods, updGoods, bdelGoods, formData } from '@/services/Goods';

export default {
  namespace: 'Goods',
  state: {
    condition: {
      double_side: 0,
      keyword: '',
      page: 1,
      limit: 10,
    },
    result: {
      total: 0, // 总货物量
      data: [],
    },
  },
  reducers: {
    setResult(state, { payload }) {
      return {
        ...state,
        result: payload,
      };
    },
  },
  effects: {
    *addGoods({ payload, callback }, { call }) {
      const response = yield call(addGoods, payload);
      if (callback) callback(response);
    },
    *fetchGoods({ payload, callback }, { call, put }) {
      const response = yield call(getGoods, payload);
      if (callback) callback(response);
      yield put({
        type: 'setResult',
        payload: {
          total: response.data.total,
          data: response.data.data,
        },
      });
    },
    *deleteGoods({ payload, callback }, { call }) {
      const response = yield call(delGoods, payload);
      if (callback) callback(response);
    },
    *updateGoods({ payload, callback }, { call }) {
      console.log(payload);
      const response = yield call(updGoods, payload);
      if (callback) callback(response);
    },
    *bdeleteGoods({ payload, callback }, { call }) {
      const response = yield call(bdelGoods, payload);
      console.log(payload, 22222);
      if (callback) callback(response);
    },
    *import({ payload, callback }, { call }) {
      const res = yield call(formData, 'Goods/import', payload);
      const { data, response } = res;
      if (response.status === 200) {
        if (callback) callback(data);
      }
    },
  },
};
