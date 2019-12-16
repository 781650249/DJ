import { Input, Button, Row, Col } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import AddGoods from './AddGoods';
import LeadGoods from '@/components/GoodList/LeadGoods';

@connect(({ Goods, loading }) => ({
  Goods,
  submitting: loading.effects['Goods/fetchGoods'],
}))
export default class Search extends Component {
  state = {
    InputValue: '',
  };

  handleGetInputValue = event => {
    this.setState({
      InputValue: event.target.value,
    });
  };

  onSearch = e => {
    if (e) e.preventDefault();
    const { dispatch } = this.props;
    const { InputValue } = this.state;

    dispatch({
      type: 'Goods/fetchGoods',
      payload: {
        page: '',
        page_size: '',
        filter: {
          keyword: InputValue,
        },
      },
    });
  };

  render() {
    return (
      <div>
        <Row type="flex" justify="start">
          <Col>
            {' '}
            <Input
              value={this.state.InputValue}
              onChange={this.handleGetInputValue}
              style={{ width: 400 }}
              addonBefore="商品编码/sku名称"
              placeholder="请输入商品编码/sku名称"
            />
          </Col>
          <Col>
            <Button onClick={this.onSearch} style={{ marginLeft: 20 }} type="primary">
              查询
            </Button>
          </Col>
        </Row>

        <div style={{ marginTop: '20px' }}>
          <Row type="flex" justify="start">
            <Col>
              <AddGoods />
            </Col>

            <Col style={{ marginLeft: 35 }}>
              <LeadGoods />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
