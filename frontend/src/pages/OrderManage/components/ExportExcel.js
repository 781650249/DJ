/**
 * 导出订单
 */
import React, { Component } from 'react';
import { Button, Modal, Alert, Icon } from 'antd';
import { connect } from 'dva';
import { downloadFile } from '@/utils/utils';

@connect(() => ({}))
class ExportExcel extends Component {
  state = {
    visible: false,
    downloading: false,
    exporting: false,
    error: null,
  };

  /**
   * 打开modal
   */
  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 关闭modal
   */
  closeModal = () => {
    this.setState({
      visible: false,
      error: null,
      downloading: false,
      exporting: false,
    });
  };

  handleExport = async () => {
    const { dispatch, type, filter = {}, ids = [] } = this.props;

    this.setState({
      exporting: true,
    });

    let dispatchType = 'order/exportFIlter';
    let params = { filter };

    if (type === 'select') {
      dispatchType = 'order/exportSelect';
      params = { ids };
    }
    await dispatch({
      type: dispatchType,
      payload: params,
      callback: async res => {
        const { response, data } = res;
        if (response && response.status === 200) {
          if (data && data.file_token) {
            this.setState({
              exporting: false,
              downloading: true,
            });
            await downloadFile(`/api/orders/download_excel/${data.file_token}`);
            this.setState({
              visible: false,
              exporting: false,
              downloading: false,
            });
          }
        } else {
          this.setState({
            error: data && data.error,
          });
        }
      },
    });

    this.setState({
      exporting: false,
      downloading: false,
    });
  };

  render() {
    const { children, title, button, style, type, total, ids = [], disabled = false } = this.props;
    const { visible, downloading, exporting, error } = this.state;

    return (
      <>
        <Button style={style} onClick={this.openModal} disabled={disabled} {...button}>
          {children}
        </Button>

        <Modal
          title={title}
          centered
          visible={visible}
          onCancel={this.closeModal}
          maskClosable={false}
          okButtonProps={{
            disabled: total > 500 || ids.length > 500,
            loading: downloading || exporting,
          }}
          okText="导出"
          onOk={this.handleExport}
        >
          {type === 'filter' && (
            <p>
              将会根据搜索结果导出订单；共有 <b>{total}</b> 条订单！
            </p>
          )}
          {type === 'select' && (
            <p>
              将会导出选中的订单；共选中 <b>{ids.length}</b> 条订单！
            </p>
          )}
          <small style={{ color: '#ff4d4f' }}>最大只能导出 500 条订单</small>
          {(exporting || downloading) && (
            <p>
              {exporting && <span>生成中～</span>}
              {downloading && <span>下载中...</span>}

              <Icon type="loading" />
            </p>
          )}
          {error && <Alert message={error} type="error" style={{ marginTop: 12 }} />}
        </Modal>
      </>
    );
  }
}

export default ExportExcel;
