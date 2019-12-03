import { Alert, Form, Input, Button, notification, Row, Col } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { NavLink } from 'umi';

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
          client_id: '2',
          client_secret: 'TmcgliNsLxIkpFWY9zS4NMMbe1wNVjR1UwKUl7H1',
          ...values,
        },
        callback: () => {
          notification.success({
            message: '登陆成功',
          });
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
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Row type="flex" justify="center">
          <Col span={4}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem>{getFieldDecorator('username')(<Input placeholder="邮箱" />)}</FormItem>

              <FormItem>
                {getFieldDecorator('password')(<Input type="password" placeholder="密码" />)}
              </FormItem>
              <FormItem>
                <Button loading={submitting} type="primary" htmlType="submit">
                  登陆
                </Button>
                <NavLink style={{ float: 'right' }} to="/user/register">
                  去注册
                </NavLink>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
