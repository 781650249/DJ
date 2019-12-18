import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Alert, Button, Upload, Card, notification } from 'antd';

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

@connect(({ Goods, loading }) => ({
  Goods,
  submitting: loading.effects['Goods/import'],
}))
class LoadGoods extends Component {
  state = {
    file: null,
    errorMessage: null,
    subming: false,
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
      subming: false,
    });

    return false;
  };

  handleRemove = () => {
    this.setState({
      file: null,
    });
  };

  submit = async () => {
    const { file } = this.state;
    const { dispatch, onCancel } = this.props;
    this.setState({
      subming: true,
    });

    await dispatch({
      type: 'Goods/import',
      payload: {
        files: file,
      },
      callback: () => {
        notification.success({
          message: '导入成功',
        });
        onCancel();
      },
    });

    this.setState({
      subming: false,
      file: null,
    });
  };

  render() {
    const { file, errorMessage, subming } = this.state;
    return (
      <Card bordered>
        <div style={{ width: '100%' }}>
          <Dragger
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
          <br />
          {errorMessage && <Alert type="error" message={errorMessage} />}

          <Button
            disabled={!file}
            style={{ marginTop: 12 }}
            type="primary"
            size="default"
            loading={subming}
            onClick={this.submit}
          >
            上传
          </Button>
        </div>
      </Card>
    );
  }
}

export default LoadGoods;
