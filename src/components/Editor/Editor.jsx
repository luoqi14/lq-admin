import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import fetch from '../../util/fetch';
import './style.scss';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value || '' };
    const {
      action,
      fileName = 'file',
      getUrl,
    } = props;
    this.modules = {
      toolbar: {
        container: this.toolbarOptions,
        handlers: {
          fullscreen() {
            const node = this.container.parentNode;
            if (node.classList.contains('fullscreen')) {
              node.classList.remove('fullscreen');
            } else {
              node.classList.add('fullscreen');
            }
          },
          image() {
            const imgEl = document.createElement('input');
            imgEl.type = 'file';
            imgEl.click();
            imgEl.addEventListener('change', (e) => {
              const file = e.target.files[0];
              fetch(action, { [fileName]: file }, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }).then((res) => {
                const url = getUrl(res);
                if (url) {
                  const cursorPosition = this.quill.getSelection().index;
                  this.quill.insertEmbed(cursorPosition, 'image', url);
                  this.quill.setSelection(cursorPosition + 1);
                }
              });
            }, false);
          },
        },
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || '';
      this.setState({ value });
    }
  }

  handleChange(value) {
    let newValue = value;
    if (value === '<p><br></p>') {
      newValue = '';
    }
    this.props.onChange(newValue);
  }

  toolbarOptions = [
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    // [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    // [{ direction: 'rtl' }], // text direction

    // [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    // [{ font: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'], // remove formatting button
    ['fullscreen'],
  ];

  render() {
    return (
      <ReactQuill
        {...this.props}
        modules={this.modules} // modules shoule be singleton
        theme="snow"
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
