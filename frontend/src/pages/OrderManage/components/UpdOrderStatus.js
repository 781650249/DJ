import { Select, notification } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

const { Option } = Select;

@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/updOrderStatus'],
}))
export default class UpdOrderStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'small',
    };
  }

  handleChange = value => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'orders/updOrderStatus',
      payload: {
        id,
        status: value,
      },
      callback: response => {
        if (response.response.status === 200) {
          notification.success({
            message: '修改成功',
          });
          // 刷新
          dispatch({
            type: 'orders/fetchOrders',
            payload: {
              page: 1,
              page_size: '',
            },
          });
          id.length = 0;
          router.push('/OrderManage');
        }
      },
    });
  };

  render() {
    const { size } = this.state;
    const { hasSelected, submitting } = this.props;
    return (
      <div>
        <Select
          size={size}
          loading={submitting}
          disabled={Boolean(!hasSelected)}
          placeholder="修改订单状态"
          style={{ marginLeft: 5, width: 130 }}
          onChange={this.handleChange}
        >
          <Option value="un_download" disabled>
            未下载{' '}
          </Option>
          <Option value="downloaded" disabled>
            已下载{' '}
          </Option>
          <Option value="processing"> 处理中</Option>
          <Option value="processed">处理完成</Option>
          <Option value="published"> 已发稿</Option>
          <Option value="confirmed">已确认</Option>
          <Option value="produced">已生产</Option>
          <Option value="frozen">冻结</Option>
          <Option value="wait_change">待修改</Option>
        </Select>
      </div>
    );
  }
}
