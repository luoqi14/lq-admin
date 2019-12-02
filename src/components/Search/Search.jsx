import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

export default class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch: undefined,
  };

  constructor(props) {
    super(props);
    let value = props.value || undefined;
    if (typeof value === 'number') {
      value = `${value}`;
    }
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || undefined;
      if (typeof value === 'number') {
        value = `${value}`;
      }
      this.setState({ value });
    }
  }

  handleSearch(value) {
    const { onSearch, form, name } = this.props;
    form &&
      form.validateFieldsAndScroll([name], error => {
        if (!error) {
          onSearch(value);
        }
      });
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <Input.Search
        {...this.props}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        onSearch={this.handleSearch.bind(this)}
      />
    );
  }
}
