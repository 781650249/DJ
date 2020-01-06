/**
 * 确认按钮, 冒泡提示
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Button } from 'antd';

@connect(() => ({}))
class ConfirmButton extends Component {
  state = {
    visible: false,
    loading: false,
  };

  popoverContent = () => {
    const { content, disabled } = this.props;
    const { loading } = this.state;

    return (
      <>
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
            disabled={disabled}
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
      this.setState({
        loading: true,
      });
      onConfirm();
      this.setState({
        visible: false,
        loading: false,
      });
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
    const { loading, visible } = this.state;
    return (
      <Popover
        visible={visible}
        trigger="click"
        title={title}
        content={this.popoverContent()}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button disabled={disabled} loading={loading} {...button}>
          {children}
        </Button>
      </Popover>
    );
  }
}

export default ConfirmButton;
