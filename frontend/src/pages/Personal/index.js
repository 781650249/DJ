import React from 'react';
import BasicSetting from './components/BasicSetting';
import UpdatePwd from './components/UpdatePwd';

export default function index() {
  return (
    <div style={{ marginLeft: '50px' }}>
      <BasicSetting />
      <UpdatePwd />
    </div>
  );
}
