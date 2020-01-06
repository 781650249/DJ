import {
  formData,
  cancelUrgent,
  updCustomer,
  updorderStatus,
  HurryOrders,
  SingleHurryOrder,
  BcancelUrgent,
  query,
  batchUpdate,
} from '@/services/api';

export default {
  namespace: 'order',
  state: {
    data: {
      total: 0, // 总数据量
      lists: [], // 当前页数据
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    },
  },
  reducers: {
    save(state, { payload }) {
      const { data } = payload;

      return {
        ...state,
        data: {
          lists: data,
          pagination: {
            page: parseInt(payload.current_page, 10),
            pageSize: parseInt(payload.per_page, 10),
            total: parseInt(payload.total, 10),
          },
        },
      };
    },
    setCondition(state, { payload }) {
      return {
        ...state,
        result: payload,
      };
    },
  },
  effects: {
    *import({ payload, callback }, { call }) {
      const res = yield call(formData, 'orders/import', payload);
      const { data, response } = res;
      if (callback) callback(data, response);
    },

    /**
     * 请求数据
     * @param payload 参数
     * @param callback 回调
     */
    *fetch({ payload, callback }, { call, put }) {
      const res = yield call(query, 'orders', payload);
      const { data, response } = res;

      if (response.status && response.status === 200) {
        yield put({
          type: 'save',
          payload: data,
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            data: [],
            current_page: 1,
            total: 0,
          },
        });
      }
      if (callback) callback(data, response);
    },

    *updateCustomer({ payload, callback }, { call }) {
      const response = yield call(updCustomer, payload);
      if (callback) callback(response);
    },
    *updateStatus({ payload, callback }, { call }) {
      const response = yield call(updorderStatus, payload);
      if (callback) callback(response);
    },

    /**
     * 批量更新
     * @param {payload} 参数
     * @param {callback} 回调
     */
    *bacthUpdateStatus({ payload, callback }, { call }) {
      const response = yield call(batchUpdate, 'orders/batch_status', payload);

      if (callback) {
        callback(response);
      }
    },

    *BhurryOrder({ payload, callback }, { call }) {
      const response = yield call(HurryOrders, payload);
      if (callback) callback(response);
    },
    *HurryOrder(
      {
        payload: { id },
        callback,
      },
      { call },
    ) {
      const response = yield call(SingleHurryOrder, id);
      if (callback) callback(response);
    },
    *cancelUrgentOrder(
      {
        payload: { id },
        callback,
      },
      { call },
    ) {
      const response = yield call(cancelUrgent, id);
      if (callback) callback(response);
    },
    *batchCancelUrgent({ payload, callback }, { call }) {
      const response = yield call(BcancelUrgent, payload);
      if (callback) callback(response);
    },
  },
};
