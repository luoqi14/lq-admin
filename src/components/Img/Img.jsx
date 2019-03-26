/* eslint-disable react/no-string-refs,jsx-a11y/no-noninteractive-element-interactions */
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
  };

  static defaultProps = {
    width: 64,
    height: 64,
    src: '/logo-gray.png',
    adjust: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      imgWidth: 'auto',
      imgHeight: 'auto',
      previewVisible: false,
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
    let imgWidth;
    let imgHeight;
    if ((img.naturalHeight > img.naturalWidth) || (img.height > img.width)) {
      imgWidth = this.props.width;
      imgHeight = 'auto';
    } else {
      imgWidth = 'auto';
      imgHeight = this.props.height;
    }
    this.setState(Object.assign({}, this.state, {
      imgWidth,
      imgHeight,
      naturalHeight: img.naturalHeight || img.height,
      naturalWidth:  img.naturalWidth || img.width,
    }));
  }

  onPreview() {
    this.setState(Object.assign({}, this.state, {
      previewVisible: true,
    }));
  }

  onPicCancel() {
    this.setState(Object.assign({}, this.state, {
      previewVisible: false,
    }));
  }

  // renderSrc = () => {
  //   const img = this.refs.img;
  //   const y = img.getBoundingClientRect().bottom;
  //   if (y <= screen.height && y >= 0) {
  //     img.src = img.getAttribute('data-src');
  //   }
  // };

  render() {
    const {
      adjust,
    } = this.props;

    let {
      width,
      height,
    } = this.props;

    const src = this.props.src || '/logo-gray.png'; // null also has default value

    const {
      previewVisible,
      imgWidth,
      imgHeight,
      naturalHeight,
      naturalWidth,
    } = this.state;

    const clickable = src !== '/logo-gray.png';

    if (naturalHeight && adjust && imgWidth === 'auto') {
      width = height * (naturalWidth / naturalHeight);
    } else if (naturalWidth && adjust && imgHeight === 'auto') {
      height = width * (naturalHeight / naturalWidth);
    }

    return (
      <div
        className="img-container"
        style={{ width, height }}
      >
        <img
          ref="img"
          className={`img-img${clickable ? ' img-click' : ''}`}
          alt=""
          src={src || '/logo-gray.png'}
          style={{ width: this.state.imgWidth, height: this.state.imgHeight }}
          onLoad={this.onImgLoad.bind(this)}
          onClick={() => {
            if (clickable) {
              this.onPreview();
            }
          }}
        />
        <Modal visible={previewVisible} footer={null} onCancel={this.onPicCancel.bind(this)}>
          <img alt="" style={{ width: '100%' }} src={src} />
        </Modal>
      </div>
    );
  }
}

export default Img;
