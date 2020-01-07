import React, { Component } from 'react';
import { Table, Button, Alert, Row, Col, Card, Pagination, Icon, notification } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UpdateCustomer from './components/UpdateCustomer';
import OriginImg from './components/OriginImg';
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
      title: '订单编号',
      dataIndex: 'oid',
      sorter: true,
      render: (oid, item) => (
        <>
          {/* {
            item.status === 'published' && (
              <div>
                <Icon style={{ fontSize: 20 }} type="check-circle" theme="twoTone"
                twoToneColor="#8bc34a" />
                <span style={{ marginLeft: 8, flex: 1 }}>{oid}</span>
              </div>
            )
          } */}
          {!!item.urgent && (
            <ConfirmButton
              content={<span>你确定要取消该订单的加急标记么?</span>}
              disabled={item.status === 'produced'}
              onConfirm={() => this.handleCancelUrgent(item.id)}
              button={{
                type: 'link',
                size: 'small',
                loading: false,
              }}
            >
              <div className={styles.urgentDiv}>
                <Icon
                  style={{ fontSize: 20 }}
                  type="clock-circle"
                  theme="twoTone"
                  twoToneColor="#ff4d4f"
                />
                <span style={{ marginLeft: 8, flex: 1 }}>{oid}</span>
              </div>
            </ConfirmButton>
          )}

          {!item.urgent && (
            <ConfirmButton
              content={<span>你确定要将该订单标记为加急吗?</span>}
              disabled={item.status === 'produced'}
              onConfirm={() => this.handleUrgent(item.id)}
              button={{
                type: 'link',
                size: 'small',
                loading: false,
              }}
            >
              <div className={styles.urgentDiv}>
                <Icon
                  style={{ fontSize: 20 }}
                  type="clock-circle"
                  theme="twoTone"
                  twoToneColor="#ccc"
                />
                <span style={{ marginLeft: 8, flex: 1 }}>{oid}</span>
              </div>
            </ConfirmButton>
          )}
        </>
      ),
    },
    { title: '订单号', dataIndex: 'number', key: 'number' },
    {
      title: '原始素材',
      dataIndex: 'un_zip_files',
      render: files => (
        <>
          {files && files.length > 0 && (
            <div style={{ minWidth: 80, textAlign: 'center' }}>
              <OriginImg title="原始素材" files={files} />
            </div>
          )}
          {(!files || files.length === 0) && (
            <div style={{ color: '#ccc', textAlign: 'center' }}>——</div>
          )}
        </>
      ),
    },
    {
      title: '成品图片',
      dataIndex: 'finish_files',
      render: files => (
        <>
          {files && (
            <div style={{ minWidth: 80, textAlign: 'center' }}>
              <OriginImg title="成品图片" files={files} />
            </div>
          )}
          {!files && <div style={{ color: '#ccc', textAlign: 'center' }}>——</div>}
        </>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: (status, item) => (
        <UpdateOrderStatus
          data={{
            id: item.id,
            oid: item.oid,
            status: item.status,
          }}
          type="single"
          onSuccess={this.handleUpdateStatusSuccess}
        >
          <span style={{ color: orderStatus[status] && orderStatus[status].color }}>
            {orderStatus[status] && orderStatus[status].value}
          </span>
        </UpdateOrderStatus>
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
   * 标记加急
   */
  handleUrgent = async id => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'order/urgent',
      id,
      callback: res => {
        const { data, response } = res;

        if (response && response.status === 200) {
          notification.success({
            message: data && data.message,
          });

          this.fetch();
        }
      },
    });
  };

  /**
   * 取消加急标记
   */
  handleCancelUrgent = async id => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'order/calcelUrgent',
      id,
      callback: res => {
        const { data, response } = res;

        if (response && response.status === 200) {
          notification.success({
            message: data && data.message,
          });

          this.fetch();
        }
      },
    });
  };

  /**
   * 批量标记加急
   */
  handlBatchUrgent = async () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;

    await dispatch({
      type: 'order/batchUrgent',
      payload: {
        ids: selectedRowKeys,
      },
      callback: res => {
        const { data, response } = res;

        if (response && response.status === 200) {
          notification.success({
            message: data && data.message,
            description: data && (
              <>
                <p style={{ marginBottom: 1 }}>
                  标记了: <b>{data.orders_count}</b> 个订单，
                </p>
                <p style={{ marginBottom: 1 }}>
                  成功： <b>{data.success_of_time} 个,</b>
                </p>
                <p style={{ marginBottom: 1, color: '#ff4d4f' }}>
                  失败： <b>{data.error_of_time} 个,</b>
                </p>
              </>
            ),
          });
        }

        this.fetch();
      },
    });
  };

  /**
   * 批量取消标记
   */
  handleBatchCancelUrgent = async () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;

    await dispatch({
      type: 'order/batchCancelUrgentOrder',
      payload: {
        ids: selectedRowKeys,
      },
      callback: res => {
        const { data, response } = res;

        if (response && response.status === 200) {
          notification.success({
            message: data && data.message,
            description: data && (
              <>
                <p style={{ marginBottom: 1 }}>
                  取消: <b>{data.orders_count}</b> 个订单标记加急，
                </p>
                <p style={{ marginBottom: 1 }}>
                  成功： <b>{data.success_of_time} 个,</b>
                </p>
                <p style={{ marginBottom: 1, color: '#ff4d4f' }}>
                  失败： <b>{data.error_of_time} 个,</b>
                </p>
              </>
            ),
          });
        }

        this.fetch();
      },
    });
  };

  /**
   * 批量删除订单
   */
  handleBatchDelete = async () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;

    await dispatch({
      type: 'order/batchDelete',
      payload: {
        ids: selectedRowKeys,
      },
      callback: res => {
        const { data, response } = res;

        if (response && response.status === 200) {
          notification.success({
            message: data && data.message,
            description: <p>删除了{data && data.order_count} 个订单</p>,
          });
        }

        this.fetch();
      },
    });
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
                  content={
                    <span>
                      你确定要将 <a>{selectedRowKeys.length}</a> 条订单标记为加急吗?
                    </span>
                  }
                  onConfirm={this.handlBatchUrgent}
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
                  content={
                    <span>
                      你确定要将 <a>{selectedRowKeys.length}</a> 条订单取消加急吗?
                    </span>
                  }
                  onConfirm={this.handleBatchCancelUrgent}
                  button={{
                    type: 'link',
                    size: 'small',
                  }}
                >
                  取消加急
                </ConfirmButton>

                {/* 批量删除 */}
                <ConfirmButton
                  disabled={selectedRowKeys.length === 0}
                  content={
                    <>
                      <p>
                        确定删除这 <a>{selectedRowKeys.length}</a> 条订单？{' '}
                      </p>
                      <small style={{ color: '#ff4d4f' }}>
                        同时还会删除订单相关的图片文件等信息
                      </small>
                    </>
                  }
                  onConfirm={this.handleBatchDelete}
                  button={{
                    type: 'link',
                    size: 'small',
                  }}
                >
                  删除订单
                </ConfirmButton>
              </>
            }
            type="info"
            showIcon
          />

          <Table
            className={styles.table}
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
