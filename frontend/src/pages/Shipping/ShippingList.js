import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Select, Input, DatePicker, Modal } from 'antd';
import moment from 'moment';
import UploadOrder from './components/UploadOrder';
import { formatCriteria } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ loading }) => ({
  fething: loading.effects['shipping/fetch'],
}))
export default class ShippingList extends Component {
  state = {
    visible: false,
    data: null,
    total: 0,
    page: 1,
    pageSize: 10,
    formatValues: null,
  };

  componentDidMount() {
    this.fetch();
  }

  // 搜索订单
  handleSearch = e => {
    e.preventDefault();
    const {
      form: { validateFields },
    } = this.props;
    const { dispatch } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // console.log('Form data... ', values);
        // console.log('format values', formatCriteria(values));
        const formatValues = formatCriteria(values);
        this.setState({
          formatValues,
        });

        dispatch({
          type: 'shipping/fetch',
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

  // 重置搜索
  handleReset = async () => {
    await this.setState({
      formatValues: null,
    });

    const {
      dispatch,
      form: { resetFields },
    } = this.props;
    const { formatValues } = this.state;
    resetFields();

    dispatch({
      type: 'shipping/fetch',
      payload: {
        filter: {
          ...formatValues,
        },
      },
      callback: res => {
        const {
          data: { data, total },
        } = res;

        this.setState({
          data,
          total,
        });
      },
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

  // 获取数据
  fetch = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shipping/fetch',
      payload: {
        page: 1,
        page_size: 10,
        ...params,
      },
      callback: res => {
        const { data } = res;
        // console.log('data...', data);
        this.setState({
          data: res.data.data,
          total: res.data.total,
          page: data.current_page,
          pageSize: parseInt(data.per_page, 10),
        });
      },
    });
  };

  // 更新时间排序
  handleTableChange = (a, b, sorter) => {
    // console.log('sorter....', sorter);
    const { dispatch } = this.props;
    const { page, pageSize } = this.state;

    if (sorter.field) {
      const order = sorter.order === 'ascend' ? '' : '-';

      dispatch({
        type: 'shipping/fetch',
        payload: {
          page,
          page_size: pageSize,
          filter: {},
          sort: `${order}${sorter.field}`,
        },
        callback: res => {
          // console.log(res)
          const {
            data: { data, total },
          } = res;
          // console.log(data)
          // console.log(total)
          this.setState({
            data,
            total,
          });
        },
      });
    }
  };

  // 页码发生变化后
  handlePageChange = page => {
    // console.log('page', page)
    this.fetch({ page });
  };

  // 修改每页订单条数
  handleShowSizeChange = (current, size) => {
    // console.log('current', current);
    // console.log('size', size);
    this.fetch({
      page: 1,
      page_size: size,
    });
  };

  handleUploadSubmit = () => {
    this.handleCancel();
    this.fetch();
  };

  render() {
    // 搜索订单
    const {
      form: { getFieldDecorator },
    } = this.props;
    const query = (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="订单">
          {getFieldDecorator('order_number')(
            <Input placeholder="请输入" style={{ width: '260px' }} allowClear />,
          )}
        </FormItem>
        <FormItem label="物流单号">
          {getFieldDecorator('track_number')(
            <Input placeholder="请输入" style={{ width: '260px' }} allowClear />,
          )}
        </FormItem>
        <FormItem label="操作时间">
          {getFieldDecorator('created_at')(
            <RangePicker
              style={{ width: '270px' }}
              defaultPickerValue={[
                moment('2019/12/1', 'YYYY/MM/DD'),
                moment('2019/12/1', 'YYYY/MM/DD'),
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
        <FormItem label="是否匹配：">
          {getFieldDecorator('has_order')(
            <Select style={{ width: 80 }} placeholder="不限" allowClear>
              <Option value={1}>是</Option>
              <Option value={0}>否</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem style={{ marginLeft: '100px' }}>
          <Button type="primary" style={{ width: '80px' }} htmlType="submit">
            查询
          </Button>
          ,
        </FormItem>
        <FormItem>
          <Button style={{ width: '80px' }} onClick={this.handleReset}>
            重置
          </Button>
          ,
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
          <UploadOrder submit={this.handleUploadSubmit} />
        </Modal>
      </div>
    );

    // 物流订单表
    const columns = [
      {
        title: '序列号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '订单号',
        dataIndex: 'order_number',
        key: 'order_number',
      },
      {
        title: '物流单号',
        key: 'track_number',
        dataIndex: 'track_number',
      },
      {
        title: '匹配订单',
        key: 'order',
        dataIndex: 'order',
        render: order => (order ? <span>是</span> : <span>否</span>),
      },
      {
        title: '更新时间',
        dataIndex: 'created_at',
        sorter: true,
      },
    ];

    const { fething } = this.props;
    const { data, total, page, pageSize } = this.state;
    return (
      <div>
        {query}
        {upload}
        <Table
          style={{ marginTop: '50px' }}
          loading={fething}
          rowKey="id"
          columns={columns}
          dataSource={data}
          onChange={this.handleTableChange}
          pagination={{
            total,
            current: page,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: totals => `总共有 ${totals} 条记录`,
            onChange: this.handlePageChange,
            onShowSizeChange: this.handleShowSizeChange,
          }}
        />
      </div>
    );
  }
}
