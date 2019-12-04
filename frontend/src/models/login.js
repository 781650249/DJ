import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { setAuthorityByToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload, callback }, { call, put }) {
      const { response, data } = yield call(fakeAccountLogin, payload);

      // Login successfully
      if (response.status && response.status === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: data,
        });

        if (callback) callback(response);
      } else {
        // 登录失败处理
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      // 根据token来设置用户是否在线
      setAuthorityByToken(payload);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
