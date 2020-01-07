import { formData, updCustomer, BcancelUrgent, query, batchUpdate, update } from '@/services/api';

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

    /**
     * 批量删除订单
     * @param {payload} 参数
     * @param {callback} 回调
     */
    *batchDelete({ payload, callback }, { call }) {
      const response = yield call(batchUpdate, 'orders/batch_del', payload);

      if (callback) callback(response);
    },

    /**
     * 更新订单状态
     * @param {payload} 参数
     * @param {id} 订单id
     * @param {callback} 回调
     */
    *updateStatus({ payload, id, callback }, { call }) {
      const response = yield call(update, 'order/status', id, payload);
      if (callback) callback(response);
    },

    /**
     * 批量更新订单状态
     * @param {payload} 参数
     * @param {callback} 回调
     */
    *bacthUpdateStatus({ payload, callback }, { call }) {
      const response = yield call(batchUpdate, 'orders/batch_status', payload);

      if (callback) {
        callback(response);
      }
    },

    /**
     * 批量标记加急
     * @param {payload} 参数
     * @param {callback} 回调
     */
    *batchUrgent({ payload, callback }, { call }) {
      const response = yield call(batchUpdate, 'orders/batch_urgent', payload);
      if (callback) callback(response);
    },

    /**
     * 标记加急
     * @param {id} 订单id
     * @param {callback} 回调
     */
    *urgent({ id, callback }, { call }) {
      const response = yield call(update, 'order/urgent', id);

      if (callback) callback(response);
    },

    /**
     * 取消加急
     * @param {id} 订单id
     * @param {callback} 回调
     */
    *calcelUrgent({ id, callback }, { call }) {
      const response = yield call(update, 'order/cancel_urgent', id);

      if (callback) callback(response);
    },

    /**
     * 批量取消标记加急
     * @param {payload} 参数
     * @param { callback } 回调
     */
    *batchCancelUrgentOrder({ payload, callback }, { call }) {
      const response = yield call(batchUpdate, 'orders/batch_cancel_urgent', payload);
      if (callback) callback(response);
    },

    *batchCancelUrgent({ payload, callback }, { call }) {
      const response = yield call(BcancelUrgent, payload);
      if (callback) callback(response);
    },
  },
};
