/**
 * 文件上传示例
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Alert, Button, Upload, Card } from 'antd';

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
class FIleUploadExample extends Component {
  state = {
    file: null,
    errorMessage: null,
    subming: false,
  }

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
    })
  }

  submit = async () => {
    console.log('提交')
    const { file } = this.state
    const { dispatch } = this.props
    this.setState({
      subming: true,
    })

    await dispatch({
      type: 'example/upload',
      payload: {
        files: file,
      },
      callback: response => {
        console.log(response);
      },
    })

    this.setState({
      subming: false,
    })
  }

  render() {
    const { file, errorMessage, subming } = this.state

    return (
      <Card bordered>
        <div style={{ width: 300 }}>
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
          {
            errorMessage && (
              <Alert message={errorMessage}/>
            )
          }

          <Button disabled={!file} style={{ marginTop: 12 }} type="primary" loading={subming} onClick={this.submit}>
            提交
          </Button>
        </div>
      </Card>
    )
  }
}

export default FIleUploadExample
