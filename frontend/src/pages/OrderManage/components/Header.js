import React from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import LeadOrders from '@/components/OrderManage/LeadOrders';
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
    const orderStatus = [
      {
        key: 'un_download',
        value: '未下载',
      },
      {
        key: 'downloaded',
        value: '已下载',
      },
      {
        key: 'processing',
        value: '处理中',
      },
      {
        key: 'processed',
        value: '已处理',
      },
      {
        key: 'published',
        value: '已发稿',
      },
      {
        key: 'confirmed',
        value: '已确认',
      },
      {
        key: 'produced',
        value: '已生产',
      },
      {
        key: 'frozen',
        value: '已冻结',
      },
      {
        key: 'wait_change',
        value: '待修改',
      },
    ];
    const menu = orderStatus.map(item => (
      <Option value={item.key} key={item.value}>
        {item.value}
      </Option>
    ));

    return (
      <Form onSubmit={this.handleSearch}>
        <Row type="flex">
          <Form layout="inline">
            <FormItem labelAlign="left" label="订单编号">
              {getFieldDecorator('keyword')(
                <Input placeholder="请输入" style={{ width: '260px' }} allowClear />,
              )}
            </FormItem>

            <FormItem labelAlign="left" label="客户邮箱">
              {getFieldDecorator('email')(
                <Input placeholder="请输入" style={{ width: '260px' }} allowClear />,
              )}
            </FormItem>

            <FormItem labelAlign="left" label="客户名称">
              {getFieldDecorator('name', {})(
                <Input placeholder="请输入" style={{ width: '260px' }} allowClear />,
              )}
            </FormItem>
          </Form>
          <Col offset={1}>
            <Form>
              <Form.Item>
                {getFieldDecorator('status', {})(
                  <Select allowClear placeholder="不限" style={{ width: 100 }}>
                    {menu}
                  </Select>,
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <div style={{ display: count > 8 ? 'block' : 'none' }}>
          <Row type="flex" justify="start">
            <Form layout="inline">
              <FormItem labelAlign="left" label="订单时间">
                {getFieldDecorator('created_at')(
                  <RangePicker
                    style={{ width: '260px' }}
                    showTime
                    ranges={{
                      今天: [moment().startOf('day'), moment().endOf('day')],
                      '7天内': [moment().subtract(7, 'days'), moment()],
                      '1个月内': [moment().subtract(30, 'days'), moment()],
                    }}
                  />,
                )}
              </FormItem>

              <FormItem labelAlign="left" label="发稿时间">
                {getFieldDecorator('published_at')(
                  <RangePicker
                    style={{ width: '260px' }}
                    showTime
                    ranges={{
                      今天: [moment().startOf('day'), moment().endOf('day')],
                      '7天内': [moment().subtract(7, 'days'), moment()],
                      '1个月内': [moment().subtract(30, 'days'), moment()],
                    }}
                  />,
                )}
              </FormItem>

              <FormItem labelAlign="left" label="生产时间">
                {getFieldDecorator('produced_at')(
                  <RangePicker
                    style={{ width: '260px' }}
                    showTime
                    ranges={{
                      今天: [moment().startOf('day'), moment().endOf('day')],
                      '7天内': [moment().subtract(7, 'days'), moment()],
                      '1个月内': [moment().subtract(30, 'days'), moment()],
                    }}
                  />,
                )}
              </FormItem>
            </Form>
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

        <Row style={{ marginTop: '10px' }} type="flex" justify="start">
          <Col>
            <LeadOrders />
          </Col>
          <Col offset={1}>
            <ExportGoods />
          </Col>
        </Row>
      </Form>
    );
  }
}
