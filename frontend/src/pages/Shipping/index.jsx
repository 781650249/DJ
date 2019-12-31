import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ShippingList from './ShippingList';
import ShippingLog from './ShippingLog';

const { TabPane } = Tabs;

@connect(() => ({}))
export default class Shipping extends Component {
  render() {
    return (
      <div>
        <PageHeaderWrapper>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="上传物流订单号" key="1">
                <ShippingList />
              </TabPane>
              <TabPane tab="上传日志信息" key="2">
                <ShippingLog />
              </TabPane>
            </Tabs>
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}
