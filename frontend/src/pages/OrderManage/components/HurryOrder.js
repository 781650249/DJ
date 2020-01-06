import { notification } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import UrgentConfirmButton from './UrgentConfirmButton';

@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/BhurryOrder'],
}))
export default class HurryOrder extends Component {
  handleChange = () => {
    const { dispatch, id } = this.props;

    dispatch({
      type: 'orders/BhurryOrder',
      payload: {
        ids: id,
      },
      callback: response => {
        if (response.response.status === 200) {
          notification.success({
            message: '标记成功',
          });
        }

        dispatch({
          type: 'orders/fetchOrders',
          payload: {
            page: 1,
            page_size: '',
          },
        });

        id.length = 0;
      },
    });
  };

  batchCancelUrgent = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'orders/batchCancelUrgent',
      payload: {
        ids: id,
      },
      callback: response => {
        if (response.response.status === 200) {
          notification.success({
            message: '取消标记',
          });
        }

        dispatch({
          type: 'orders/fetchOrders',
          payload: {
            page: 1,
            page_size: '',
          },
        });

        id.length = 0;
      },
    });
  };

  render() {
    const { hasSelected } = this.props;
    return (
      <div>
        {}

        {
          <UrgentConfirmButton
            dis={hasSelected}
            content="你确定要将这条订单取消加急吗?"
            onConfirm={this.batchCancelUrgent}
            button={{
              type: 'link',
              size: 'small',
            }}
          >
            取消加急
          </UrgentConfirmButton>
        }
      </div>
    );
  }
}
