/* eslint-disable react/no-string-refs,jsx-a11y/no-noninteractive-element-interactions,max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import './style.scss';

class Img extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    src: PropTypes.string,
    adjust: PropTypes.bool,
    style: PropTypes.object,
  };

  static defaultProps = {
    width: 64,
    height: 64,
    src: '',
    adjust: false,
    style: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      imgWidth: 'auto',
      imgHeight: 'auto',
      previewVisible: false,
      loaded: false,
    };
  }

  // componentDidMount() {
  //   this.renderSrc();
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.src !== nextProps.src) {
  //     this.renderSrc();
  //   }
  // }

  onImgLoad(e) {
    const img = e.target;
    const imgContainer = e.target.parentNode;
    imgContainer.style.opacity = 0;
    let imgWidth;
    let imgHeight;
    if (img.naturalHeight > img.naturalWidth || img.height > img.width) {
      imgWidth = this.props.width;
      imgHeight = 'auto';
    } else {
      imgWidth = 'auto';
      imgHeight = this.props.height;
    }
    this.setState(
      Object.assign({}, this.state, {
        imgWidth,
        imgHeight,
        loaded: true,
        naturalHeight: img.naturalHeight || img.height,
        naturalWidth: img.naturalWidth || img.width,
      })
    );
    imgContainer.style.opacity = 1;
    img.style.opacity = 1;
    img.style.background = '#fff';
  }

  onPreview() {
    if (this.props.onPreview) {
      this.props.onPreview();
    } else {
      this.setState(
        Object.assign({}, this.state, {
          previewVisible: true,
        })
      );
    }
  }

  onPicCancel() {
    this.setState(
      Object.assign({}, this.state, {
        previewVisible: false,
      })
    );
  }

  // renderSrc = () => {
  //   const img = this.refs.img;
  //   const y = img.getBoundingClientRect().bottom;
  //   if (y <= screen.height && y >= 0) {
  //     img.src = img.getAttribute('data-src');
  //   }
  // };

  render() {
    const { adjust, style } = this.props;

    let { width, height } = this.props;

    const {
      previewVisible,
      imgWidth,
      imgHeight,
      naturalHeight,
      naturalWidth,
    } = this.state;

    const emptyImg =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIBAMAAABfdrOtAAAAJFBMVEXo6uvo6uvp6urp6uv////4+fn29vb09PXv8PD6+/vs7e7x8vLKLZQ8AAAAA3RSTlPWv6Gx/qxVAAAB4klEQVR42u3cT07CQBTHcRJPoDfwBiaI/eOSV6FlKZ6gbHTbJrqnC/ftDQqJ+3JAmQabV03LxL5nhPy+G0i6+ABlpkwnYXR9qd7V6GKs3g0QIF8BAQIECBAgQHhAgAABAgQIEB4QIECAAAEChAfk14jzZFUyCCnIqnAIck+WVQMQxxZJBiB3tkh8Akj4erRiMBKMj7YEAgTI2SEfb/rIdv+0VEZ82hcpI55BAmVkR6a1LrKskUQXKWokVn8n+khaI5UusqkRdihWQBxjLNiRucaIX7W/XFmogbjP4Qs7QlSpz8ITolwdSYkWegibLrURzyCJMrIyyFQXcck000Vuqa5URZZUF2shfCUZySN+M/o2BySQR7zgx7q7FEdSSr4viXNpxG/OQdYgc2nEa+47UFOocT2JDxNwUyWLuM3Hs2NIrnGNL825Yc00fhI9mnPDE0Wc5pWnxEukED7I1y61iqQQPshzr408SCF8kAcralfKIRl1FcshRScSCSHmobNADMmou1II8amnXAiZ9CFzISTtQ0IZxKfeKhHE60emJ3cDB4gNEr4frTiNDYEzQfR2gni2SDkE2doZi/G/38wEAgQIECAsIECAAAECBAgPCBAgQIAAAcIDAgQIECAG+ZO/oPsErirrtEkZgvQAAAAASUVORK5CYII=';

    const src = this.props.src || emptyImg; // null also has default value
    const clickable = src !== emptyImg;
    if (naturalHeight && adjust && imgWidth === 'auto') {
      width = height * (naturalWidth / naturalHeight);
    } else if (naturalWidth && adjust && imgHeight === 'auto') {
      height = width * (naturalHeight / naturalWidth);
    }

    return (
      <div className="img-container" style={{ ...style, width, height }}>
        <img
          loading="lazy"
          ref="img"
          className={`img-img${clickable ? ' img-click' : ''}`}
          alt=""
          src={src}
          style={{ width: this.state.imgWidth, height: this.state.imgHeight }}
          onLoad={this.onImgLoad.bind(this)}
          onClick={() => {
            if (clickable) {
              this.onPreview();
            }
          }}
        />
        {!this.state.loaded && (
          <div className="img-skeleton-loading">
            <div
              style={{
                transform: `translate(-50%,-50%) scale(${Math.min(
                  width,
                  height,
                  160
                ) /
                  160 -
                  0.15})`,
              }}
              className="img-loading-container"
            >
              <div className="img-loading-circle" />
              <div className="img-loading-triangle" />
              <div className="img-loading-triangle1" />
            </div>
          </div>
        )}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.onPicCancel.bind(this)}
        >
          <img alt="" style={{ width: '100%' }} src={src} />
        </Modal>
      </div>
    );
  }
}

export default Img;
