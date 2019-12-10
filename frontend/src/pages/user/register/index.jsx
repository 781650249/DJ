import React, { Component } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { connect } from 'dva';
import { Link, router } from 'umi';

@Form.create()
@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/register'],
}))
class Register extends Component {
  onRegister = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'user/register',
        payload: {
          ...values,
        },
        callback: response => {
          console.log(response);
          if (response.response.status === 200) {
            notification.success({
              message: '注册成功',
            });
            router.push('/user/login');
          }
        },
      });
    });
  };

  handleConfirmPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('password')) {
      callback('两次输入不一致！');
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ margin: '0 auto', width: 300, maxWidth: '100vw' }}>
        <Form onSubmit={this.onRegister}>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '用户名不能为空' }],
            })(<Input placeholder="用户名" />)}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: '邮箱不能为空' },
                { pattern: /\w+@\w+(\.\w+){1,2}/, message: '邮箱不正确' },
              ],
            })(<Input placeholder="邮箱" />)}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '密码不能为空' },
                { min: 6, message: '密码至少为6位组成' },
              ],
              validateFirst: true,
            })(<Input.Password placeholder="密码" type="password" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('c_password', {
              rules: [
                {
                  required: true,
                  message: '请再次输入以确认新密码',
                },
                {
                  validator: this.handleConfirmPassword,
                },
              ],
            })(<Input.Password placeholder="密码" type="password" />)}
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              注册
            </Button>
            <Link style={{ float: 'right' }} to="/user/login">
              去登录
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Register;
