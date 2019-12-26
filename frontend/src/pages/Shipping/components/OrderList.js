import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

@connect(({ loading }) => ({
  fething: loading.effects['orderList/fetch'],
}))
export default class OrderList extends Component {
  state = {
    data: null,
    total: 0,
    page: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const { data, total } = this.props;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        data,
        total,
      });
    }
  }

  // 获取数据
  fetch = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orderList/fetch',
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
    // console.log('sorter', sorter);
    const { dispatch } = this.props;
    const { page, pageSize } = this.state;

    if (sorter.field) {
      const order = sorter.order === 'ascend' ? '' : '-';

      dispatch({
        type: 'orderList/fetch',
        payload: {
          page,
          page_size: pageSize,
          filter: {},
          sort: `${order}${sorter.field}`,
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

  render() {
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
    );
  }
}
