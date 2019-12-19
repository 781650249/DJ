import { notification, Button, Alert, Table } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import router from 'umi/router';
import Search from './components/Search';
import UpdateGoods from './components/UpdateGoods';
import DeleteConfirmButton from '@/components/DeleteConfirmButton';

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
    this.changeNum();
  }

  delete = async id => {
    const { dispatch } = this.props;
    await dispatch({
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
          },
        });
      },
    });
  };

  changeNum = newPage => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Goods/fetchGoods',
      payload: {
        page: newPage,
        page_size: 10,
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

  bDelete = async () => {
    const { id } = this.state;
    const { dispatch } = this.props;
    await dispatch({
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
            },
          });
          this.setState({
            selectedRowKeys: [],
          });
          router.push('/');
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
          <div style={{ minWidth: '113px' }}>
            <DeleteConfirmButton
              content="你确定要删除吗?"
              onConfirm={() => this.delete(id)}
              button={{
                title: '删除该条记录',
                icon: 'delete',
                shape: 'circle',
                size: 'small',
                type: 'primary',
              }}
            />
            <UpdateGoods style={{ marginLeft: '10px' }} data={it} id={id} />
          </div>
        ),
      },
    ];

    const { selectedRowKeys, id } = this.state;
    const { submitting } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      id,
    };

    const hasSelected = selectedRowKeys.length > 0;
    const {
      Goods: { result },
    } = this.props;

    const { data: datas } = result;
    const { total } = result;
    const { page } = result;
    return (
      <div style={{ minWidth: 400 }}>
        <Search />
        <div style={{ marginBottom: 10, marginTop: 20, width: '100%' }}>
          <Alert
            message={
              <span>
                <Button size="small" disabled={!hasSelected} type="primary" onClick={this.start}>
                  取消全选
                </Button>
                <span style={{ marginLeft: 20 }}>
                  <DeleteConfirmButton
                    content="你确定要删除吗?"
                    disabled={!hasSelected}
                    onCancel={this.start}
                    onConfirm={this.bDelete}
                    button={{
                      title: '删除该条记录',
                      icon: 'delete',
                      shape: 'circle',
                      size: 'small',
                      type: 'danger',
                    }}
                  />
                </span>
                <span style={{ marginLeft: 12 }}>
                  {hasSelected ? `当前选中了 ${selectedRowKeys.length} 项` : ''}
                </span>
              </span>
            }
            type="info"
            showIcon
          ></Alert>
        </div>
        <Table
          rowKey="id"
          loading={submitting}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={datas}
          pagination={{
            showQuickJumper: true,
            current: page,
            total,
            onChange: this.changeNum,
            showTotal: totals => `总共有${totals}条记录`,
          }}
        />
      </div>
    );
  }
}
