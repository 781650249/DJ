/**
 * 文件上传
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Alert, Button, Upload, notification } from 'antd';

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
class UploadOrder extends Component {
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

  // 提交
  submit = async () => {
    const { file } = this.state;
    const { dispatch, onFetch } = this.props;
    this.setState({
      subming: true,
    });

    await dispatch({
      type: 'shipping/upload',
      payload: {
        files: file,
      },
      callback: res => {
        if (res.response.status === 200) {
          notification.success({
            message: res.data.message,
            description: (
              <div>
                <p>成功总数：{res.data.success_count}</p>
                <p style={{ color: 'red' }}>失败总数：{res.data.error_count}</p>
                <p>新增条数：{res.data.new_count}</p>
                <p>更新条数：{res.data.update_count}</p>
              </div>
            ),
          });
          this.setState({
            file: null,
          });
          // 成功提交，调用父组件 onFetch
          onFetch();
        } else {
          const { error } = res.data;
          this.setState({
            errorMessage: error,
          });
        }
      },
    });

    this.setState({
      subming: false,
    });
  };

  render() {
    const { file, errorMessage, subming, resMessage, resError } = this.state;

    return (
      <div style={{ margin: '0 5px', width: 'auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <p>
            <span style={{ color: 'red' }}>*</span>{' '}
            只支持解析一个工作表（sheet），上传前，请删除多余的工作表；
          </p>
          <p>
            <span style={{ color: 'red' }}>*</span>{' '}
            解析内容是根据第一行的标题来解析，不要删除或修改第一行内容；
          </p>
          <p style={{ display: 'inline-block' }}>
            <span style={{ color: 'red' }}>*</span> 请下载模板，根据模板提示填入数据；
          </p>
          <span>
            <a href="/storage/excel/import_shipping_excel_01.xlsx" style={{ color: 'red' }}>
              <Icon type="paper-clip" />
              下载模板
            </a>
          </span>
        </div>
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
        {errorMessage && <Alert type="error" message={errorMessage} />}
        {resMessage && <Alert type="error" message={resError} />}
        <Button
          disabled={!file}
          style={{ marginTop: 12 }}
          type="primary"
          loading={subming}
          onClick={this.submit}
        >
          提交
        </Button>
      </div>
    );
  }
}

export default UploadOrder;
