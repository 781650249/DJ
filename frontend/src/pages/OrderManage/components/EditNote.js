import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, Alert, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const FormItme = Form.Item;

@Form.create()
@connect(() => ({}))
class EditNote extends Component {
  state = {
    visible: false,
    submiting: false,
    error: null,
  };

  handleOpenModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  submit = e => {
    e.preventDefault();

    const {
      form,
      form: { validateFields },
      dispatch,
      onSuccess,
      data: { id },
    } = this.props;

    validateFields(async (error, values) => {
      if (error) return;

      this.setState({
        submiting: true,
      });

      await dispatch({
        type: 'order/updateNote',
        payload: {
          ...values,
        },
        id,
        callback: res => {
          const { response, data } = res;

          if (response && response.status === 200) {
            notification.success({
              message: data && data.message,
            });

            form.resetFields();
            if (onSuccess) onSuccess();
            this.setState({
              submiting: false,
              visible: false,
            });
          } else {
            this.setState({
              error: data && data.error,
              submiting: false,
            });
          }
        },
      });
    });
  };

  render() {
    const {
      children,
      button,
      form: { getFieldDecorator },
      data,
    } = this.props;
    const { visible, error, submiting } = this.state;

    return (
      <>
        <Button onClick={this.handleOpenModal} {...button}>
          {children}
        </Button>

        <Modal
          visible={visible}
          centered
          title="备注编辑"
          okText="保存"
          onCancel={this.handleCancel}
          maskClosable={false}
          keyboard={false}
          okButtonProps={{
            loading: submiting,
          }}
          onOk={this.submit}
        >
          <Form onSubmit={this.submit}>
            <FormItme>
              {getFieldDecorator('note', {
                initialValue: data.note,
              })(<TextArea rows={2} placeholder="备注（最多140个字符）" />)}
            </FormItme>
          </Form>

          {error && <Alert style={{ marginTop: 12 }} message={error} type="error" />}
        </Modal>
      </>
    );
  }
}

export default EditNote;
