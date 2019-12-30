import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import LoadOrder from '@/components/OrderManage/LoadOrder';
import { connect } from 'dva';
import ExportGoods from './Export';

@Form.create()
@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/fetchOrders'],
}))
export default class Header extends React.Component {
  state = {
    expand: false,
    isLoading: false,
  };

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { dispatch } = this.props;
      this.setState({
        isLoading: true,
      });
      dispatch({
        type: 'orders/fetchOrders',
        payload: {
          page: 1,
          page_size: 10,
          filter: values,
        },
        callback: (response, data) => {
          if (data.status === 200) {
            this.setState({
              isLoading: false,
            });
          }
        },
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  render() {
    const { isLoading } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { Option } = Select;
    const count = this.state.expand ? 10 : 6;
    return (
      <Form
        className={{ padding: '24px', background: '#fbfbfb', border: '1px solid #d9d9d9' }}
        onSubmit={this.handleSearch}
      >
        <Row>
          <Row type="flex">
            <Col span={4}>
              <Form>
                <Form.Item>
                  {getFieldDecorator('keyword', {
                    rules: [{ required: true, message: '订单号不能为空' }],
                  })(<Input addonBefore="订单编号" placeholder="请输入" />)}
                </Form.Item>
              </Form>
            </Col>
            <Col span={4} offset={2}>
              <Form>
                <Form.Item>
                  {getFieldDecorator('email', {
                    rules: [{ pattern: /\w+@\w+(\.\w+){1,2}/, message: '邮箱不正确' }],
                  })(<Input placeholder="请输入" addonBefore="客户邮箱" />)}
                </Form.Item>
              </Form>
            </Col>
            <Col span={4} offset={2}>
              <Form>
                <Form.Item>
                  {getFieldDecorator('name', {})(
                    <Input placeholder="请输入" addonBefore="客户名称" />,
                  )}
                </Form.Item>
              </Form>
            </Col>

            <Col offset={2}>
              <Form>
                <Form.Item>
                  {getFieldDecorator('status', {})(
                    <Select allowClear placeholder="不限" style={{ width: 120 }}>
                      <Option value="un_download" disabled>
                        未下载
                      </Option>
                      <Option value="downloaded" disabled>
                        已下载
                      </Option>
                      <Option value="processing"> 处理中</Option>
                      <Option value="processed">处理完成</Option>
                      <Option value="published"> 已发稿</Option>
                      <Option value="confirmed">已确认</Option>
                      <Option value="produced">已生产</Option>
                      <Option value="frozen">冻结</Option>
                      <Option value="wait_change">待修改</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Form>
            </Col>
            <div style={{ display: count > 8 ? 'block' : 'none' }}></div>
          </Row>

          <div span={24} style={{ position: 'absolute', right: 5, top: 0 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Search
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </div>
        </Row>

        <Row style={{ marginTop: '20px' }} type="flex" justify="start">
          <Col>
            <LoadOrder />
          </Col>
          <Col offset={1}>
            <ExportGoods />
          </Col>
        </Row>
      </Form>
    );
  }
}
