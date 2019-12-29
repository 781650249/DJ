import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, DatePicker, Button } from 'antd';
import moment from 'moment';
import styles from './searchForm.less';
import { formatCriteria } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ loading }) => ({
  loading: loading.effects['orderOperateLog/fetch'],
}))
class SearchPane extends Component {
  state = {};

  submit = e => {
    if (e.preventDefault) e.preventDefault();

    const {
      form: { validateFields },
    } = this.props;

    validateFields(async (error, value) => {
      if (error) return;

      const filter = formatCriteria(value);

      const { onSearch } = this.props;

      if (onSearch) {
        onSearch({
          page: 1,
          filter,
        });
      }
    });
  };

  clear = () => {
    const { form, onSearch } = this.props;

    form.resetFields();

    if (onSearch) {
      onSearch({
        page: 1,
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <div>
        <Form layout="inline" onSubmit={this.submit} className={styles.form}>
          <Row gutter={16}>
            <Col xs={12} md={8} lg={6}>
              <FormItem label="订单编号">
                {getFieldDecorator('oid')(
                  <Input style={{ width: '100%' }} placeholder="订单编号" allowClear />,
                )}
              </FormItem>
            </Col>

            <Col xs={12} md={8} lg={6}>
              <FormItem label="人员姓名">
                {getFieldDecorator('user_name')(
                  <Input style={{ width: '100%' }} placeholder="人员姓名" allowClear />,
                )}
              </FormItem>
            </Col>
            <Col xs={12} md={8} lg={6}>
              <FormItem label="操作时间">
                {getFieldDecorator('created_at')(
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime
                    ranges={{
                      今天: [moment().startOf('day'), moment().endOf('day')],
                      '7天内': [moment().subtract(7, 'days'), moment()],
                      '1个月内': [moment().subtract(30, 'days'), moment()],
                    }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col
              md={24}
              lg={6}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 40,
                justifyContent: 'flex-end',
              }}
            >
              <Button htmlType="summit" type="primary" loading={loading}>
                搜索
              </Button>
              <Button onClick={this.clear} style={{ marginLeft: 8 }} disabled={loading}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default SearchPane;
