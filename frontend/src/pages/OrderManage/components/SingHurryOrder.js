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
      errorMessage: null,
      loading: false,
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
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'orders/HurryOrder',
      payload: {
        id,
      },
      callback: response => {
        const {
          data: { message, error },
        } = response;
        if (response.response.status === 200) {
          notification.success({
            message: `${message}`,
          });
          this.setState({
            urgent: 1,
            loading: false,
          });
        } else {
          this.setState({
            errorMessage: `${error}`,
            loading: false,
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
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'orders/cancelUrgentOrder',
      payload: {
        id,
      },
      callback: response => {
        const {
          data: { message },
        } = response;
        if (response.response.status === 200) {
          notification.success({
            message: `${message}`,
          });
          this.setState({
            urgent: 0,
            loading: false,
          });
        }
      },
    });
  };

  render() {
    const { urgent, errorMessage, loading } = this.state;
    return (
      <div>
        {!urgent && (
          <DeleteConfirmButton
            loading={loading}
            errorMessage={errorMessage}
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
            loading={loading}
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
