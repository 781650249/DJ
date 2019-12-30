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

// 订单的获取搜索
export async function getOrders(params) {
  return request(`/api/orders?${stringify(params)}`);
}
// 修改顾客信息
export async function updCustomer(params) {
  return request(`/api/customer/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
// 修改订单状态
export async function updorderStatus(params) {
  return request(`/api/order/status/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
// 批量加急
export async function HurryOrders(params) {
  return request('/api/orders/batch_urgent', {
    method: 'POST',
    data: params,
  });
}
// 加急
export async function SingleHurryOrder(id) {
  return request(`/api/order/urgent/${id}`, {
    method: 'PUT',
  });
}
// 取消加急
export async function cancelUrgent(id) {
  return request(`/api/order/cancel_urgent/${id}`, {
    method: 'PUT',
  });
}

export async function BcancelUrgent(params) {
  return request('/api/order/batch_cancel_urgent', {
    method: 'POST',
    data: params,
  });
}
