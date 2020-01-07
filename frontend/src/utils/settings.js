// 用户角色
// 目前只有在线和离线
export const authRole = {
  online: 'online',
  outline: 'outline',
};

export const orderStatus = {
  un_download: {
    key: 'un_download',
    value: '未下载',
    showOnly: 'search',
    color: '#66ff66',
  },
  downloaded: {
    key: 'downloaded',
    value: '已下载',
    showOnly: 'search',
    color: '#0E77D1',
  },
  processing: {
    key: 'processing',
    value: '处理中',
    showOnly: 'all',
    color: '#660099',
  },
  processed: {
    key: 'processed',
    value: '已处理',
    showOnly: 'search',
    color: '#8E236B',
  },
  published: {
    key: 'published',
    value: '已发稿',
    showOnly: 'all',
    color: '#8bc34a ',
  },
  confirmed: {
    key: 'confirmed',
    value: '已确认',
    showOnly: 'all',
    color: '#70DBDB ',
  },
  produced: {
    key: 'produced',
    value: '已生产',
    showOnly: 'all',
    color: '#EAADEA ',
  },
  frozen: {
    key: 'frozen',
    value: '已冻结',
    showOnly: 'all',
    color: '#ff4d4f',
  },
  wait_change: {
    key: 'wait_change',
    value: '待修改',
    color: '#ccc',
    showOnly: 'all',
  },
};

export const acceptImgFile = ['image/jpeg', 'image/png'];

export default authRole;
