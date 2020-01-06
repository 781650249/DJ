import React, { Component } from 'react';
import { Table, Button, Alert, Row, Col, Card, Pagination } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UpdateCustomer from './components/UpdateCustomer';
import OriginImg from './components/OriginImg';
import SingHurryOrder from './components/SingHurryOrder';
import UpdateOrderStatus from './components/UpdateOrderStatus';
import SearchForm from './components/SearchForm';
import LeadOrders from '@/components/OrderManage/LeadOrders';
import styles from './index.less';
import ConfirmButton from '@/components/ConfirmButtion';
import { orderStatus } from '@/utils/settings';

@connect(({ order, loading }) => ({
  orderLists: order.data.lists,
  loading: loading.effects['order/fetch'],
  pagination: order.data.pagination,
}))
export default class OrderManage extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    sort: '-oid',
  };

  columns = [
    {
      dataIndex: 'urgent',
      render: (_, data) => <SingHurryOrder data={data} />,
    },
    {
      title: '订单编号',
      dataIndex: 'oid',
      sorter: true,
    },
    { title: '订单号', dataIndex: 'number', key: 'number' },
    {
      title: '原始素材',
      dataIndex: 'un_zip_files',
      render: files => files && <OriginImg files={files} />,
    },
    {
      title: '成品图片',
      dataIndex: 'finish_files',
      render: files => files && <OriginImg files={files} />,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: status => (
        <span style={{ color: orderStatus[status] && orderStatus[status].color }}>
          {orderStatus[status] && orderStatus[status].value}
        </span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    {
      title: '物流单号',
      dataIndex: 'shipping.track_number',
    },
    {
      title: '客户信息',
      dataIndex: 'customer',
      render: customer => customer.name,
    },
    { title: '发稿时间', dataIndex: 'published_at', key: 'published_at' },
    { title: '生产时间', dataIndex: 'produced_at', key: 'produced_at' },
    { title: 'sku', dataIndex: 'sku', key: 'sku' },
    { title: '销售量(件)', dataIndex: 'quantity', key: 'quantity' },
    {
      title: '中文名',
      dataIndex: 'product.title',
    },
  ];

  columnSon = [
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

  /**
   * 初始加载
   */
  componentDidMount() {
    this.fetch({
      page: 1,
    });
  }

  /**
   * 加载订单
   */
  fetch = (params = {}) => {
    const {
      pagination: { page, pageSize },
      dispatch,
    } = this.props;
    const { filter, sort } = this.state;

    dispatch({
      type: 'order/fetch',
      payload: {
        page,
        page_size: pageSize,
        filter,
        sort,
        ...params,
      },
    });
  };

  /**
   * 表单搜索
   */
  handleFormSearch = (params = {}) => {
    const { filter = {} } = params;
    this.setState({
      filter,
    });

    this.fetch(params);
  };

  /**
   * 页面大小改变
   */
  handleSizeChange = (page, pageSize) => {
    this.fetch({
      page: 1,
      page_size: pageSize,
    });
  };

  /**
   * 翻页
   */
  handlePageChange = page => {
    this.fetch({
      page,
    });
  };

  /**
   * 表变化
   */
  tableChange = (pagination, filter, sorter) => {
    if (sorter && sorter.field) {
      const { field, order } = sorter;
      const sort = `${order === 'ascend' ? '' : '-'}${field}`;

      this.setState({
        sort,
      });

      this.fetch({
        page: 1,
        sort,
      });
    }
  };

  /**
   * 取消选中行
   */
  clearSelectRow = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  /**
   * 选中行
   */
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  /**
   * 修改状态成功
   */
  handleUpdateStatusSuccess = () => {
    this.fetch();
  };

  render() {
    const {
      loading,
      pagination: { page, pageSize, total },
      orderLists,
    } = this.props;
    const { selectedRowKeys } = this.state;

    return (
      <PageHeaderWrapper
        className={styles.orderWrapper}
        title={
          <Row>
            <Col span={12}>订单管理</Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <LeadOrders />
            </Col>
          </Row>
        }
      >
        <Card>
          <SearchForm onSearch={this.handleFormSearch} />
        </Card>

        <Card style={{ marginTop: 25 }}>
          <Alert
            message={
              <>
                <span style={{ marginRight: 10 }}>已选 {selectedRowKeys.length} 项</span>

                <Button
                  type="link"
                  size="small"
                  disabled={!selectedRowKeys || selectedRowKeys.length === 0}
                  onClick={this.clearSelectRow}
                >
                  取消全选
                </Button>

                {/* 更改状态, type:single, batch */}
                <UpdateOrderStatus
                  ids={selectedRowKeys}
                  type="batch"
                  onSuccess={this.handleUpdateStatusSuccess}
                >
                  修改状态
                </UpdateOrderStatus>

                {/* 标记加急 */}
                <ConfirmButton
                  disabled={selectedRowKeys.length === 0}
                  content="你确定要将这条订单设为加急吗?"
                  onConfirm={this.handleChange}
                  button={{
                    type: 'link',
                    size: 'small',
                  }}
                >
                  标记加急
                </ConfirmButton>

                {/* 取消标记加急 */}
                <ConfirmButton
                  disabled={selectedRowKeys.length === 0}
                  content="你确定要将这条订单取消加急吗?"
                  onConfirm={this.batchCancelUrgent}
                  button={{
                    type: 'link',
                    size: 'small',
                  }}
                >
                  取消加急
                </ConfirmButton>
              </>
            }
            type="info"
            showIcon
          />

          <Table
            style={{
              marginTop: 20,
            }}
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange,
            }}
            columns={this.columns}
            rowKey="id"
            dataSource={orderLists}
            onChange={this.tableChange}
            pagination={false}
          />

          {/* 分页 */}
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Pagination
              size="small"
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['10', '20', '50']}
              current={page}
              pageSize={pageSize}
              total={total}
              showTotal={totals => `总共有${totals}条记录`}
              onChange={this.handlePageChange}
              onShowSizeChange={this.handleSizeChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
