import { Modal, Button } from 'antd';
import React from 'react';
import LoadGoods from './components/LoadGoods';

class LeadGoods extends React.Component {
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
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 1000);
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
          导入商品
        </Button>
        <Modal
          title="导入商品"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={[]}
        >
          <LoadGoods props={this.state} />
        </Modal>
      </div>
    );
  }
}
export default LeadGoods;
