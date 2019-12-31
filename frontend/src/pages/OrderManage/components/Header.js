import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import LoadOrder from '@/components/OrderManage/LoadOrder';
import { connect } from 'dva';
import ExportGoods from './Export';
import moment from 'moment';
import { formatCriteria } from '@/utils/utils';

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
      const filter = formatCriteria(values);
      this.setState({
        isLoading: true,
      });

      dispatch({
        type: 'orders/fetchOrders',
        payload: {
          page: 1,
          page_size: 10,
          filter,
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
    const { RangePicker } = DatePicker;
    const FormItem = Form.Item;
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
        <Row type="flex">
          <Col xs={12} md={8} lg={4}>
            <Form layout="inline">
              <FormItem>
                {getFieldDecorator('keyword', {
                  rules: [{ required: true, message: '订单号不能为空' }],
                })(<Input addonBefore="订单编号" placeholder="请输入" />)}
              </FormItem>
            </Form>
          </Col>
          <Col xs={12} md={8} lg={4} offset={2}>
            <Form>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{ pattern: /\w+@\w+(\.\w+){1,2}/, message: '邮箱不正确' }],
                })(<Input placeholder="请输入" addonBefore="客户邮箱" />)}
              </FormItem>
            </Form>
          </Col>
          <Col xs={12} md={8} lg={4} offset={2}>
            <Form>
              <FormItem>
                {getFieldDecorator('name', {})(
                  <Input placeholder="请输入" addonBefore="客户名称" />,
                )}
              </FormItem>
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

          <div style={{ display: count > 8 ? 'block' : 'none' }}>
            <Row type="flex" justify="start">
              <Col xs={12} md={8} lg={6}>
                <FormItem labelAlign="left" label="订单时间">
                  {getFieldDecorator('created_at')(
                    <RangePicker
                      style={{ width: '100%' }}
                      showTime
                      ranges={{
                        今天: [moment().startOf('day'), moment().endOf('day')],
                        '7天内': [moment().subtract(7, 'days'), moment()],
                        '1个月内': [moment().subtract(30, 'days'), moment()],
                      }}
                    />,
                  )}
                </FormItem>
              </Col>

              <Col offset={3} xs={12} md={8} lg={6}>
                <FormItem labelAlign="left" label="发稿时间">
                  {getFieldDecorator('published_at')(
                    <RangePicker
                      style={{ width: '100%' }}
                      showTime
                      ranges={{
                        今天: [moment().startOf('day'), moment().endOf('day')],
                        '7天内': [moment().subtract(7, 'days'), moment()],
                        '1个月内': [moment().subtract(30, 'days'), moment()],
                      }}
                    />,
                  )}
                </FormItem>
              </Col>

              <Col offset={3} xs={12} md={8} lg={6}>
                <FormItem labelAlign="left" label="生产时间">
                  {getFieldDecorator('produced_at')(
                    <RangePicker
                      style={{ width: '100%' }}
                      showTime
                      ranges={{
                        今天: [moment().startOf('day'), moment().endOf('day')],
                        '7天内': [moment().subtract(7, 'days'), moment()],
                        '1个月内': [moment().subtract(30, 'days'), moment()],
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>

          <div span={24} style={{ position: 'absolute', right: 5, top: 0 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              查询
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
