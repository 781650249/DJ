import { Modal, Button, Upload, Alert, Icon, notification } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const { Dragger } = Upload;
// 允许文件类型
const acceptFileType = [
  'application/vnd.ms-excel',
  'application/wps-office.xls',
  'application/wps-office.xlsx',
  'application/vnd.openxmlformats-office',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const acceptFileSize = 10; // 可接受文件大小

@connect(() => ({}))
class Import extends Component {
  state = {
    visible: false,
    confirmLoading: false,
    file: null,
    errorMessage: null,
  };

  handleBeforeUpload = file => {
    const fileType = file.type;
    const fileSize = file.size / 1024 / 1024;

    if (acceptFileType.indexOf(fileType) < 0) {
      this.setState({
        errorMessage: '文件格式暂时不支持，请核对后再试。',
        file: null,
      });

      return false;
    }

    if (fileSize > acceptFileSize) {
      this.setState({
        errorMessage: `文件过大，文件大小不能超过${acceptFileSize}M`,
        file: null,
      });

      return false;
    }

    this.setState({
      file,
      errorMessage: null,
    });

    return false;
  };

  handleRemove = () => {
    this.setState({
      file: null,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
      confirmLoading: false,
    });
  };

  /**
   * 取消上传
   */
  handleCancel = () => {
    this.setState({
      visible: false,
      file: null,
      errorMessage: null,
    });
  };

  submit = async () => {
    const { file } = this.state;
    const { dispatch, onSuccess } = this.props;
    this.setState({
      confirmLoading: true,
    });

    await dispatch({
      type: 'order/import',
      payload: {
        files: file,
      },
      callback: (data, response) => {
        if (response.status === 200) {
          notification.success({
            message: `${data.message}`,
            description: (
              <>
                <p>
                  成功: {data.success_count}条 失败: {data.error_count}条
                </p>
                <p>
                  新增: {data.new_count}条 更新: {data.update_count}条
                </p>
              </>
            ),
          });

          this.setState({
            confirmLoading: false,
            file: null,
            visible: false,
            errorMessage: null,
          });

          if (onSuccess) onSuccess();
        } else {
          const { error } = data;
          this.setState({
            errorMessage: error,
            file: null,
            confirmLoading: false,
          });
        }
      },
    });
  };

  render() {
    const { visible, confirmLoading, file, errorMessage } = this.state;

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          导入订单
        </Button>
        <Modal
          maskClosable={false}
          title="导入订单"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          onOk={this.submit}
          centered
          okText="导入"
          cancelText="取消"
        >
          <b>1、导入说明</b>
          <p>
            <span style={{ color: 'red' }}>*</span>{' '}
            只支持解析一个工作表（sheet），上传前，请删除多余的工作表；
          </p>
          <p>
            <span style={{ color: 'red' }}>*</span>{' '}
            解析内容是根据第一行的标题来解析，不要删除或修改第一行内容；
          </p>
          <p>
            <span style={{ color: 'red' }}>*</span> 请下载模板，根据模板提示填入数据；
            <span>
              <a href="/storage/excel/import_order_01.xlsx" style={{ color: 'red' }}>
                <Icon type="paper-clip" />
                下载模板
              </a>
            </span>
          </p>
          <b style={{ display: 'inline-block', marginTop: 10 }}>2、上传文件</b>
          <Dragger
            style={{ marginTop: 12 }}
            beforeUpload={this.handleBeforeUpload}
            onRemove={this.handleRemove}
            fileList={file ? [file] : []}
          >
            <p style={{ fontSize: 32 }}>
              <Icon type="file-excel" theme="twoTone" />
            </p>
            <p className="ant-upload-text">点击选择或拖拽文件到线框中上传</p>
            <small className="ant-upload-hint">仅支持小于10M的XLSX、XLS格式的excel文件</small>
          </Dragger>
          {errorMessage && <Alert style={{ marginTop: 12 }} type="error" message={errorMessage} />}
        </Modal>
      </div>
    );
  }
}
export default Import;
