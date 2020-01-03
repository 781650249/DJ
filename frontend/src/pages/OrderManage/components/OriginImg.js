import React, { Component } from 'react';
import { Modal, Icon, Avatar, Row, Col } from 'antd';

export default class OriginImg extends Component {
  state = {
    visible: false,
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { files } = this.props;

    return (
      <div>
        <Icon type="link" style={{ fontSize: 20 }} onClick={this.showModal} />
        <Modal
          title="原始素材"
          width={400}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          maskClosable={false}
        >
          <Row>
            {files.map(
              item =>
                (item.mime_type === 'image/jpeg' || item.mime_type === 'image/png') && (
                  <Col span={6} style={{ textAlign: 'center' }}>
                    <Avatar
                      shape="square"
                      size={64}
                      key={item.id}
                      src={item.file_path}
                      style={{ backgroundColor: '#ccc', border: '1px solid #ccc' }}
                    />
                  </Col>
                ),
            )}
          </Row>
        </Modal>
      </div>
    );
  }
}
