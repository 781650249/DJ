import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, notification } from 'antd';

@connect(() => ({}))
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

  handleOk = async () => {
    this.setState({
      loading: true,
    });

    await this.success();
  };

  success = () => {
    setTimeout(() => {
      notification.success({
        message: 'success',
        description: 'success',
      });

      this.setState({
        loading: false,
        visible: false,
      });
    }, 1000);
  };

  render() {
    const { visible, loading } = this.state;
    const { children, color } = this.props;

    return (
      <div>
        <div style={{ color }} onClick={this.open}>
          . {children}
        </div>
        <Modal
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
