import React, { Component } from 'react';
import { Modal, Icon, Avatar, Row, Col, Badge } from 'antd';
import { acceptImgs } from '@/utils/utils';

export default class OriginImg extends Component {
  state = {
    visible: false,
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
    const { files, title } = this.props;
    const { visible } = this.state;

    const imgs = acceptImgs(files);

    return (
      <>
        <Badge count={imgs.length} showZero>
          <Icon
            type="file-image"
            theme="twoTone"
            style={{ fontSize: 24 }}
            onClick={this.showModal}
          />
        </Badge>
        {visible && (
          <Modal
            title={title}
            width={400}
            visible={visible}
            onCancel={this.handleCancel}
            footer={null}
            centered
            maskClosable={false}
          >
            <Row gutter={10}>
              {imgs.map(item => (
                <Col span={6} key={item.file_path} style={{ textAlign: 'center' }}>
                  <a href={item.file_path} target="blank">
                    <Avatar
                      style={{
                        backgroundColor: '#ccc',
                        border: '1px solid #ccc',
                      }}
                      size={80}
                      shape="square"
                      src={item.file_path}
                    />
                  </a>
                </Col>
              ))}
            </Row>
            <p style={{ marginTop: 12 }}>
              <small>鼠标右键点击‘图片另存为’来下载图片</small>
            </p>
          </Modal>
        )}
      </>
    );
  }
}
