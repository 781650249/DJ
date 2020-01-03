import React, { PureComponent } from 'react';
import { Button } from 'antd';

export default class Export extends PureComponent {
  render() {
    return (
      <div>
        <Button type="primary">导出订单</Button>
      </div>
    );
  }
}
