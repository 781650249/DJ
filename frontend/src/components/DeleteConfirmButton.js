import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Button, Alert } from 'antd';

@connect(() => ({}))
class DeleteConfirmButton extends Component {
  state = {
    visible: false,
  };

  popoverContent = () => {
    const { content, errorMessage, loading } = this.props;

    return (
      <>
        <span> {errorMessage && <Alert type="error" message={errorMessage} />} </span>
        <div>{content}</div>
        <p style={{ textAlign: 'right', marginTop: 15 }}>
          <Button size="small" onClick={this.hide}>
            取消
          </Button>
          <Button
            loading={loading}
            type="primary"
            size="small"
            onClick={this.confirm}
            style={{ marginLeft: 5 }}
          >
            确认
          </Button>
        </p>
      </>
    );
  };

  /**
   * 确认事件
   */
  confirm = async () => {
    const { onConfirm } = this.props;

    if (onConfirm) {
      await onConfirm();
    }
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    const { disabled } = this.props;

    if (disabled) {
      this.setState({
        visible: false,
      });
    } else {
      this.setState({ visible });
    }
  };

  render() {
    const { children, button, title, disabled } = this.props;
    const { visible } = this.state;

    return (
      <Popover
        visible={visible}
        trigger="click"
        title={title}
        content={this.popoverContent()}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button disabled={disabled} {...button}>
          {children}
        </Button>
      </Popover>
    );
  }
}

export default DeleteConfirmButton;
