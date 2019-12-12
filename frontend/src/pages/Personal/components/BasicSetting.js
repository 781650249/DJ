import React, { Component } from 'react';
import { getInfo } from '@/services/user';

export default class BasicSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'name',
      email: 'email',
    };
  }

  async componentDidMount() {
    const resp = await getInfo();
    this.setState({
      name: resp.data.name,
      email: resp.data.email,
    });
  }

  render() {
    return (
      <div>
        <div style={{ border: '1px dashed', width: 260, padding: '10px' }}>
          <h3>用户名：{this.state.name}</h3>
          <h3>邮箱: {this.state.email}</h3>
        </div>
      </div>
    );
  }
}
