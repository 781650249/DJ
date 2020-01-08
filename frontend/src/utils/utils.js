import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import moment from 'moment';
import { acceptImgFile } from './settings';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

/**
 * 将约束条件转换成laravel-query-builder要求的格式
 */
export function formatCriteria(fields) {
  const formatted = {};
  Object.keys(fields).forEach(key => {
    const newKey = key.replace('-', '.');
    formatted[newKey] = fields[key];
    if (formatted[key] instanceof Array) {
      // console.log('key', key)
      if (fields[key][0] instanceof moment) {
        formatted[key] = `${fields[key][0].format('YYYY-MM-DD HH:mm:ss')},${fields[key][1].format(
          'YYYY-MM-DD HH:mm:ss',
        )}`;
      }
    }

    // console.log('item', key, formatted[key])
  });
  return formatted;
}

/**
 * 格式化时间
 * @param {*} val
 */
export function formatDateRange(val) {
  if (val instanceof Array && val[0] && val[1]) {
    // console.log('key', key)
    if (val[0] instanceof moment && val[1] instanceof moment) {
      return `${val[0].format('YYYY-MM-DD HH:mm:ss')}～${val[1].format('YYYY-MM-DD HH:mm:ss')}`;
    }
  }

  return val;
}

/**
 * 可接受的图片
 */
export function acceptImgs(files) {
  const imgs = [];

  files.forEach(item => {
    for (let i = 0; i < acceptImgFile.length; i += 1) {
      if (item.mime_type === acceptImgFile[i]) {
        imgs.push(item);
        break;
      }
    }
  });

  return imgs;
}

/**
 * 下载文件
 * @param {*} url 链接地址
 */
export function downloadFile(url) {
  const aLink = document.createElement('a'); // 创建a链接
  aLink.style.display = 'none';
  aLink.href = url;
  aLink.target = 'blank';

  document.body.appendChild(aLink);
  aLink.click();
  document.body.removeChild(aLink); // 点击完成后记得删除创建的链接
}
