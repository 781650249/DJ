import { changePwd, queryCurrent, query as queryUsers } from '@/services/user';
import { registerAccount } from '../services/login';

const UserModel = {
  namespace: 'user',
  state: {
    status: undefined,
    currentUser: {},
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
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *changePwd({ payload, callback }, { call }) {
      const response = yield call(changePwd, payload);
      if (callback) callback(response);
    },

    *fetchCurrent(_, { call, put }) {
      const { response, data } = yield call(queryCurrent);
      if (response.status === 200) {
        yield put({
          type: 'saveCurrentUser',
          payload: data,
        });
      } else {
        yield put({
          type: 'saveCurrentUser',
          payload: {},
        });
      }
    },
  },
  reducers: {
    changeRegisterStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
