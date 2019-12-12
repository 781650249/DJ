import React from 'react';
import BasicSetting from './components/BasicSetting';

import UpdateModal from './components/UpdateModal';
import { Card } from 'antd';

export default function index() {
  return (
    <Card>
      <BasicSetting />
      <UpdateModal />
    </Card>
  );
}
