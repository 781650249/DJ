import { Modal, Button } from 'antd';
import React from 'react';
import LoadExcel from './components/LoadExcel';

class LeadOrders extends React.Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
      confirmLoading: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          导入订单
        </Button>
        <Modal
          maskClosable={false}
          title="导入订单"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={false}
        >
          <LoadExcel props={this.state} onCancel={this.handleCancel} />
        </Modal>
      </div>
    );
  }
}
export default LeadOrders;
