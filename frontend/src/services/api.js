/**
 * api 请求
 */
import request from '@/utils/request';

// 文件上传
export const formData = async (resource, params) => {
  const fileForm = new FormData();

  Object.keys(params).map(key => fileForm.append(key, params[key]));

  return request(`/api/${resource}`, {
    method: 'post',
    data: fileForm,
  });
};
