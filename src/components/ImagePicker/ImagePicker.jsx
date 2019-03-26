/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Upload, Modal, Icon, Button, Spin, message } from 'antd';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

class ImagePicker extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    closeable: PropTypes.bool,
    getToken: PropTypes.func,
    getUrl: PropTypes.func,
    data: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    type: PropTypes.string,
    onPreview: PropTypes.func,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    headers: PropTypes.object,
    fullValue: PropTypes.bool,
    fieldNames: PropTypes.object,
    showName: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    closeable: true,
    getToken: undefined,
    getUrl: undefined,
    data: {},
    width: 100,
    height: 100,
    type: '',
    onPreview: undefined,
    text: '',
    headers: undefined,
    fullValue: false,
    fieldNames: {
      url: 'url',
      name: 'name',
    },
    showName: false,
  }

  constructor(props) {
    super(props);
    const value = props.value;
    this.state = {
      value,
      coverfix: '',
      name: '',
    };
  }

  componentDidMount() {
    const el = findDOMNode(this).querySelector('.ant-upload');
    el.style.width = `${this.props.width}px`;
    el.style.height = `${this.props.height}px`;
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || undefined;
      this.setState(Object.assign({}, this.state, {
        value,
      }));
    }
  }

  onClose(e) {
    e.stopPropagation();
    this.props.onClose(this.props.sequence);
  }

  onPreview(e) {
    e.stopPropagation();
    let value = this.state.value;
    if (this.props.fullValue) {
      value = (value || [])[this.props.fieldNames.url];
    }
    if (!this.isImg) {
      const a = document.createElement('a');
      a.href = value;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (this.props.onPreview) {
      this.props.onPreview(value, this.downloadName);
    } else {
      this.setState(Object.assign({}, this.state, {
        previewVisible: true,
      }));
    }
  }

  onPicCancel() {
    this.setState(Object.assign({}, this.state, {
      previewVisible: false,
    }));
  }

  onImgLoad(e) {
    const img = e.target;
    let coverfix = '';
    const ratio = img.naturalWidth ? img.naturalHeight / img.naturalWidth : img.height / img.width;
    const parent = img.parentNode;
    const parentRatio = parent.clientHeight / parent.clientWidth;
    if (parentRatio < ratio) {
      coverfix = 'img-coverfix';
    } else {
      coverfix = '';
    }
    this.isImg = true;
    this.setState(Object.assign({}, this.state, {
      coverfix,
    }));
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState(Object.assign({}, this.state, {
        loading: true,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        loading: false,
      }));
    }
    if (info.file.status === 'done') {
      const value = this.props.getUrl(info.file.response);
      this.isImg = false;
      if (!value) {
        message.error(info.file.response.resultDesc);
        return;
      }
      if (this.props.fullValue) {
        this.setState(Object.assign({}, this.state, {
          value: {
            [this.props.fieldNames.url]: value,
            [this.props.fieldNames.name]: this.downloadName,
          },
        }));
        this.props.onChange({
          key: this.props.sequence,
          value: {
            [this.props.fieldNames.url]: value,
            [this.props.fieldNames.name]: this.downloadName,
          },
        }, {
          url: value,
          name: this.downloadName,
        });
      } else {
        this.setState(Object.assign({}, this.state, {
          value,
        }));
        this.props.onChange({
          key: this.props.sequence,
          value,
        }, {
          url: value,
          name: this.downloadName,
        });
      }
    } else if (info.file.status === 'error') {
      message.error(<span>上传异常<br />请检查文件限制大小、格式或联系管理员</span>);
    }
  };

  render() {
    const { previewVisible, loading = false } = this.state;
    const {
      disabled,
      action,
      width,
      height,
      getToken,
      data,
      type,
      text,
      headers,
      showName,
      fullValue,
      fieldNames,
      extra = '',
    } = this.props;

    let value = this.state.value;
    let name;
    if (fullValue) {
      name = (value || [])[fieldNames.name];
      value = (value || [])[fieldNames.url];
    }

    let imgWrapperStyle = {};

    if (width || height) {
      imgWrapperStyle = { width, height };
    }

    let waterMark = '';
    if (!value && disabled) {
      waterMark = 'img-watermark';
    }

    function beforeUpload(file) {
      this.downloadName = file.name;
      if (type === 'file') {
        return true;
      }
      const isImg = /image.*/.test(file.type);
      if (!isImg) {
        message.error('只能上传图片');
      }
      return isImg;
    }

    return (
      <div className={`flex flex-v ${value ? 'upload-has-value' : ''}`}>
        <Upload
          className="avatar-uploader"
          action={action}
          beforeUpload={beforeUpload.bind(this)}
          headers={headers || {
            Authorization: `${getToken()}`,
          }}
          onChange={this.handleChange}
          showUploadList={false}
          disabled={disabled}
          data={data}
        >
          {
            <Spin spinning={loading}>
              <div
                style={imgWrapperStyle}
                className={`img-wrapper flex flex-c flex-v
                ${value ? 'img-has-value' : ''} ${waterMark} ${this.state.coverfix}`}
              >
                {
                  value &&
                  <img
                    src={value}
                    style={{ visibility: this.isImg ? 'visible' : 'hidden' }}
                    alt=""
                    onLoad={this.onImgLoad.bind(this)}
                  />
                }
                {
                  value && !this.isImg &&
                  <Icon type="file-text" style={{ fontSize: width * 0.6 }} />
                }
                {
                  fullValue && showName && <div className="img-name" title={name}>{name}</div>
                }
                {
                  !value &&
                  !disabled &&
                  <React.Fragment>
                    <Icon
                      type="plus"
                      style={{ fontSize: !text ? width : width * 0.6, height: !text ? 'inherit' : 'auto' }}
                    />
                    <span>{text}</span>
                  </React.Fragment>
                }
              </div>
            </Spin>
          }
          {
            value &&
            <Button shape="circle" icon="eye-o" className="ant-upload-preview" onClick={this.onPreview.bind(this)} />
          }
          {
            !disabled && this.props.closeable &&
            <Button shape="circle" icon="close" className="ant-upload-close" onClick={this.onClose.bind(this)} />
          }
        </Upload>
        {extra && <div className="img-extra">{extra}</div>}
        <Modal visible={previewVisible} footer={null} onCancel={this.onPicCancel.bind(this)}>
          <img alt="" style={{ width: '100%' }} src={value} />
        </Modal>
      </div>
    );
  }
}

export default ImagePicker;
