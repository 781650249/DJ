import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/fetchCurrent'],
}))
export default class BasicSetting extends Component {
  render() {
    const {
      user: { currentUser },
    } = this.props;
    return (
      <div>
        <div style={{ width: 260, padding: '10px' }}>
          <h1>
            <Icon type="user" />: {currentUser.name}
          </h1>
          <h1>
            <Icon type="mail" />: {currentUser.email}
          </h1>
        </div>
      </div>
    );
  }
}
