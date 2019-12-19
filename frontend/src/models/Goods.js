import { getGoods, addGoods, delGoods, updGoods, bdelGoods, formData } from '@/services/Goods';

export default {
  namespace: 'Goods',
  state: {
    condition: {
      double_side: 0,
      keyword: '',
      page: '',
      limit: 10,
    },
    result: {
      total: 0, // 总数据量
      data: [], // 当前页数据
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
        type: 'setResult', // 获取到的数据传到reducer让它来更改状态
        payload: {
          total: response.data.total,
          data: response.data.data,
          page: response.data.current_page,
        },
      });
    },
    *deleteGoods({ payload, callback }, { call }) {
      const response = yield call(delGoods, payload);
      if (callback) callback(response);
    },
    *updateGoods({ payload, callback }, { call }) {
      const response = yield call(updGoods, payload);
      if (callback) callback(response);
    },
    *bdeleteGoods({ payload, callback }, { call }) {
      const response = yield call(bdelGoods, payload);
      if (callback) callback(response);
    },
    *import({ payload, callback }, { call }) {
      const res = yield call(formData, 'products/import', payload);
      const { data, response } = res;
      if (response.status === 200) {
        if (callback) callback(data);
      }
    },
  },
};
