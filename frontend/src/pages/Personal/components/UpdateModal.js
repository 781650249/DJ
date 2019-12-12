import React from 'react';
import { Form, Input, Button, notification, Icon, Modal } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
@Form.create()
@connect(({ changePwd, loading }) => ({
  changePwd,
  submitting: loading.effects['user/changePwd'],
}))
class UpdateModal extends React.Component {
  state = { visible: false };

  handleUpdate = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'user/changePwd',
        payload: {
          ...values,
        },
        callback: response => {
          if (response.response.status === 200) {
            notification.success({
              message: '修改成功',
            });
          }
          this.props.form.resetFields();
        },
      });
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
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
    this.props.form.resetFields();
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Button style={{ marginLeft: '10px' }} type="dashed" onClick={this.showModal}>
          修改密码
        </Button>
        <Modal
          width="320px"
          props={this.props}
          title="修改密码"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              退出
            </Button>,
            <Button key="confirm" type="primary" htmlType="submit" onClick={this.handleUpdate}>
              确认
            </Button>,
          ]}
        >
          <div>
            <Form>
              <FormItem>
                {getFieldDecorator('old_password', {
                  rules: [
                    { required: true, message: '密码不能为空' },
                    { min: 6, message: '密码至少为6位组成' },
                  ],
                  validateFirst: true,
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="旧密码"
                  />,
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('new_password', {
                  rules: [
                    { required: true, message: '密码不能为空' },
                    { min: 6, message: '密码至少为6位组成' },
                  ],
                  validateFirst: true,
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="新密码"
                  />,
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('confirm_password', {
                  rules: [
                    { required: true, message: '密码不能为空' },
                    { min: 6, message: '密码至少为6位组成' },
                  ],
                  validateFirst: true,
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="确认密码"
                  />,
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default UpdateModal;
