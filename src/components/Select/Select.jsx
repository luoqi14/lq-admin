/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { Select as AntdSelect, Spin, Checkbox } from 'antd';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import unit from '../decorators/unit';
import { shallowEqual } from '../../util';

const Option = AntdSelect.Option;

class Select extends Component {
  static propTypes = {
    // value: PropTypes.oneOfType([
    //   PropTypes.string,
    //   PropTypes.array,
    // ]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    multiple: PropTypes.bool,
    combobox: PropTypes.bool,
    page: PropTypes.object,
    action: PropTypes.func,
    onSelect: PropTypes.func,
    data: PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    valueName: PropTypes.string,
    displayName: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    filterOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    showSearch: PropTypes.bool,
    optionFilterProp: PropTypes.string,
    allowClear: PropTypes.bool,
    appendToBody: PropTypes.bool,
    selectAll: PropTypes.bool,
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
    className: '',
    valueName: 'id',
    displayName: 'label',
    placeholder: '',
    disabled: false,
    filterOption: true,
    showSearch: false,
    optionFilterProp: 'children',
    allowClear: true,
    appendToBody: false,
    selectAll: false,
  };

  constructor(props) {
    super(props);
    const multiValue = props.multiple ? [] : undefined;
    const value =
      typeof props.value === 'number' ? props.value : props.value || multiValue;
    this.state = {
      value,
      page: props.page || undefined,
    };
    this.ref = React.createRef();
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
      const value =
        typeof nextProps.value === 'number'
          ? nextProps.value
          : nextProps.value || multiValue;

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

  shouldComponentUpdate(nextProps, newState) {
    return (
      !shallowEqual(this.props, nextProps, ['data-__field', 'data-__meta']) ||
      !shallowEqual(this.state, newState)
    );
  }

  onChange(value, options) {
    if (this.props.onChange) {
      this.props.onChange(value, options);
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
    if (value) {
      // select item or close the dropdownlist will set the value '', these situation should not search
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.search(value);
      }, 500);
    }
  }

  onFocus() {
    this.props.onFocus && this.props.onFocus();
  }

  onMouseDown = e => {
    e && e.preventDefault();
    return false;
  };

  onCheckAllChange = e => {
    const checked = e.target.checked;
    let value = [];
    const { page, valueName, onSelect } = this.props;
    let { data } = this.props;

    data = data || [];

    if (page) {
      data = page.data || [];
    }
    if (checked) {
      value = data.map(item => {
        return `${item[valueName || 'id']}`;
      });
      onSelect(
        value,
        value.map(v => {
          return data.find(item => `${item[valueName || 'id']}` === v);
        })
      );
      this.onChange(value);
    } else {
      // change will too slow
      const ref = this.props.compRef || this.ref;
      ref.current.rcSelect.onClearSelection({
        stopPropagation: () => {},
      });
    }
  };

  initEvent() {
    this.addKeyUp();
    this.addClick();
  }

  addKeyUp() {
    const dom = findDOMNode(this);
    // set field value '' reset search
    this.inputDom = dom.querySelectorAll('.ant-select-search__field')[0];
    this.inputDom &&
      this.inputDom.addEventListener(
        'keyup',
        e => {
          const directionKeyCode = [37, 38, 39, 40];
          if (directionKeyCode.indexOf(e.keyCode) > -1) {
            // exclude direction keys
            return;
          }
          const v = e.target.value;
          if (!v) {
            if (this.timer) {
              clearTimeout(this.timer);
            }
            this.search('');
            !this.props.multiple && this.onChange('');
          }
        },
        false
      );
  }

  addClick() {
    this.scrollBinded = false;
    const dom = findDOMNode(this);
    dom.addEventListener(
      'click',
      e => {
        setTimeout(() => {
          if (this.inputDom) {
            this.inputDom.value = this.state.page.query || '';
          }
        }, 100);
        // this.handlerScroll();
        // if no data, fetch the first page data, only page available
        const data = this.props.page.data;
        const loading = this.props.page.loading;
        if (!data || data.length === 0 || data[0].load) {
          !loading && this.search(this.props.page.query || this.state.value);
        }

        // clear reset search
        if (e.target.classList.contains('ant-select-selection__clear')) {
          this.search('');
        }
      },
      false
    );
  }
  handleScrollEvent = e => {
    const { target } = e;
    const sh = target.scrollHeight;
    const oh = target.offsetHeight;
    const st = target.scrollTop + 5;
    const { page } = this.state;
    const limit = page.limit || 10;
    const offset = (+page.offset || 0) + limit;
    const params = {
      offset,
      limit,
    };
    if (
      st + oh >= sh &&
      !page.loading &&
      (page.count ? offset < page.count : true)
    ) {
      this.search(page.query || '', params);
    }

    // show 'all'
    if (page.count && offset >= page.count && !this.state.page.all) {
      this.setState({
        ...this.state,
        page: {
          ...this.state.page,
          all: true,
        },
      });
    }
  };
  handlerScroll() {
    // find the child dropdown dom
    setTimeout(() => {
      if (this.inputDom) {
        this.inputDom.value = this.state.page.query || '';
      }
      if (!this.dropdownMenuDom) {
        const dom = findDOMNode(this);
        const menu = dom.querySelector('.ant-select-dropdown-menu');
        if (menu) {
          this.dropdownMenuDom = menu;
        } else {
          const menus = dom.querySelectorAll('.ant-select-dropdown-menu');
          this.dropdownMenuDom = menus[menus.length - 1];
        }
      }
      !this.scrollBinded &&
        this.dropdownMenuDom &&
        this.dropdownMenuDom.addEventListener(
          'scroll',
          () => {
            const sh = this.dropdownMenuDom.scrollHeight;
            const oh = this.dropdownMenuDom.offsetHeight;
            const st = this.dropdownMenuDom.scrollTop;
            const { page } = this.state;
            const limit = page.limit || 10;
            const offset = (+page.offset || 0) + limit;
            const params = {
              offset,
              limit,
            };
            if (
              st + oh >= sh &&
              !page.loading &&
              (page.count ? offset < page.count : true)
            ) {
              this.search(page.query || '', params);
            }

            // show 'all'
            if (page.count && offset >= page.count && !this.state.page.all) {
              this.setState({
                ...this.state,
                page: {
                  ...this.state.page,
                  all: true,
                },
              });
            }
          },
          false
        );
      this.scrollBinded = true;
    }, 100);
  }

  search(value, opts) {
    const action = this.props.action;
    const extraParams = this.props.page.extraParams || {};
    const query = this.props.displayName || 'label';
    const params = {
      offset: 0,
      limit: 10,
      ...opts,
      ...extraParams,
    };

    params[query] = Array.isArray(value) ? '' : value;
    if (action) {
      this.setState({
        ...this.state,
        page: {
          ...this.state.page,
          loading: true,
          all: false,
        },
      });
      action(params).then(res => {
        res && this.afterSearch(res);
      });
    }
  }

  afterSearch() {
    const multiple = this.props.multiple;
    let val = this.state.value;
    const data = this.props.page.data;
    const { count, offset, limit } = this.state.page;
    let item;
    if (data.length === 0 && !multiple) {
      val = '';
    } else if (!multiple && val) {
      const key = this.props.valueName || 'id';
      item = data.find(i => `${i[key]}` === val);
      if (!item) {
        val = data[0][key];
      }
    } else if (multiple && val.length > 0) {
      const key = this.props.valueName || 'id';
      item = data.filter(i => val.indexOf(`${i[key]}`) > 1);
      if (!item) {
        val = [data[0][key]];
      }
    }

    this.setState({
      ...this.state,
      page: {
        ...this.state.page,
        loading: false,
        all: count && offset + limit >= count,
      },
    });

    if (!multiple && this.state.value && !item) {
      this.onChange(val);
    }
    if (multiple && this.state.value.length > 0 && !item) {
      this.onChange(val);
    }
  }

  timer;

  dropdownMenuDom;

  renderOptions() {
    const { valueName, displayName, page, loading } = this.props;
    let { data } = this.props;

    data = data || [];

    if (page) {
      data = page.data || [];
    }

    const options = data.map(item => {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        return <Option key={`${item[0]}`}>{item[1]}</Option>; // key switch to string
      }
      return (
        <Option
          key={`${item[valueName || 'id'] || item.value}`}
          disabled={item.disabled}
        >
          {item[displayName || 'label']}
        </Option>
      );
    });

    if (page && this.state.page.all && !page.loading) {
      options.push(
        <Option disabled key="_selectIsAll">
          已加载全部
        </Option>
      );
    }

    if ((page && page.loading) || loading) {
      options.push(
        <Option disabled key="_selectLoading">
          <Spin size="small" />
        </Option>
      );
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
      selectAll,
      className,
      compRef,
      onBlur,
    } = this.props;

    const data = this.props.page ? this.props.page.data : this.props.data;

    const { value } = this.state;

    let { dropdownRender } = this.props;

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
    if (selectAll && multiple && !dropdownRender) {
      dropdownRender = menu => {
        return (
          <div>
            <Checkbox
              style={{
                padding: 8,
                borderBottom: '1px solid #E9E9E9',
                width: '100%',
              }}
              indeterminate={value.length > 0 && value.length !== data.length}
              onChange={this.onCheckAllChange}
              checked={value.length === data.length}
            >
              全选
            </Checkbox>
            {menu}
          </div>
        );
      };
    }
    return (
      <div style={{ display: 'flex' }}>
        <span>{addonBefore}</span>
        <div
          role="button"
          tabIndex={-1}
          onMouseDown={this.onMouseDown}
          style={{ flex: 'auto' }}
        >
          <AntdSelect
            ref={compRef || this.ref}
            id={id}
            onBlur={onBlur}
            size={size}
            showSearch={showSearch}
            filterOption={page ? false : filterOption}
            allowClear={allowClear}
            optionFilterProp={optionFilterProp}
            mode={mode}
            value={
              typeof this.state.value === 'number'
                ? `${this.state.value}`
                : this.state.value
            }
            style={style}
            className={className}
            notFoundContent={
              this.props.loading ? (
                <Spin size="small" />
              ) : (
                <span style={{ margin: '0 11px' }}>无匹配结果</span>
              )
            }
            onSearch={!page ? () => undefined : this.onSearch.bind(this)}
            onChange={this.onChange.bind(this)}
            onSelect={v => {
              onSelect(
                v,
                data.find(item => `${item[this.props.valueName || 'id']}` === v)
              );
            }}
            onFocus={this.onFocus.bind(this)}
            placeholder={placeholder}
            disabled={disabled}
            optionLabelProp="children"
            getPopupContainer={node =>
              appendToBody ? document.body : node.parentNode
            }
            onPopupScroll={page ? this.handleScrollEvent : null}
            dropdownRender={dropdownRender}
          >
            {this.renderOptions()}
          </AntdSelect>
        </div>
        <span>{addonAfter}</span>
        {this.renderUnit({})}
      </div>
    );
  }
}

export default unit(Select);
