import { Button, Modal, Form, Input, notification } from 'antd';
import { connect } from 'dva';
import React from 'react';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line react/prefer-stateless-function
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, data = {}, loading } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 12 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 12 },
          sm: { span: 18 },
        },
      };

      return (
        <Modal
          maskClosable={false}
          visible={visible}
          title="修改顾客信息"
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={loading}
        >
          <div style={{ padding: 12 }}>
            <Form {...formItemLayout} layout="vertical">
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  initialValue: data.name,
                  rules: [{ required: true, message: '姓名不能为空' }],
                })(<Input type="textarea" placeholder="请输入姓名" />)}
              </Form.Item>

              <Form.Item label="邮箱">
                {getFieldDecorator('email', {
                  initialValue: data.email,
                  rules: [{ required: true, message: '邮箱不能为空' }],
                })(<Input placeholder="请输入邮箱" />)}
              </Form.Item>

              <Form.Item label="phone">
                {getFieldDecorator('phone', {
                  initialValue: data.phone,
                  rules: [{ max: 32, message: '最大长度不能超过32' }],
                })(<Input placeholder="请输入手机号" />)}
              </Form.Item>

              <Form.Item label="国家">
                {getFieldDecorator('country', {
                  initialValue: data.country,
                  rules: [{ max: 32, message: '最大长度不能超过32' }],
                })(<Input placeholder="请输入国家" />)}
              </Form.Item>

              <Form.Item label="州/省">
                {getFieldDecorator('province', {
                  initialValue: data.province,
                  rules: [{ max: 32, message: '最大长度不能超过32' }],
                })(<Input placeholder="请输入国家" />)}
              </Form.Item>

              <Form.Item label="城市">
                {getFieldDecorator('city', {
                  initialValue: data.city,
                  rules: [{ max: 32, message: '最大长度不能超过32' }],
                })(<Input placeholder="请输入城市" />)}
              </Form.Item>

              <Form.Item label="邮编">
                {getFieldDecorator('zip_code', {
                  initialValue: data.zip_code,
                  rules: [{ max: 16, message: '最大长度不能超过16' }],
                })(<Input placeholder="请输入邮编" />)}
              </Form.Item>

              <Form.Item label="地址1">
                {getFieldDecorator('address1', {
                  initialValue: data.address1,
                  rules: [{ max: 128, message: '最大长度不能超过128' }],
                })(<Input placeholder="请输入地址1" />)}
              </Form.Item>

              <Form.Item label="地址2">
                {getFieldDecorator('address2', {
                  initialValue: data.address2,
                  rules: [{ max: 128, message: '最大长度不能超过128' }],
                })(<Input placeholder="请输入地址2" />)}
              </Form.Item>

              <Form.Item label="地址3">
                {getFieldDecorator('address3', {
                  initialValue: data.address3,
                  rules: [{ max: 128, message: '最大长度不能超过128' }],
                })(<Input placeholder="请输入地址3" />)}
              </Form.Item>
            </Form>
          </div>
        </Modal>
      );
    }
  },
);

@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/updateCustomer'],
}))
export default class updateCustomer extends React.Component {
  state = {
    visible: false,
    loading: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    const {
      dispatch,
      data: { id },
    } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        loading: true,
      });
      dispatch({
        type: 'orders/updateCustomer',
        payload: {
          id,
          ...values,
        },
        callback: response => {
          if (response.response.status === 200) {
            notification.success({
              message: '修改成功',
            });
            // 刷新
            dispatch({
              type: 'orders/fetchOrders',
              payload: {
                page: 1,
                page_size: '',
              },
            });
            form.resetFields();
          }
          this.setState({
            loading: false,
          });
          this.setState({ visible: false });
        },
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { data } = this.props;
    const { loading, errorMessage } = this.state;
    return (
      <>
        <Button
          icon="edit"
          title="编辑此条记录"
          shape="circle"
          size="small"
          onClick={this.showModal}
        ></Button>
        <CollectionCreateForm
          errorMessage={errorMessage}
          data={data}
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCreate={this.handleCreate}
          onCancel={this.handleCancel}
          loading={loading}
        />
      </>
    );
  }
}
