import {
  formData,
  cancelUrgent,
  getOrders,
  updorders,
  updorderStatus,
  HurryOrders,
  SingleHurryOrder,
} from '@/services/api';

export default {
  namespace: 'orders',
  state: {
    condition: {
      status: '',
    },
    result: {
      total: 0, // 总数据量
      data: [], // 当前页数据
      page: 1,
      perPage: 10,
      filter: '',
    },
  },
  reducers: {
    setResult(state, { payload }) {
      return {
        ...state,
        result: payload,
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
    *fetchOrders({ payload, callback }, { call, put }) {
      const res = yield call(getOrders, payload);
      const { data, response } = res;
      if (callback) callback(data, response);
      yield put({
        type: 'setResult', // 获取到的数据传到reducer让它来更改状态
        payload: {
          data: data.data,
          total: data.total,
          page: data.current_page,
          perPage: data.per_page,
          filter: payload.filter,
        },
      });
    },
    *updateorders({ payload, callback }, { call }) {
      const response = yield call(updorders, payload);
      if (callback) callback(response);
    },
    *updOrderStatus({ payload, callback }, { call }) {
      const response = yield call(updorderStatus, payload);
      if (callback) callback(response);
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
  },
};
