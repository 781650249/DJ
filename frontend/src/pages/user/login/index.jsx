import { Alert, Form, Input, Button, notification } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './style.less';

const FormItem = Form.Item

@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch } = this.props

    form.validateFields((err, values) => {
        if (err) {
          return
        }

        dispatch({
          type: 'login/login',
          payload: {
            grant_type: 'password',
            client_id: '2',
            client_secret: 'TmcgliNsLxIkpFWY9zS4NMMbe1wNVjR1UwKUl7H1',
            ...values,
          },
          callback: response => {
            console.log(response)

            notification.success({
              message: '登陆成功',
            })

            window.location.href = '/';
          },
        })
      },
    )
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
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {
              getFieldDecorator('username')(
                <Input placeholder="邮件" />,
            )}
          </FormItem>

          <FormItem>
            {
              getFieldDecorator('password')(
                <Input type="password" placeholder="密码" />,
              )
            }
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
