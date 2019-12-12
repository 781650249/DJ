import React, { Component } from 'react';
import { Form, Input, Button, notification, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
@Form.create()
@connect(({ changePwd, loading }) => ({
  changePwd,
  submitting: loading.effects['user/changePwd'],
}))
class index extends Component {
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

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div style={{ width: '260px', marginTop: '30px' }}>
        <Form onSubmit={this.handleUpdate}>
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

          <FormItem>
            <Button loading={submitting} type="primary" htmlType="submit">
              确认
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
export default index;
