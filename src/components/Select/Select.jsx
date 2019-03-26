/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Select as AntdSelect, Spin } from 'antd';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

const Option = AntdSelect.Option;

export default class Select extends Component {
  static propTypes = {
    // value: PropTypes.oneOfType([
    //   PropTypes.string,
    //   PropTypes.array,
    // ]),
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    multiple: PropTypes.bool,
    combobox: PropTypes.bool,
    page: PropTypes.object,
    action: PropTypes.func,
    onSelect: PropTypes.func,
    data: PropTypes.array,
    style: PropTypes.object,
    valueName: PropTypes.string,
    displayName: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    filterOption: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    showSearch: PropTypes.bool,
    optionFilterProp: PropTypes.string,
    allowClear: PropTypes.bool,
    appendToBody: PropTypes.bool,
  };

  static defaultProps = {
    id: undefined,
    multiple: false,
    combobox: false,
    page: undefined,
    action: () => undefined,
    onSelect: () => undefined,
    data: [],
    style: {},
    valueName: 'id',
    displayName: 'label',
    placeholder: '',
    disabled: false,
    filterOption: true,
    showSearch: false,
    optionFilterProp: 'children',
    allowClear: true,
    appendToBody: false,
  };

  constructor(props) {
    super(props);
    const multiValue = props.multiple ? [] : undefined;
    const value = typeof props.value === 'number' ? props.value
      : (props.value || multiValue);
    this.state = {
      value,
      page: props.page || undefined,
    };
  }

  componentWillMount() {
    const props = this.props;
    props.state && this.search();
  }

  componentDidMount() {
    if (this.state.page) {
      this.initEvent();
    }
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const multiValue = this.props.multiple ? [] : undefined;
      const value = typeof nextProps.value === 'number' ? nextProps.value
        : (nextProps.value || multiValue);

      this.setState({
        ...this.state,
        value,
        page: {
          ...this.state.page,
          ...nextProps.page,
        },
      });
    }
  }

  onChange(value) {
    if (this.props.onChange) {
      this.props.onChange(value);
    } else {
      this.setState({
        ...this.state,
        value,
      });
    }

    // this.props.onSelect
    // && this.props.onSelect(value, this.props.data.find((item) => item[this.props.valueName || 'id'] === value));
  }

  // multi fetch will occur the thing that when the last request is received earlier than others,
  // and how to keep the state?

  onSearch(value) {
    if (value) { // select item or close the dropdownlist will set the value '', these situation should not search
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.search(value);
      }, 500);
    }
  }

  initEvent() {
    this.addKeyUp();
    this.addClick();
  }

  addKeyUp() {
    const me = this;
    const dom = findDOMNode(this);
    // set field value '' reset search
    this.inputDom = dom.querySelectorAll('.ant-select-search__field')[0];
    this.inputDom && this.inputDom.addEventListener('keyup', (e) => {
      const v = e.target.value;
      if (!v && me.state.page.query) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.search('');
        this.onChange('');
      }
    }, false);
  }

  addClick() {
    this.scrollBinded = false;
    const dom = findDOMNode(this);
    dom.addEventListener('click', (e) => {
      this.handlerScroll();
      // if no data, fetch the first page data, only page available
      const data = this.props.page.data;
      if (!data || data.length === 0 || data[0].load) {
        this.search(this.state.value);
      }

      // clear reset search
      if (e.target.classList.contains('ant-select-selection__clear')) {
        this.search('');
      }
    }, false);
  }

  handlerScroll() {
    // find the child dropdown dom
    setTimeout(() => {
      if (this.inputDom) {
        this.inputDom.value = this.state.page.query || '';
      }
      const menus = document.querySelectorAll('.ant-select-dropdown-menu');
      this.dropdownMenuDom = menus[menus.length - 1];
      !this.scrollBinded && this.dropdownMenuDom.addEventListener('scroll', () => {
        const sh = this.dropdownMenuDom.scrollHeight;
        const oh = this.dropdownMenuDom.offsetHeight;
        const st = this.dropdownMenuDom.scrollTop;
        const {
          page,
        } = this.state;
        const params = {
          pageNo: (+page.pageNo || 1) + 1,
          pageSize: page.pageSize || 10,
        };
        if (st + oh >= sh && !page.loading && (page.count ? (page.pageNo * page.pageSize < page.count) : true)) {
          this.search(page.query || '', params);
        }

        // show 'all'
        if (page.count && (page.pageNo * page.pageSize >= page.count) && !this.state.page.all) {
          this.setState({
            ...this.state,
            page: {
              ...this.state.page,
              all: true,
            },
          });
        }
      }, false);
      this.scrollBinded = true;
    }, 100);
  }

  search(value, opts) {
    const action = this.props.action;
    const query = this.props.displayName || 'label';
    let params = opts;
    params = params || {
      pageNo: 1,
      pageSize: 10,
    };

    params[query] = value || '';
    if (action) {
      this.setState({
        ...this.state,
        page: {
          ...this.state.page,
          loading: true,
        },
      });
      action(params).then((res) => {
        res && this.afterSearch(res);
      });
    }
  }

  afterSearch() {
    let val = this.state.value;
    const data = this.props.page.data;
    let item;
    if (data.length === 0) {
      val = '';
    } else if (val) {
      const key = this.props.valueName || 'id';
      item = data.find((i) => i[key] === val);
      if (!item) {
        val = data[0][key];
      }
    }

    this.setState({
      ...this.state,
      page: {
        ...this.state.page,
        loading: false,
      },
    });

    if (this.state.value && !item) {
      this.onChange(val);
    }
  }

  timer;

  dropdownMenuDom;

  renderOptions() {
    const {
      valueName,
      displayName,
      page,
    } = this.props;
    let {
      data = [],
    } = this.props;

    if (page) {
      data = page.data || [];
    }

    const options = data.map((item) => {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        return <Option key={item[0]}>{item[1]}</Option>;
      }
      return (
        <Option key={`${item[valueName || 'id'] || item.value}`} disabled={item.disabled}>
          {item[displayName || 'label']}
        </Option>
      );
    });

    if (page && this.state.page.all) {
      options.push(<Option disabled key="_selectIsAll">已加载全部</Option>);
    }

    if (page && page.loading) {
      options.push(<Option disabled key="_selectLoading"><Spin size="small" /></Option>);
    }
    return options;
  }

  render() {
    const {
      multiple,
      combobox,
      placeholder,
      disabled,
      filterOption,
      showSearch = false,
      optionFilterProp,
      allowClear = true,
      page,
      onSelect,
      inputWidth,
      addonBefore = '',
      addonAfter = '',
      appendToBody,
      id,
      size,
    } = this.props;

    const style = { ...this.props.style };

    if (inputWidth) {
      style.width = inputWidth;
    }

    if (addonBefore) {
      style.marginLeft = 4;
    }

    if (addonAfter) {
      style.marginRight = 4;
    }
    let mode = '';
    if (multiple) {
      mode = 'multiple';
    } else if (combobox) {
      mode = 'combobox';
    }
    return (
      <div>
        <span>{addonBefore}</span>
        <AntdSelect
          id={id}
          size={size}
          showSearch={showSearch}
          filterOption={page ? false : filterOption}
          allowClear={allowClear}
          optionFilterProp={optionFilterProp}
          mode={mode}
          value={typeof this.state.value === 'number' ? (`${this.state.value}`) : this.state.value}
          style={style}
          notFoundContent={
            this.state.loading ? <Spin size="small" /> : <span style={{ margin: '0 11px' }}>无匹配结果</span>
          }
          onSearch={!page ? () => undefined : (this.onSearch.bind(this))}
          onChange={this.onChange.bind(this)}
          onSelect={(value) => {
            const data = this.props.page ? this.props.page.data : this.props.data;
            onSelect(value, data.find((item) => item[this.props.valueName || 'id'] === value));
          }}
          placeholder={placeholder}
          disabled={disabled}
          optionLabelProp="children"
          getPopupContainer={(node) => (appendToBody ? document.body : node.parentNode)}
        >
          {this.renderOptions()}
        </AntdSelect>
        <span>{addonAfter}</span>
      </div>
    );
  }
}
