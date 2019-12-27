import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs } from 'antd';
import ShippingList from './ShippingList';
import LogInfo from './LogInfo';

const { TabPane } = Tabs;

@connect(() => ({}))
export default class Shipping extends Component {
  render() {
    return (
      <div>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="上传物流订单号" key="1" style={{ marginTop: '15px' }}>
              <ShippingList />
            </TabPane>
            <TabPane tab="上传错误记录" key="2">
              <LogInfo />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
