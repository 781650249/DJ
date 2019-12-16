import { Button, Modal, Form, Input, Select, notification, InputNumber } from 'antd';
import { connect } from 'dva';
import React from 'react';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line react/prefer-stateless-function
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, loading } = this.props;
      const { getFieldDecorator } = form;
      const { TextArea } = Input;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      };

      return (
        <Modal
          visible={visible}
          title="添加商品信息"
          okText="添加"
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={loading}
        >
          <div style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.349019607843137) ' }}>
            <div style={{ padding: 35 }}>
              <Form {...formItemLayout} layout="vertical">
                <Form.Item label="标题">
                  {getFieldDecorator('title', {
                    rules: [
                      { required: true, message: '标题不能为空' },
                      { max: 64, message: '标题最大长度不能超过64' },
                    ],
                  })(<Input type="textarea" placeholder="请输入标题" />)}
                </Form.Item>

                <Form.Item label="英文标题">
                  {getFieldDecorator('title_en', {
                    rules: [{ max: 64, message: '最大不能超过64位' }],
                  })(<Input placeholder="请输入英文标题" />)}
                </Form.Item>

                <Form.Item label="sku">
                  {getFieldDecorator('sku', {
                    rules: [
                      { required: true, message: 'sku不能为空' },
                      { max: 64, message: '标题最大长度不能超过64' },
                    ],
                  })(<Input placeholder="请输入sku名称" type="textarea" />)}
                </Form.Item>

                <Form.Item label="重量（g）">
                  {getFieldDecorator('weight', {
                    rules: [
                      { type: 'number', message: '请填写正确的数字，如：99' },
                      { required: true, message: '必填' },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      max={99999999}
                      step={1}
                      placeholder="0"
                    />,
                  )}
                </Form.Item>

                <Form.Item label="数量">
                  {getFieldDecorator('quantity', {
                    rules: [
                      { type: 'number', message: '请填写正确的数字，如：99' },
                      { required: true, message: '必填' },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      max={99999999}
                      step={1}
                      placeholder="0"
                    />,
                  )}
                </Form.Item>

                <Form.Item label="采购价格">
                  {getFieldDecorator('purchase_price', {
                    rules: [
                      { type: 'number', message: '请填写正确的数字，如：99' },
                      { required: true, message: '必填' },
                    ],
                  })(
                    <InputNumber
                      min={0.01}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      max={99999999}
                      step={1}
                      placeholder="0"
                    />,
                  )}
                </Form.Item>

                <Form.Item label="单双面">
                  {getFieldDecorator('double_side', {})(
                    <Select placeholder="单" type="textarea">
                      <Select.Option value="0">单</Select.Option>
                      <Select.Option value="1">双</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label="备注">
                  {getFieldDecorator('note', {
                    rules: [{ max: 64, message: '标题最大长度不能超过140' }],
                  })(
                    <TextArea
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      maxLength="140"
                      type="textarea"
                      placeholder="备注"
                    />,
                  )}
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      );
    }
  },
);

@connect(({ Goods, loading }) => ({
  Goods,
  submitting: loading.effects['Goods/addGoods'],
}))
export default class AddGoods extends React.Component {
  state = {
    visible: false,
    loading: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    const { dispatch } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        loading: true,
      });
      dispatch({
        type: 'Goods/addGoods',
        payload: {
          ...values,
        },
        callback: response => {
          if (response.response.status === 200) {
            notification.success({
              message: '添加成功',
            });
            this.setState({
              loading: false,
            });

            dispatch({
              type: 'Goods/fetchGoods',
              payload: {
                page: 1,
                page_size: '',
              },
            });
          }
          form.resetFields();
          this.setState({ visible: false });
        },
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { submitting } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <Button loading={submitting} type="primary" onClick={this.showModal}>
          +添加商品
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCreate={this.handleCreate}
          onCancel={this.handleCancel}
          loading={loading}
        />
      </div>
    );
  }
}
