import request from '@/utils/request';
import { stringify } from 'qs';

/*
获取商品接口
*/
export async function getGoods(params) {
  return request(`/api/products?${stringify(params)}`);
}

/*
删除商品接口
*/
export async function delGoods(id) {
  return request(`/api/products/${id.id}`, {
    method: 'DELETE',
  });
}

/*
修改商品接口
*/
export async function updGoods(params) {
  return request(`/api/products/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

/*
添加商品接口
*/
export async function addGoods(params) {
  return request('/api/products', {
    method: 'POST',
    data: params,
  });
}

/*
批量删除接口
*/
export async function bdelGoods(params) {
  return request('/api/products/batch_delete', {
    method: 'POST',
    data: params,
  });
}

/*
文件上传接口
*/
export const formData = async (resource, params) => {
  const fileForm = new FormData();
  Object.keys(params).map(key => fileForm.append(key, params[key]));
  return request(`/api/${resource}`, {
    method: 'post',
    data: fileForm,
  });
};
