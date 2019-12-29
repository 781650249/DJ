/**
 * api 请求
 */
import request from '@/utils/request';
import { stringify } from 'qs';

/**
 * 文件上传接口
 */
export const formData = async (resource, params) => {
  const fileForm = new FormData();

  Object.keys(params).map(key => fileForm.append(key, params[key]));

  return request(`/api/${resource}`, {
    method: 'post',
    data: fileForm,
  });
};

/**
 * Resource的查询接口
 */
export async function query(resource, params) {
  // console.log('params', params);
  return request(`/api/${resource}?${stringify(params)}`);
}
