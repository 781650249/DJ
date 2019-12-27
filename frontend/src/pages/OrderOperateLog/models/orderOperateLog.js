import { query } from '@/services/api';

export default {
  namespace: 'orderOperateLog',

  state: {
    data: {
      list: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(query, 'activity_log/order_operate', payload);

      const { response, data } = res;

      if (response.status && response.status === 200) {
        console.log(data);
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      const { data } = payload;

      return {
        ...state,
        data: {
          list: data,
          pagination: {
            page: parseInt(payload.current_page, 10),
            pageSize: parseInt(payload.per_page, 10),
            total: parseInt(payload.total, 10),
          },
        },
      };
    },

    clear(state) {
      return {
        ...state,
        data: {
          list: [],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 0,
          },
        },
      };
    },
  },
};
