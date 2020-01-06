/**
 * 更新订单状态
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Dropdown, Menu, Button, Modal, Alert, notification } from 'antd';
import { orderStatus } from '@/utils/settings';

const MenuItem = Menu.Item;

@connect(() => ({}))
class UpdateOrderStatus extends Component {
  state = {
    visible: false,
    status: undefined,
    error: undefined,
  };

  handleButtonClick = status => {
    this.setState({
      visible: true,
      status,
    });
  };

  /**
   * 确认修改
   */
  handleOk = async () => {
    const { dispatch, ids, onSuccess, type, data = {} } = this.props;
    const { status } = this.state;

    this.setState({
      loading: true,
      error: null,
    });

    if (type === 'batch') {
      await dispatch({
        type: 'order/bacthUpdateStatus',
        payload: {
          ids,
          status,
        },
        callback: response => {
          const resData = response.data;

          if (response.response.status === 200) {
            notification.success({
              message: resData && resData.message,
              description: (
                <>
                  <p style={{ marginBottom: 1 }}>
                    修改: <b>{resData.orders_count}</b> 个订单，
                  </p>
                  <p style={{ marginBottom: 1 }}>
                    修改成功： <b>{resData.success_of_time} 个,</b>
                  </p>
                  <p style={{ marginBottom: 1, color: '#ff4d4f' }}>
                    修改失败： <b>{resData.error_of_time} 个,</b>
                  </p>
                </>
              ),
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
    }

    if (type === 'single') {
      const { id } = data;

      await dispatch({
        type: 'order/updateStatus',
        id,
        payload: {
          status,
        },
        callback: res => {
          const { response } = res;
          const resData = res.data;

          if (response && response.status === 200) {
            notification.success({
              message: resData.message,
            });

            if (onSuccess) onSuccess();

            this.setState({
              loading: false,
              visible: false,
            });
          } else {
            this.setState({
              loading: false,
              error: resData && resData.error,
            });
          }
        },
      });
    }
  };

  /**
   * 关闭弹窗
   */
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { ids, children, type, data = {} } = this.props;
    const { visible, status, error, loading } = this.state;

    return (
      <>
        <Dropdown
          disabled={type === 'batch' && ids.length === 0}
          overlay={
            <Menu>
              {Object.keys(orderStatus).map(
                key =>
                  orderStatus[key].showOnly === 'all' && (
                    <MenuItem
                      key={key}
                      disabled={type === 'single' && key === data.status}
                      onClick={() => this.handleButtonClick(key)}
                    >
                      <span style={{ color: orderStatus[key] && orderStatus[key].color }}>
                        {orderStatus[key] && orderStatus[key].value}
                      </span>
                    </MenuItem>
                  ),
              )}
            </Menu>
          }
        >
          <Button size="small" type="link">
            {children}
          </Button>
        </Dropdown>

        {visible && status && (
          <Modal
            okButtonProps={{ disabled: type === 'batch' && ids.length === 0 }}
            visible={visible}
            title="确认修改"
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            centered
            confirmLoading={loading}
          >
            <p>
              {type === 'batch' && (
                <span>
                  确定将 <a>{ids.length}</a> 个订单的状态修改为
                </span>
              )}
              {type === 'single' && (
                <span>
                  确定将订单 <a>{data.oid}</a> 的状态修改为
                </span>
              )}
              <b style={{ color: orderStatus[status] && orderStatus[status].color }}>
                <span>{orderStatus[status] && orderStatus[status].value}</span>
              </b>
              ?
            </p>
            {error && <Alert type="error" message={error} closable />}
          </Modal>
        )}
      </>
    );
  }
}

export default UpdateOrderStatus;
