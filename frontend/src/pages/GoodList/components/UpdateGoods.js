import { Button, Modal, Form, Input, Select, notification, InputNumber, Alert } from 'antd';
import { connect } from 'dva';
import React from 'react';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line react/prefer-stateless-function
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, data = {}, loading, errorMessage } = this.props;
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
          title="修改商品信息"
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
          confirmLoading={loading}
        >
          <div style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.349019607843137)', padding: 12 }}>
            {errorMessage && <Alert type="error" message={errorMessage} />}
            <div style={{ padding: 35 }}>
              <Form {...formItemLayout} layout="vertical">
                <Form.Item label="标题">
                  {getFieldDecorator('title', {
                    initialValue: data.title,
                    rules: [
                      { required: true, message: '标题不能为空' },
                      { max: 64, message: '标题最大长度不能超过64' },
                    ],
                  })(<Input type="textarea" placeholder="请输入标题" />)}
                </Form.Item>

                <Form.Item label="英文标题">
                  {getFieldDecorator('title_en', {
                    initialValue: data.title_en,
                    rules: [{ max: 64, message: '最大不能超过64位' }],
                  })(<Input placeholder="请输入英文标题" />)}
                </Form.Item>

                <Form.Item label="sku">
                  {getFieldDecorator('sku', {
                    initialValue: data.sku,
                    rules: [
                      { required: true, message: 'sku不能为空' },
                      { max: 64, message: '标题最大长度不能超过64' },
                    ],
                  })(<Input placeholder="请输入sku名称" type="textarea" />)}
                </Form.Item>

                <Form.Item label="重量（g）">
                  {getFieldDecorator('weight', {
                    initialValue: data.quantity,
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
                    initialValue: data.quantity,
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
                    initialValue: data.purchase_price,
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
                  {getFieldDecorator('double_side', {
                    initialValue: change(data.double_side),
                  })(
                    <Select placeholder="单" type="textarea">
                      <Select.Option value="0">单</Select.Option>
                      <Select.Option value="1">双</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label="备注">
                  {getFieldDecorator('note', {
                    initialValue: data.note,
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

function change(data) {
  return data === 0 ? '单' : '双';
}

@connect(({ Goods, loading }) => ({
  Goods,
  submitting: loading.effects['Goods/updateGoods'],
}))
export default class UpdateGoods extends React.Component {
  state = {
    visible: false,
    loading: false,
    errorMessage: null,
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
      const { double_side: doubleSide } = values;
      dispatch({
        type: 'Goods/updateGoods',
        payload: {
          id: this.props.id,
          ...values,
          double_side: doubleSide === '单' ? '0' : '1',
        },
        callback: response => {
          this.setState({
            loading: true,
          });
          if (response.response.status === 200) {
            notification.success({
              message: '修改成功',
            });
            // 刷新
            dispatch({
              type: 'Goods/fetchGoods',
              payload: {
                page: 1,
                page_size: '',
              },
            });

            form.resetFields();
            this.setState({ visible: false });
          } else {
            this.setState({
              errorMessage: '修改失败，该sku已存在',
            });
          }

          this.setState({
            loading: false,
          });
        },
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { data } = this.props;
    const { loading, errorMessage } = this.state;
    return (
      <div>
        <Button title="编辑" type="link" onClick={this.showModal}>
          编辑
        </Button>
        <CollectionCreateForm
          errorMessage={errorMessage}
          data={data}
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
