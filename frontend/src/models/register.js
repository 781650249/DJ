import { registerAccount } from '../services/login';

export default {
  namespace: 'register',
  state: {
    status: undefined,
  },
  effects: {
    *register({ payload, callback }, { call, put }) {
      const response = yield call(registerAccount, payload);
      yield put({
        type: 'changeRegisterStatus',
        payload: response,
      });
      if (callback) callback(response);
    },
  },
  reducers: {
    changeRegisterStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
