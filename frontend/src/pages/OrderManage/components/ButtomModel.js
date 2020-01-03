import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, notification } from 'antd';

@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/updateStatus'],
  initing: loading.effects['orders/fetchOrders'],
}))
class ButtonModel extends Component {
  state = {
    visible: false,
    loading: false,
  };

  componentWillUnmount() {
    clearInterval();
  }

  open = () => {
    this.setState({
      visible: true,
    });
  };

  cancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOk = () => {
    const { dispatch, status, id } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'orders/updateStatus',
      payload: {
        id,
        status,
      },
      callback: response => {
        const {
          data: { message },
        } = response;
        if (response.response.status === 200) {
          notification.success({
            message: `${message}`,
          });
          dispatch({
            type: 'orders/fetchOrders',
            payload: {
              page: 1,
              page_size: '',
            },
          });
          id.length = 0;
          this.setState({
            loading: false,
            visible: false,
          });
        }
      },
    });
  };

  render() {
    const { visible, loading } = this.state;
    const { children, color, dis } = this.props;

    return (
      <div>
        <div style={{ color }} onClick={this.open}>
          . {children}
        </div>
        <Modal
          okButtonProps={{ disabled: !dis }}
          visible={visible}
          title="确认修改"
          onCancel={this.cancel}
          onOk={this.handleOk}
          confirmLoading={loading}
        >
          <p>
            确定将状态修改为
            <b style={{ color }}>{children}</b>?
          </p>
        </Modal>
      </div>
    );
  }
}

export default ButtonModel;
