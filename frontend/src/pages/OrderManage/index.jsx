import React, { Component } from 'react';
import { Table, Button, Alert } from 'antd';
import { connect } from 'dva';
import Header from './components/Header';
// eslint-disable-next-line import/no-unresolved
import UpdateCustomer from './components/UpdateCustomer';
import OriginImg from './components/OriginImg';
import SingHurryOrder from './components/SingHurryOrder';
import HurryOrder from './components/HurryOrder';
import UpdateOrderStatus from './components/UpdateOrderStatus';
@connect(({ orders, loading }) => ({
  orders,
  submitting: loading.effects['orders/fetchOrders'],
}))
export default class Content extends Component {
  state = {
    selectedRowKeys: [],
    id: [],
  };

  componentDidMount() {
    this.initOrder();
  }

  initOrder = newPage => {
    const { dispatch } = this.props;
    const {
      result: { filter },
    } = this.props.orders;
    dispatch({
      type: 'orders/fetchOrders',
      payload: {
        page: newPage,
        page_size: 10,
        filter: {
          ...filter,
        },
      },
    });
  };

  start = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  bDelete = () => {};

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const columns = [
      {
        dataIndex: 'urgent',
        render: (_, data) => <SingHurryOrder data={data} />,
      },
      { title: '订单编号', dataIndex: 'oid', key: 'oid', width: '100px' },
      { title: '订单号', dataIndex: 'number', key: 'number' },
      { title: '订单时间', dataIndex: 'order_date', key: 'order_date', width: '100px' },
      { title: '订单状态', dataIndex: 'order_status', key: 'order_status', width: '100px' },
      { title: '发稿时间', dataIndex: 'published_at', key: 'published_at' },
      { title: '生产时间', dataIndex: 'produced_at', key: 'produced_at' },
      { title: 'sku', dataIndex: 'sku', key: 'sku' },
      {
        title: '原始素材',
        dataIndex: 'un_zip_files',
        key: 'un_zip_files',
        width: '200px',
        render: files => <OriginImg files={files} />,
      },
      { title: '订单备注', dataIndex: 'note', key: 'note', width: '100px' },
      { title: '销售量', dataIndex: 'quantity', key: 'quantity' },
    ];

    const { submitting } = this.props;
    const { selectedRowKeys, id } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      id,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const {
      orders: { result },
    } = this.props;
    const { data: datas, total, page } = result;
    const columnSon = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '国家',
        dataIndex: 'country',
      },
      {
        title: '省份',
        dataIndex: 'province',
      },
      {
        title: '地区',
        dataIndex: 'city',
      },
      {
        title: '地址',
        dataIndex: 'address1',
      },
      {
        title: '邮编',
        dataIndex: 'zip_code',
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (_, item) => (
          <>
            <UpdateCustomer style={{ marginLeft: '10px' }} data={item} />
          </>
        ),
      },
    ];
    return (
      <div>
        <Header />
        <div style={{ marginTop: 10 }}>
          <Alert
            message={
              <span>
                <Button size="small" disabled={!hasSelected} type="primary" onClick={this.start}>
                  取消全选
                </Button>
                <span style={{ marginLeft: 12 }}>
                  {hasSelected ? `当前选中了 ${selectedRowKeys.length} 项` : ''}
                </span>
              </span>
            }
            type="info"
            showIcon
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <Alert
            message={
              <div style={{ display: 'flex', marginTop: 10 }}>
                <UpdateOrderStatus hasSelected={hasSelected} id={selectedRowKeys} />
                <span style={{ marginLeft: '20px' }}>
                  <HurryOrder hasSelected={hasSelected} id={selectedRowKeys} />
                </span>
              </div>
            }
            type="error"
            showIcon
          />
        </div>
        <Table
          loading={submitting}
          pagination={{
            showQuickJumper: true,
            current: page,
            total,
            onChange: this.initOrder,
            showTotal: totals => `总共有${totals}条记录`,
          }}
          size="small"
          expandRowByClick={false}
          rowSelection={rowSelection}
          columns={columns}
          rowKey="id"
          dataSource={datas}
          expandedRowRender={record => (
            <Table
              rowKey="id"
              bordered
              style={{ margin: '20px 0' }}
              columns={columnSon}
              dataSource={[record.customer]}
              pagination={false}
              size="small"
            />
          )}
        />
      </div>
    );
  }
}
