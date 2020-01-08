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
  return request(`/api/${resource}?${stringify(params)}`);
}

/**
 * 更新资源
 */
export async function update(resource, id, params) {
  return request(`api/${resource}/${id}`, {
    method: 'PUT',
    data: params,
  });
}

/**
 * 批量修改
 * @param router api路由地址
 * @param params 参数
 */
export async function batchUpdate(router, params) {
  return request(`api/${router}`, {
    method: 'POST',
    data: params,
  });
}

// 修改顾客信息
export async function updCustomer(params) {
  return request(`/api/customer/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

/**
 * post提交
 * @param {router} 路由
 * @param {params} 参数
 */
export async function post(router, params) {
  return request(`api/${router}`, {
    method: 'POST',
    data: params,
  });
}
