import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Dropdown, Menu } from 'antd';
import ButtonModel from './components/ButtomModel';

const MenuItem = Menu.Item;

@connect(() => ({}))
class DropDownExample extends Component {
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
  ];

  dropMenu = (
    <Dropdown
      overlay={
        <Menu>
          {this.orderStatus.map(item => (
            <MenuItem key={item.key}>
              <ButtonModel key={item.key} color={item.color}>
                {item.value}
              </ButtonModel>
            </MenuItem>
          ))}
        </Menu>
      }
    >
      <a>Click</a>
    </Dropdown>
  );

  render() {
    return (
      <div>
        <Alert message={this.dropMenu}></Alert>
      </div>
    );
  }
}

export default DropDownExample;
