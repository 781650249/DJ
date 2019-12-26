import { notification } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import DeleteConfirmButton from '@/components/DeleteConfirmButton';

@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/BhurryOrder'],
}))
export default class HurryOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urgent: 0,
    };
  }

  componentDidMount() {
    const { data } = this.props.orders.result;
    this.setState({
      urgent: data.urgent,
    });
  }

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
          this.setState({
            urgent: 1,
          });
        }
        window.location.href = '/OrderManage';
        id.length = 0;
      },
    });
  };

  render() {
    const { urgent } = this.state;

    return (
      <div>
        {!urgent && (
          <DeleteConfirmButton
            content="你确定要将这条订单设为加急吗?"
            onConfirm={this.handleChange}
            button={{
              title: '加急',
              icon: 'clock-circle',
              shape: 'circle',
              size: 'small',
              type: 'link',
            }}
          />
        )}
      </div>
    );
  }
}
