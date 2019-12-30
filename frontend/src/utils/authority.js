import moment from 'moment';
import { authRole } from './settings';
import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  } // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload

  reloadAuthorized();
}

/**
 * 将token存在localstorage里
 * 返回用户在线
 * @param object tokenData
 */
export function setAuthorityByToken(tokenData) {
  const { outline, online } = authRole;
  if (!tokenData || JSON.stringify(tokenData) === '{}') {
    localStorage.removeItem('access-token');
    localStorage.removeItem('access-token-expires');

    // 离线
    return [outline];
  }

  const accessToken = tokenData.access_token;
  const expiresIn = tokenData.expires_in;

  localStorage.setItem('access-token', accessToken);
  localStorage.setItem(
    'access-token-expires',
    moment()
      .add(expiresIn, 's')
      .format(),
  );

  return [online];
}

/**
 * 获取用户的角色
 * 判断是否存在token
 * 判断是否过期
 */
export function getAuthorityByToken() {
  const accessToken = localStorage.getItem('access-token');

  const { outline, online } = authRole;
  // 秘钥过期时间
  const expires = localStorage.getItem('access-token-expires');

  if (!accessToken || !expires) {
    return [outline];
  }

  if (moment(expires).isBefore(moment())) {
    return [outline];
  }

  return [online];
}

/**
 * 获取token
 */
export function getToken() {
  const accessToken = localStorage.getItem('access-token');
  const expires = localStorage.getItem('access-token-expires');

  if (!accessToken || !expires) {
    return null;
  }

  if (moment(expires).isBefore(moment())) {
    return null;
  }

  return accessToken;
}

export function clearToken() {
  localStorage.removeItem('access-token');
  localStorage.removeItem('access-token-expires');

  const { outline } = authRole;
  return [outline];
}
