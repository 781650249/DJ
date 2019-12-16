import { Modal, notification, Button, Alert, Table } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import Search from './components/Search';
import UpdateGoods from './components/UpdateGoods';

const { confirm } = Modal;

@connect(({ Goods, loading }) => ({
  Goods,
  submitting: loading.effects['Goods/fetchGoods'],
}))
export default class GoodList extends Component {
  state = {
    selectedRowKeys: [],
    id: [],
  };

  componentDidMount() {
    this.onInitGoods();
  }

  showConfirm = id => {
    const { dispatch } = this.props;
    confirm({
      title: '你确定要删除这项数据吗',
      onOk() {
        dispatch({
          type: 'Goods/deleteGoods',
          payload: {
            id,
          },
          callback: () => {
            notification.success({
              message: '删除成功',
            });
            // 刷新
            dispatch({
              type: 'Goods/fetchGoods',
              payload: {
                page: 1,
                page_size: '',
              },
            });
          },
        });
      },
      onCancel() {},
    });
  };

  onInitGoods = e => {
    if (e) e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'Goods/fetchGoods',
      payload: {
        page: 1,
        page_size: '',
      },
    });
  };

  start = () => {
    this.setState({
      selectedRowKeys: [],
    });
  };

  onSelectChange = (selectedRowKeys, duoxuan) => {
    this.setState({ selectedRowKeys });
    const arr = [];
    duoxuan.map(duo => arr.push(duo.id));
    this.setState({
      id: arr,
    });
  };

  bDelete = () => {
    const { id } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Goods/bdeleteGoods',
      payload: {
        ids: { ...id },
      },
      callback: response => {
        if (response.response.status === 200) {
          notification.success({
            message: '删除成功',
          });
          dispatch({
            type: 'Goods/fetchGoods',
            payload: {
              page: 1,
              page_size: '',
            },
          });
          this.setState({
            selectedRowKeys: [],
          });
        }
      },
    });
  };

  render() {
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        render: text => <a>{text}</a>,
      },
      {
        title: '英文标题',
        dataIndex: 'title_en',
      },
      {
        title: 'sku',
        dataIndex: 'sku',
      },
      {
        title: '重量(g)',
        dataIndex: 'weight',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
      },
      {
        title: '采购价格',
        dataIndex: 'purchase_price',
      },
      {
        title: '单双面',
        dataIndex: 'double_side',
        render(doubleSide) {
          return doubleSide === 1 ? '双' : '单';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at - b.created_at,
      },
      {
        title: '备注',
        dataIndex: 'note',
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (id, it) => (
          <div style={{ display: 'flex' }}>
            <Button
              title="删除"
              onClick={() => this.showConfirm(id)}
              icon="delete"
              type="link"
            ></Button>
            <UpdateGoods data={it} id={id} />
          </div>
        ),
      },
    ];

    const { selectedRowKeys, id } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      id,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const datas = this.props.Goods.result.data; // 更新后的数据

    return (
      <div style={{ minWidth: 400 }}>
        <Search />
        <div>
          <div style={{ marginBottom: 30, marginTop: 20, width: '100%' }}>
            <Alert
              message={
                <span>
                  <Button size="small" disabled={!hasSelected} type="primary" onClick={this.start}>
                    取消全选
                  </Button>
                  <Button
                    disabled={!hasSelected}
                    size="small"
                    style={{ marginLeft: 2 }}
                    type="danger"
                    onClick={this.bDelete}
                  >
                    删除
                  </Button>
                  <span style={{ marginLeft: 12 }}>
                    {hasSelected ? `当前选中了 ${selectedRowKeys.length} 项` : ''}
                  </span>
                </span>
              }
              type="info"
              showIcon
            ></Alert>
          </div>
          <Table rowSelection={rowSelection} columns={columns} dataSource={datas} />
        </div>
      </div>
    );
  }
}
