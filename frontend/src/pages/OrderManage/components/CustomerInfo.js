import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Divider, Button, Modal, Form, Input, Row, Col, notification, Alert } from 'antd';
import styles from './styles.less';

const FormItem = Form.Item;

@Form.create()
@connect(() => ({}))
class CustomerInfo extends Component {
  state = {
    visible: false,
    popoverVisible: false,
    submiting: false,
    error: null,
  };

  content = () => {
    const { data } = this.props;

    return (
      <div className={styles.popoverContent}>
        <p span={24}>
          <b>姓名：</b>
          <span>{data.name}</span>
        </p>

        <p span={24}>
          <b>邮箱：</b>
          <span>{data.email}</span>
        </p>

        <p span={24}>
          <b>电话：</b>
          <span>{data.phone}</span>
        </p>

        <p span={24}>
          <b>国家/地区：</b>
          <span>{data.country}</span>
        </p>

        <p>
          <b>省/州：</b>
          <span>{data.province}</span>
        </p>

        <p>
          <b>城市：</b>
          <span>{data.city}</span>
        </p>

        <p>
          <b>邮编：</b>
          <span>{data.zip_code}</span>
        </p>

        <p>
          <b>地址1：</b>
          <span>{data.address1}</span>
        </p>
        <p>
          <b>地址2：</b>
          <span>{data.address2}</span>
        </p>

        <p>
          <b>地址3：</b>
          <span>{data.address3}</span>
        </p>
        <Divider />
        <dir style={{ textAlign: 'right' }}>
          <Button onClick={() => this.handVisibleChange(false)} size="small">
            关闭
          </Button>
          <Button
            onClick={this.openModal}
            size="small"
            type="primary"
            style={{
              marginLeft: 12,
            }}
          >
            修改客户信息
          </Button>
        </dir>
      </div>
    );
  };

  /**
   * 打开modal
   */
  openModal = () => {
    this.setState({
      visible: true,
      popoverVisible: false,
    });
  };

  /**
   * 关闭modal
   */
  closeModal = () => {
    const {
      form: { resetFields },
    } = this.props;

    resetFields();

    this.setState({
      visible: false,
    });
  };

  handVisibleChange = visible => {
    this.setState({
      popoverVisible: visible,
    });
  };

  submit = e => {
    e.preventDefault();

    const {
      form,
      form: { validateFields },
      dispatch,
      data: { id },
      onSuccess,
    } = this.props;

    validateFields(async (err, values) => {
      if (err) return;

      this.setState({
        submiting: true,
        error: null,
      });

      await dispatch({
        type: 'order/updateCusromer',
        payload: {
          ...values,
        },
        id,
        callback: res => {
          const { response, data } = res;

          if (response && response.status === 200) {
            notification.success({
              message: data && data.message,
            });

            form.resetFields();
            if (onSuccess) onSuccess();
            this.setState({
              submiting: false,
              visible: false,
            });
          } else {
            this.setState({
              error: data && data.error,
              submiting: false,
            });
          }
        },
      });
    });
  };

  render() {
    const {
      popover,
      children,
      data,
      form: { getFieldDecorator },
    } = this.props;
    const { visible, popoverVisible, error, submiting } = this.state;
    return (
      <>
        <Popover
          {...popover}
          content={this.content()}
          visible={popoverVisible}
          onVisibleChange={this.handVisibleChange}
          trigger="click"
        >
          <a>{children}</a>
        </Popover>

        <Modal
          okButtonProps={{
            loading: submiting,
          }}
          visible={visible}
          title="修改客户信息"
          centered
          width={600}
          style={{
            maxWidth: '100vw',
          }}
          onCancel={this.closeModal}
          maskClosable={false}
          keyboard={false}
          okText="修改"
          onOk={this.submit}
        >
          <Form onSubmit={this.submit} className={styles.form} layout="inline">
            <Row gutter={12}>
              <Col span={12}>
                <FormItem label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: data.name,
                    rules: [
                      {
                        required: true,
                        message: '必填',
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="small" placeholder="姓名" />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="邮箱">
                  {getFieldDecorator('email', {
                    initialValue: data.email,
                    rules: [
                      {
                        type: 'email',
                        message: '错误的格式',
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="small" placeholder="email" />)}
                </FormItem>
              </Col>

              {/* 电话 */}
              <Col span={12}>
                <FormItem label="电话">
                  {getFieldDecorator('phone', {
                    initialValue: data.phone,
                    rules: [
                      {
                        required: true,
                        message: '必填',
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="small" placeholder="电话" />)}
                </FormItem>
              </Col>

              {/* 邮编 */}
              <Col span={12}>
                <FormItem label="邮编">
                  {getFieldDecorator('zip_code', {
                    initialValue: data.zip_code,
                    rules: [
                      {
                        required: true,
                        message: '必填',
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="small" placeholder="邮编" />)}
                </FormItem>
              </Col>

              {/* 国家或地区 */}
              <Col span={12}>
                <FormItem label="国家/地区">
                  {getFieldDecorator('country', {
                    initialValue: data.country,
                    rules: [
                      {
                        required: true,
                        message: '必填',
                      },
                    ],
                  })(
                    <Input style={{ width: '100%' }} size="small" placeholder="国家或地区(简码)" />,
                  )}
                </FormItem>
              </Col>

              {/* 省、州 */}
              <Col span={12}>
                <FormItem label="省/州">
                  {getFieldDecorator('province', {
                    initialValue: data.province,
                  })(<Input style={{ width: '100%' }} size="small" placeholder="省/州" />)}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label="城市">
                  {getFieldDecorator('city', {
                    initialValue: data.city,
                  })(<Input style={{ width: '100%' }} size="small" placeholder="城市" />)}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label="地址1">
                  {getFieldDecorator('address1', {
                    initialValue: data.address1,
                  })(<Input style={{ width: '100%' }} size="small" placeholder="地址1" />)}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label="地址2">
                  {getFieldDecorator('address2', {
                    initialValue: data.address2,
                  })(<Input style={{ width: '100%' }} size="small" placeholder="地址2" />)}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label="地址1">
                  {getFieldDecorator('address3', {
                    initialValue: data.address3,
                  })(<Input style={{ width: '100%' }} size="small" placeholder="地址3" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
          {error && <Alert message={error} style={{ marginTop: 12 }} />}
        </Modal>
      </>
    );
  }
}

export default CustomerInfo;
