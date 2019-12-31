import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Button } from 'antd';

@connect(() => ({}))
class UrgentConfirmButton extends Component {
  state = {
    visible: false,
    loading: false,
  };

  popoverContent = () => {
    const { content, dis } = this.props;
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
            disabled={!dis}
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
    const { children, button, title, dis } = this.props;
    const { loading, visible } = this.state;
    return (
      <Popover
        visible={visible}
        trigger="click"
        title={title}
        content={this.popoverContent()}
        onVisibleChange={this.handleVisibleChange}
      >
        <Button style={{ height: '19' }} disabled={!dis} loading={loading} {...button}>
          {children}
        </Button>
      </Popover>
    );
  }
}

export default UrgentConfirmButton;
