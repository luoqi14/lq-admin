/* eslint-disable react/no-string-refs,jsx-a11y/no-noninteractive-element-interactions,react/no-find-dom-node */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import { findDOMNode } from 'react-dom';

import './style.scss';

class ImagePreview extends Component {
  static propTypes = {
    images: PropTypes.array,
    visible: PropTypes.bool,
    index: PropTypes.number,
    downloadName: PropTypes.string,
    fieldNames: PropTypes.object,
  };

  static defaultProps = {
    images: [],
    visible: false,
    index: 0,
    downloadName: '',
    fieldNames: {
      url: 'url',
      name: 'name',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isFull: false,
      index: props.index,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.startBind();
    }
    this.setState({
      index: nextProps.index,
    });
  }

  onPicCancel() {
    this.props.hide && this.props.hide();
  }

  moveStart(target, x, y) {
    this.down = true;
    this.x = x;
    this.y = y;
    this.top = window.parseInt(target.style.top || 0);
    this.left = window.parseInt(target.style.left || 0);
  }

  move(target, x, y) {
    const newTarget = target;
    if (this.down) {
      const offsetX = x - this.x;
      const offsetY = y - this.y;
      newTarget.style.top = `${this.top + offsetY}px`;
      newTarget.style.left = `${this.left + offsetX}px`;
    }
  }

  startBind() {
    if (this.isBind) {
      return;
    }
    setTimeout(() => {
      const el = findDOMNode(this);
      if (el) {
        const target = el.querySelector('.ant-modal');
        el.querySelector('.ant-modal-wrap').style.overflow = 'hidden';
        this.isBind = true;
        target.addEventListener('mousedown', (e) => {
          this.moveStart(target, e.x, e.y);
        }, false);
        target.addEventListener('touchstart', (e) => {
          const touches = e.touches;
          let touch;
          if (touches.length === 1 || touches.length === 2) {
            touch = touches[0];
            this.moveStart(target, touch.pageX, touch.pageY);
          }
          if (touches.length === 2) {
            this.ratio =
              Math.sqrt(((touches[1].pageY - touches[0].pageY) ** 2) + ((touches[1].pageX - touches[0].pageX) ** 2)) /
              target.clientWidth;
          }
        }, false);
        target.addEventListener('mouseup', () => {
          this.down = false;
        }, false);
        target.addEventListener('touchend', (e) => {
          this.down = false;
          const touches = e.touches;
          if (touches.length !== 2) {
            this.ratio = undefined;
          }
        }, false);
        el.addEventListener('mousemove', (e) => {
          this.move(target, e.x, e.y);
        }, false);
        el.addEventListener('touchmove', (e) => {
          e.preventDefault();
          const touches = e.touches;
          let touch;
          if (touches.length === 1 || touches.length === 2) {
            touch = touches[0];
            this.move(target, touch.pageX, touch.pageY);
          }
          if (touches.length === 2) {
            const width =
              Math.sqrt(((touches[1].pageY - touches[0].pageY) ** 2) + ((touches[1].pageX - touches[0].pageX) ** 2)) /
              this.ratio;
            target.style.setProperty('width', `${width}px`, 'important');
          }
        }, false);
        el.addEventListener('dragstart', (e) => {
          if (e.target.tagName.toLowerCase() === 'img') {
            e.preventDefault();
          }
        }, false);
        target.addEventListener('mousewheel', (e) => {
          if (!this.state.isFull) {
            if (e.wheelDelta > 0) {
              this.zoomIn();
            } else {
              this.zoomOut();
            }
          }
        }, false);
      } else {
        this.startBind();
      }
    }, 100);
  }

  zoomIn() {
    const el = findDOMNode(this);
    const target = el.querySelector('.ant-modal');
    target.style.setProperty('width', `${target.clientWidth + 50}px`, 'important');
  }

  zoomOut() {
    const el = findDOMNode(this);
    const target = el.querySelector('.ant-modal');
    target.style.setProperty('width', `${target.clientWidth - 50}px`, 'important');
  }

  fullPage() {
    const el = findDOMNode(this);
    const target = el.querySelector('.ant-modal');
    target.style.setProperty('width', '100vw', 'important');
    target.style.top = '0px';
    this.setState({
      isFull: true,
    });
  }

  reset() {
    const el = findDOMNode(this);
    const target = el.querySelector('.ant-modal');
    target.style.width = '520px';
    target.style.top = '100px';
    this.setState({
      isFull: false,
    });
  }

  prev() {
    if (this.state.index > 0) {
      this.setState({
        index: this.state.index - 1,
      });
    }
  }

  next() {
    if (this.props.images.length - 1 > this.state.index) {
      this.setState({
        index: this.state.index + 1,
      });
    }
  }

  render() {
    const {
      visible,
      images,
      fieldNames,
    } = this.props;

    let {
      downloadName,
    } = this.props;

    const {
      index,
    } = this.state;

    let url = images[index];
    if (typeof url === 'object') {
      downloadName = url[fieldNames.name];
      url = url[fieldNames.url];
    }

    return (
      <Modal
        visible={visible}
        className={`img-preview ${this.state.isFull ? 'img-fullscreen' : ''}`}
        style={{
          top: 100,
        }}
        footer={this.state.isFull ?
          <div className="img-preview-footer flex">
            <div
              tabIndex={-1}
              role="button"
              onClick={this.reset.bind(this)}
              className="img-preview-tool"
            ><Icon type="shrink" /> 还原
            </div>
            <div
              tabIndex={-1}
              role="button"
              onClick={this.onPicCancel.bind(this)}
              className="img-preview-tool"
            ><Icon type="close" /> 关闭
            </div>
          </div> :
          <div className="img-preview-footer flex">
            <div
              tabIndex={-1}
              role="button"
              onClick={this.fullPage.bind(this)}
              className="img-preview-tool"
            ><Icon type="arrows-alt" /> 全屏
            </div>
            <div
              tabIndex={-1}
              role="button"
              className="img-preview-tool"
              onClick={this.zoomIn.bind(this)}
            ><Icon type="plus-circle-o" /> 放大
            </div>
            <div
              tabIndex={-1}
              role="button"
              onClick={this.zoomOut.bind(this)}
              className="img-preview-tool"
            >
              <Icon type="minus-circle-o" /> 缩小
            </div>
            <div className="img-preview-tool">
              <a href={url} download={downloadName} target="_blank" rel="noopener noreferrer">
                <Icon type="download" /> 下载
              </a>
            </div>
          </div>
        }
        onCancel={this.onPicCancel.bind(this)}
      >
        <img alt="" style={{ width: '100%' }} src={url} />
        {
          index > 0 && (
            <div
              tabIndex={-1}
              role="button"
              className="img-preview-left"
              onClick={this.prev.bind(this)}
            >
              <Icon type="left-circle" />
            </div>
          )
        }
        {
          images.length - 1 > index && (
            <div
              tabIndex={-1}
              role="button"
              className="img-preview-right"
              onClick={this.next.bind(this)}
            >
              <Icon type="right-circle" />
            </div>
          )
        }
      </Modal>
    );
  }
}

export default ImagePreview;
