import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/oauth/token', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function registerAccount(params) {
  return request('/api/user/register', {
    method: 'POST',
    data: params,
  });
}
