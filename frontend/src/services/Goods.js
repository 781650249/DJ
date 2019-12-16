import request from '@/utils/request';
import { stringify } from 'qs';

export async function getGoods(params) {
  return request(`/api/products?${stringify(params)}`);
}
export async function delGoods(id) {
  return request(`/api/products/${id.id}`, {
    method: 'DELETE',
  });
}

export async function updGoods(params) {
  return request(`/api/products/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function addGoods(params) {
  return request('/api/products', {
    method: 'POST',
    data: params,
  });
}

export async function bdelGoods(params) {
  return request('/api/products/batch_delete', {
    method: 'POST',
    data: params,
  });
}
export const formData = async (resource, params) => {
  const a = resource.toString().split('/');
  const b = a[0].replace('Goods', 'products');
  const res = `${b}/import`;
  const fileForm = new FormData();
  Object.keys(params).map(key => fileForm.append(key, params[key]));
  return request(`/api/${res}`, {
    method: 'post',
    data: fileForm,
  });
};
