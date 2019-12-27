/**
 * 订单操作日志
 * @author niming175<niming175@qq.com>
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table } from 'antd';
import moment from 'moment';
import SearchPane from './components/SearchForm';

@connect(({ orderOperateLog, loading }) => ({
  logLists: orderOperateLog.data.list,
  pagination: orderOperateLog.data.pagination,
  loading: loading.effects['orderOperateLog/fetch'],
}))
class OrderPerateLog extends Component {
  state = {
    filter: {},
  };

  columns = [
    {
      title: '订单编号',
      dataIndex: 'subject.oid',
    },
    {
      title: '人员姓名',
      dataIndex: 'causer.name',
    },
    {
      title: '操作时间',
      dataIndex: 'created_at',
      rander: date => moment(date).format('lll'),
    },
    {
      title: '操作事项',
      dataIndex: 'description',
    },
  ];

  componentDidMount() {
    this.fetch();
  }

  fetch = async params => {
    const { dispatch, pagination } = this.props;
    const { filter } = this.state;

    await dispatch({
      type: 'orderOperateLog/fetch',
      payload: {
        page: pagination.page,
        page_size: pagination.pageSize,
        filter,
        ...params,
      },
    });
  };

  handlePaginationChange = page => {
    this.fetch({
      page,
    });
  };

  handlePaginationSizeChange = (page, pageSize) => {
    this.fetch({
      page: 1,
      page_size: pageSize,
    });
  };

  handleSearch = params => {
    const { filter } = params;

    this.setState({
      filter,
    });

    this.fetch(params);
  };

  render() {
    const { logLists, loading, pagination } = this.props;
    return (
      <PageHeaderWrapper>
        <Card>
          <SearchPane onSearch={this.handleSearch} />
        </Card>

        <Card style={{ marginTop: 25 }}>
          <h3>日志列表</h3>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={logLists}
            columns={this.columns}
            pagination={{
              size: 'small',
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `总共${total}条记录`,
              pageSizeOptions: ['10', '20', '50'],
              total: pagination.total,
              current: pagination.page,
              pageSize: pagination.pageSize,
              onChange: this.handlePaginationChange,
              onShowSizeChange: this.handlePaginationSizeChange,
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderPerateLog;
