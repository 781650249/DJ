import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';

@connect(({ loading }) => ({
  fetching: loading.effects['logMsg/fetch'],
}))
export default class ShippingLog extends Component {
  state = {
    data: null,
    total: 0,
    page: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = params => {
    const { dispatch } = this.props;
    const { pageSize } = this.state;

    dispatch({
      type: 'logMsg/fetch',
      payload: {
        page: 1,
        page_size: pageSize,
        ...params,
      },
      callback: res => {
        const {
          data: { data, total },
        } = res;
        this.setState({
          data,
          total,
          page: res.data.current_page,
          pageSize: parseInt(res.data.per_page, 10),
        });
      },
    });
  };

  // 页码发生变化后
  handlePageChange = page => {
    this.fetch({ page });
  };

  // 修改每页订单条数
  handleShowSizeChange = (current, size) => {
    this.fetch({
      page: 1,
      page_size: size,
    });
  };

  render() {
    const columns = [
      {
        title: '时间',
        dataIndex: 'created_at',
      },
      {
        title: '执行文件',
        dataIndex: 'properties.file_name',
      },
      {
        title: '结果描述',
        dataIndex: 'description',
      },
      {
        title: '成功数',
        dataIndex: 'properties.success_count',
      },
      {
        title: '失败数',
        dataIndex: 'properties.error_count',
      },
      {
        title: '新增数',
        dataIndex: 'properties.new_count',
      },
      {
        title: '更新数',
        dataIndex: 'properties.update_count',
      },
      {
        title: '错误摘要',
        dataIndex: 'properties.errors',
        render: errors => (
          <p>{errors[0] && `导入文件第 ${errors[0].line} 行，${errors[0].error}`}</p>
        ),
      },
    ];

    const { fetching } = this.props;
    const { data, total, page, pageSize } = this.state;
    return (
      <Table
        loading={fetching}
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{
          total,
          current: page,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: totals => (
            <p style={{ position: 'absolute', left: 0 }}>总共有 {totals} 条记录</p>
          ),
          onChange: this.handlePageChange,
          onShowSizeChange: this.handleShowSizeChange,
        }}
      />
    );
  }
}
