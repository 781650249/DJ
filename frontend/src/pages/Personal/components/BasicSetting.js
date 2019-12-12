import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/fetchCurrent'],
}))
export default class BasicSetting extends Component {
  constructor(props) {
    console.log(props);
    super(props);
  }

  render() {
    const {
      user: { currentUser },
    } = this.props;
    return (
      <div>
        <div style={{ border: '1px dashed', width: 260, padding: '10px' }}>
          <h3>用户名：{currentUser.name}</h3>
          <h3>邮箱: {currentUser.email}</h3>
        </div>
      </div>
    );
  }
}
