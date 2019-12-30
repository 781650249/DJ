import { notification } from 'antd';
import React, { Component } from 'react';
import DeleteConfirmButton from '@/components/DeleteConfirmButton';
import { connect } from 'dva';

@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/HurryOrder'],
}))
export default class HurryOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urgent: 0,
    };
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      urgent: data.urgent,
    });
  }

  componentWillReceiveProps(newProps) {
    const newData = newProps.data;
    const { urgent } = this.state;

    if (newData && newData.urgent !== urgent) {
      this.setState({
        urgent: newData.urgent,
      });
    }
  }

  setUrgent = () => {
    const {
      data: { id },
      dispatch,
    } = this.props;
    dispatch({
      type: 'orders/HurryOrder',
      payload: {
        id,
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
      },
    });
  };

  cancelUrgent = () => {
    const {
      dispatch,
      data: { id },
    } = this.props;
    dispatch({
      type: 'orders/cancelUrgentOrder',
      payload: {
        id,
      },
      callback: response => {
        if (response.response.status === 200) {
          notification.success({
            message: '取消标记',
          });
          this.setState({
            urgent: 0,
          });
        }
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
            onConfirm={this.setUrgent}
            button={{
              title: '加急',
              icon: 'clock-circle',
              shape: 'circle',
              size: 'small',
              type: 'link',
            }}
          />
        )}
        {!!urgent && (
          <DeleteConfirmButton
            content="你确定要将这条订单取消加急吗?"
            onConfirm={this.cancelUrgent}
            button={{
              title: '取消加急',
              icon: 'clock-circle',
              shape: 'circle',
              size: 'small',
              type: 'danger',
            }}
          />
        )}
      </div>
    );
  }
}
