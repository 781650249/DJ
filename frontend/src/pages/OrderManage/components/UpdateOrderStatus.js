import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Dropdown, Menu } from 'antd';
import ButtonModel from './ButtomModel';

const MenuItem = Menu.Item;

@connect(() => ({}))
class UpdateOrderStatus extends Component {
  state = {};

  orderStatus = [
    {
      key: 'processing',
      value: '处理中',
      color: '#66ff66',
    },
    {
      key: 'processed',
      value: '已处理',
      color: '#0E77D1',
    },
    {
      key: 'published',
      value: '已发稿',
      color: '#660099',
    },
    {
      key: 'confirmed',
      value: '已确认',
      color: '#8E236B',
    },
    {
      key: 'produced',
      value: '已生产',
      color: '#6B8E23 ',
    },
    {
      key: 'frozen',
      value: '已冻结',
      color: '#70DBDB ',
    },
    {
      key: 'wait_change',
      value: '待修改',
      color: '#EAADEA ',
    },
  ];

  render() {
    console.log(this.props);
    const { id } = this.props;
    return (
      <div>
        <Alert
          message={
            <Dropdown
              overlay={
                <Menu>
                  {this.orderStatus.map(item => (
                    <MenuItem key={item.key}>
                      <ButtonModel id={id} status={item.key} key={item.key} color={item.color}>
                        {item.value}
                      </ButtonModel>
                    </MenuItem>
                  ))}
                </Menu>
              }
            >
              <a>修改订单状态</a>
            </Dropdown>
          }
        ></Alert>
      </div>
    );
  }
}

export default UpdateOrderStatus;
