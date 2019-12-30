import { Alert, Form, Input, Button, notification, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';

const FormItem = Form.Item;
@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'login/login',
        payload: {
          grant_type: 'password',
          client_id: '3',
          client_secret: 'PggwVjfP0OiEs1N98YqOlt6oTpTgrIgHs00FVjym',
          ...values,
        },
        callback: () => {
          notification.success({
            message: '登陆成功',
          });
          window.location.href = '/';
        },
      });
    });
  };

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    return (
      <div style={{ margin: '0 auto', width: 300, maxWidth: '100vw' }}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: '邮箱不能为空' },
                { pattern: /\w+@\w+(\.\w+){1,2}/, message: '邮箱不正确' },
              ],
            })(
              <Input
                placeholder="邮箱"
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />,
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '密码不能为空' },
                { min: 6, message: '密码至少为6位组成' },
              ],
            })(
              <Input
                type="password"
                placeholder="密码"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button loading={submitting} type="primary" htmlType="submit">
              登陆
            </Button>
            <Link style={{ float: 'right' }} to="/user/register">
              去注册
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Login;
