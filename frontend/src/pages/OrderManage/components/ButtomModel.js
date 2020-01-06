import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, notification, Alert } from 'antd';

@connect(() => ({}))
class ButtonModel extends Component {
  state = {
    visible: false,
    loading: false,
    error: null,
  };

  open = () => {
    this.setState({
      visible: true,
    });
  };

  cancel = () => {
    this.setState({
      visible: false,
      error: null,
      loading: false,
    });
  };

  handleOk = async () => {
    const { dispatch, status, ids, onSuccess } = this.props;
    this.setState({
      loading: true,
      error: null,
    });

    await dispatch({
      type: 'order/updateStatus',
      payload: {
        ids,
        status,
      },
      callback: response => {
        const { data } = response;

        if (response.response.status === 200) {
          notification.success({
            message: data && data.message,
          });

          if (onSuccess) onSuccess();

          this.setState({
            loading: false,
            visible: false,
          });
        } else {
          this.setState({
            loading: false,
            error: data && data.error,
          });
        }
      },
    });
  };

  render() {
    const { visible, loading, error } = this.state;
    const { children, color, ids = [] } = this.props;

    return (
      <div>
        <div style={{ color }} onClick={this.open}>
          {children}
        </div>
        {visible && (
          <Modal
            okButtonProps={{ disabled: ids.length === 0 }}
            visible={visible}
            title="确认修改"
            onCancel={this.cancel}
            onOk={this.handleOk}
            centered
            confirmLoading={loading}
          >
            <p>
              确定将 <a>{ids.length}</a> 个订单的状态修改为
              <b>{children}</b>?
            </p>
            <Alert type="error" message={error} closable />
          </Modal>
        )}
      </div>
    );
  }
}

export default ButtonModel;
