import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/me');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function changePwd(params) {
  return request('/api/me/password', {
    method: 'PUT',
    data: params,
  });
}
