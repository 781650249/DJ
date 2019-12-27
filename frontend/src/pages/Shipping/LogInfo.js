import React, { Component } from 'react';
import { Table } from 'antd';

export default class OrderList extends Component {
  // 页码发生变化后
  handlePageChange = () => {
    // console.log('hello');
  };

  render() {
    const columns = [
      {
        title: '时间',
        dataIndex: 'date',
      },
      {
        title: '执行文件',
        dataIndex: 'action',
      },
      {
        title: '结果描述',
        dataIndex: 'result',
      },
      {
        title: '成功数',
        dataIndex: 'success',
      },
      {
        title: '失败数',
        dataIndex: 'failure',
      },
      {
        title: '错误摘要',
        dataIndex: 'errorMsg',
      },
    ];

    const data = [
      {
        key: '1',
        date: '2015-10-10',
        action: 11111111,
        result: 22222222,
        success: 3,
        failure: 2,
        errorMsg: '.................',
      },
    ];
    return (
      <Table
        style={{ marginTop: '120px' }}
        columns={columns}
        dataSource={data}
        pagination={{
          total: 12,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: totals => `总共有${totals}条记录`,
          onChange: this.handlePageChange,
        }}
      />
    );
  }
}
