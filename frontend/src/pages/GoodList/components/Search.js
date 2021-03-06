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
    isLoading: false,
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
    this.setState({
      isLoading: true,
    });
    dispatch({
      type: 'Goods/fetchGoods',
      payload: {
        page: 1,
        page_size: 10,
        filter: {
          keyword: InputValue,
        },
      },
      callback: response => {
        if (response.response.status === 200) {
          this.setState({
            isLoading: false,
          });
        }
      },
    });
  };

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        <Row type="flex" justify="start">
          <Col>
            <span style={{ marginRight: 16 }}>商品编码/sku名称 :</span>
            <Input
              value={this.state.InputValue}
              onChange={this.handleGetInputValue}
              style={{ width: 200 }}
              placeholder="请输入商品编码/sku名称"
            />
          </Col>
          <Col>
            <Button
              loading={isLoading}
              onClick={this.onSearch}
              style={{ marginLeft: 20 }}
              type="primary"
            >
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
