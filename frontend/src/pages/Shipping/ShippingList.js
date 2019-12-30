import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Select, Input, DatePicker, Modal, Row, Col } from 'antd';
import moment from 'moment';
import UploadOrder from './components/UploadOrder';
import { formatCriteria } from '../../utils/utils';
import styles from './shippingList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ loading }) => ({
  fetching: loading.effects['shipping/fetch'],
}))
export default class ShippingList extends Component {
  state = {
    visible: false,
    data: null,
    total: 0,
    page: 1,
    pageSize: 10,
    filter: {},
    sort: '-created_at',
  };

  componentDidMount() {
    this.fetch();
  }

  // fetch
  fetch = async params => {
    const { page, pageSize, filter, sort } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'shipping/fetch',
      payload: {
        page,
        page_size: pageSize,
        filter,
        sort,
        ...params,
      },
      callback: res => {
        const { data } = res;
        this.setState({
          data: data.data,
          page: parseInt(data.current_page, 10),
          pageSize: parseInt(data.per_page, 10),
          total: parseInt(data.total, 10),
        });
      },
    });
  };

  // 搜索订单
  handleSearch = e => {
    e.preventDefault();
    const {
      form: { validateFields },
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        const formatValues = formatCriteria(values);
        this.setState({
          filter: formatValues,
        });

        this.fetch({
          page: 1,
          filter: formatValues,
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
      form: { resetFields },
    } = this.props;
    const { formatValues } = this.state;
    resetFields();

    this.fetch({
      filter: {
        ...formatValues,
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

  // 导入物流订单，并提交
  handleUploadSubmit = () => {
    this.handleCancel();
    this.fetch({
      page: 1,
      sort: '-created_at',
    });
  };

  // 排序、分页、分页大小
  handleTableChange = (pagination, _, sorter) => {
    const { field, order } = sorter;
    const { current, pageSize } = pagination;
    let sort = null;

    if (field && order) {
      sort = `${order === 'ascend' ? '' : '-'}${field}`;
      this.setState({
        sort,
      });
    }

    if (sort) {
      this.fetch({
        sort,
        page: current,
        page_size: pageSize,
      });
    } else {
      this.fetch({
        page: current,
        page_size: pageSize,
      });
    }
  };

  render() {
    const { fetching, form } = this.props;
    const { data, total, page, pageSize } = this.state;

    // 搜索订单
    const { getFieldDecorator } = form;
    const query = (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.form}>
        <Row gutter={16}>
          <Col xs={12} md={8} lg={8} xl={5}>
            <FormItem label="订单">
              {getFieldDecorator('order_number')(
                <Input placeholder="请输入" style={{ width: '100%' }} allowClear />,
              )}
            </FormItem>
          </Col>
          <Col xs={12} md={8} lg={8} xl={5}>
            <FormItem label="物流单号">
              {getFieldDecorator('track_number')(
                <Input placeholder="请输入" style={{ width: '100%' }} allowClear />,
              )}
            </FormItem>
          </Col>
          <Col xs={12} md={8} lg={8} xl={5}>
            <FormItem label="操作时间">
              {getFieldDecorator('created_at')(
                <RangePicker
                  style={{ width: '100%' }}
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
          </Col>
          <Col xs={12} md={8} lg={8} xl={5}>
            <FormItem label="是否匹配：">
              {getFieldDecorator('has_order')(
                <Select style={{ width: '100%' }} placeholder="不限" allowClear>
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col
            xs={24}
            md={16}
            lg={16}
            xl={4}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 40,
              justifyContent: 'flex-end',
            }}
          >
            <FormItem>
              <Button type="primary" htmlType="submit" loading={fetching}>
                查询
              </Button>
            </FormItem>
            <FormItem>
              <Button style={{ marginLeft: '8px' }} onClick={this.handleReset} disabled={fetching}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );

    // 导入订单
    const upload = (
      <div style={{ marginTop: '10px', display: 'inline-block' }}>
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
          <UploadOrder onFetch={this.handleUploadSubmit} />
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

    return (
      <div>
        {query}
        {upload}
        <Table
          style={{ marginTop: '30px' }}
          loading={fetching}
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
            showTotal: totals => (
              <p style={{ position: 'absolute', left: 0 }}>总共有 {totals} 条记录</p>
            ),
          }}
        />
      </div>
    );
  }
}
