import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Select, Input, Tabs, DatePicker, Modal } from 'antd';
import moment from 'moment';
import UploadOrder from './components/UploadOrder';
import OrderList from './components/OrderList';
import ErrorList from './components/ErrorList';
import { formatCriteria } from '../../utils/utils';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
@connect(() => ({}))
export default class Shipping extends Component {
  state = {
    visible: false,
    data: null,
    total: null,
    formatValues: null,
  };

  // 搜索订单
  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // console.log('Form data... ', values);
        // console.log('format values', formatCriteria(values))
        const formatValues = formatCriteria(values);

        this.setState({
          formatValues,
        });

        dispatch({
          type: 'orderList/fetch',
          payload: {
            filter: {
              ...formatValues,
            },
          },
          callback: res => {
            // console.log('搜索订单 res.response', res.response);
            // console.log('搜索订单 res.data', res.data);
            const {
              data: { data, total },
            } = res;
            this.setState({
              data,
              total,
            });
          },
        });
      }
    });
  };

  // 导入订单
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
  };

  // 匹配订单
  handleMatchChange = value => {
    // console.log(value)
    const { dispatch } = this.props;
    const { formatValues } = this.state;
    const matchOrder = hasOrder => {
      dispatch({
        type: 'orderList/fetch',
        payload: {
          filter: {
            ...formatValues,
            has_order: hasOrder,
          },
        },
        callback: res => {
          const { data, total } = res.data;
          // console.log('res....', res)
          this.setState({
            data,
            total,
          });
        },
      });
    };

    if (value !== 'default') {
      const hasOrder = value === 'match' ? 1 : 0;

      matchOrder(hasOrder);
    } else {
      const hasOrder = null;
      matchOrder(hasOrder);
    }
  };

  render() {
    // 搜索订单
    const {
      form: { getFieldDecorator },
    } = this.props;
    const renderForm = (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="订单">
          {getFieldDecorator('order_number')(
            <Input placeholder="请输入" style={{ width: '260px' }} />,
          )}
        </FormItem>
        <FormItem label="物流单号">
          {getFieldDecorator('track_number')(
            <Input placeholder="请输入" style={{ width: '260px' }} />,
          )}
        </FormItem>
        <FormItem label="操作时间">
          {getFieldDecorator('created_at')(
            <RangePicker
              style={{ width: '270px' }}
              defaultPickerValue={[
                moment('2015/10/1', 'YYYY/MM/DD'),
                moment('2015/10/1', 'YYYY/MM/DD'),
              ]}
              showTime
              format="YYYY/MM/DD"
              ranges={{
                今天: [moment().startOf('day'), moment().endOf('day')],
                '7天内': [moment().subtract(7, 'days'), moment()],
                一个月内: [moment().subtract(30, 'days'), moment()],
              }}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('search')(
            <Button type="primary" style={{ width: '80px' }} htmlType="submit">
              查询
            </Button>,
          )}
        </FormItem>
      </Form>
    );

    // 导入订单
    const upload = (
      <div style={{ marginTop: '25px', display: 'inline-block' }}>
        <Button type="primary" onClick={this.showModal} style={{ width: '126px' }}>
          导入物流订单号
        </Button>
        <Modal
          title="导入物流订单号"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <UploadOrder />
        </Modal>
      </div>
    );

    // 是否匹配
    const match = (
      <div style={{ display: 'inline-block', marginLeft: '100px' }}>
        <span>是否匹配：</span>
        <Select defaultValue="不限" style={{ width: 70 }} onChange={this.handleMatchChange}>
          <Option value="default">不限</Option>
          <Option value="match">是</Option>
          <Option value="no_match">否</Option>
        </Select>
      </div>
    );

    const { data, total } = this.state;

    return (
      <div>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="上传物流订单号" key="1" style={{ marginTop: '15px' }}>
              {renderForm}
              {upload}
              {match}
              <OrderList data={data} total={total} />
            </TabPane>
            <TabPane tab="上传错误记录" key="2">
              <ErrorList />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
