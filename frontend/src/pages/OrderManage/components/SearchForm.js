import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Select, DatePicker, Checkbox } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatCriteria } from '@/utils/utils';
import styles from './styles.less';
import { orderStatus } from '@/utils/settings';

const { Option } = Select;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

@Form.create()
@connect(({ loading }) => ({
  sumitting: loading.effects['orders/fetchOrders'],
}))
export default class SearchForm extends Component {
  status = {};

  /**
   * 发起搜索
   */
  handleSearch = e => {
    e.preventDefault();

    const {
      form: { validateFields },
      onSearch,
    } = this.props;

    validateFields((err, values) => {
      const tmpVal = values;

      if (tmpVal.urgent) {
        tmpVal.urgent = 1;
      } else {
        tmpVal.urgent = undefined;
      }

      const filter = formatCriteria(tmpVal);

      if (onSearch) {
        onSearch({
          page: 1,
          filter,
        });
      }
    });
  };

  /**
   * 重置
   */
  handleReset = () => {
    const {
      form: { resetFields },
      onSearch,
    } = this.props;

    resetFields();

    if (onSearch) {
      onSearch({
        page: 1,
        filter: {},
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      sumitting,
    } = this.props;

    return (
      <Form layout="inline" className={styles.form} onSubmit={this.handleSearch}>
        <Row gutter={16}>
          <Col xs={12} md={8} lg={8} xl={6}>
            <FormItem label="订单编号">
              {getFieldDecorator('keyword')(
                <Input placeholder="订单编号" style={{ width: '100%' }} allowClear />,
              )}
            </FormItem>
          </Col>
          <Col xs={12} md={8} lg={8} xl={6}>
            <FormItem label="客户邮箱">
              {getFieldDecorator('email')(
                <Input placeholder="客户邮箱" style={{ width: '100%' }} allowClear />,
              )}
            </FormItem>
          </Col>
          <Col xs={12} md={8} lg={8} xl={6}>
            <FormItem label="客户名称">
              {getFieldDecorator('name', {})(
                <Input placeholder="客户名称" style={{ width: '100%' }} allowClear />,
              )}
            </FormItem>
          </Col>

          <Col xs={12} md={8} lg={8} xl={6}>
            <FormItem label="订单状态">
              {getFieldDecorator('status', {})(
                <Select allowClear style={{ width: '100%' }} placeholder="订单状态">
                  {Object.keys(orderStatus).map(key => (
                    <Option value={key} key={key}>
                      <span style={{ color: orderStatus[key].color }}>
                        {orderStatus[key].value}
                      </span>
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col xs={12} md={8} lg={8} xl={6}>
            <FormItem label="订单时间">
              {getFieldDecorator('created_at')(
                <RangePicker
                  style={{ width: '100%' }}
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                  ranges={{
                    今天: [moment().startOf('day'), moment().endOf('day')],
                    '7天内': [moment().subtract(7, 'days'), moment()],
                    '1个月内': [moment().subtract(30, 'days'), moment()],
                  }}
                />,
              )}
            </FormItem>
          </Col>
          <Col xs={12} md={8} lg={8} xl={6}>
            <FormItem label="发稿时间">
              {getFieldDecorator('published_at')(
                <RangePicker
                  style={{ width: '100%' }}
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                  ranges={{
                    今天: [moment().startOf('day'), moment().endOf('day')],
                    '7天内': [moment().subtract(7, 'days'), moment()],
                    '1个月内': [moment().subtract(30, 'days'), moment()],
                  }}
                />,
              )}
            </FormItem>
          </Col>
          <Col xs={12} md={8} lg={8} xl={6}>
            <FormItem label="生产时间">
              {getFieldDecorator('produced_at')(
                <RangePicker
                  style={{ width: '100%' }}
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                  ranges={{
                    今天: [moment().startOf('day'), moment().endOf('day')],
                    '7天内': [moment().subtract(7, 'days'), moment()],
                    '1个月内': [moment().subtract(30, 'days'), moment()],
                  }}
                />,
              )}
            </FormItem>
          </Col>

          {/* 选择框 */}
          <Col xs={12} md={8} lg={8} xl={2}>
            <FormItem>{getFieldDecorator('urgent')(<Checkbox>加急</Checkbox>)}</FormItem>
          </Col>
          <Col
            xs={12}
            md={8}
            lg={8}
            xl={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 40,
              justifyContent: 'flex-end',
            }}
          >
            <FormItem>
              <Button loading={sumitting} type="primary" htmlType="submit">
                查询
              </Button>
              <Button disabled={sumitting} style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
