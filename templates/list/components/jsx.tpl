import React, { Component } from 'react';
import { ListPage, Img } from '@f12/components';
import { Popconfirm, Button } from 'antd';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.load({
      ...this.props.searchParams,
      ...this.props.sorter,
    });
  }

  btnClick = () => {
    const {
      lock,
      selectedRowKeys,
    } = this.props;
    lock({ ids: selectedRowKeys, multi: true });
  };

  btnDisable = () => {
    return this.props.selectedRowKeys.length === 0;
  };

  renderImg = (url) => {
    return <Img src={url} />;
  };

  renderAction = (text, record) => (record.status === 1
    && (<Popconfirm
      title="你确定要注销吗?"
      onConfirm={this.props.lock.bind(this, { ids: [record.id] })}
    >
      <Button type="primary">注销</Button>
    </Popconfirm>));

  render() {
    const {
      breadcrumb,
      data,
      loading,
      page,
      load,
      changeSearch,
      searchParams,
      sorter,
      selectedRowKeys,
      selectRows,
      clearSelectedKeys,
      columns,
      buttons,
    } = this.props;

    return (
      <ListPage
        columns={parseFields.call(this, columns)}
        breadcrumb={breadcrumb}
        data={data}
        loading={loading}
        page={page}
        search={load}
        changeSearch={changeSearch}
        searchParams={searchParams}
        sorter={sorter}
        xScroll={800}
        checkbox={{
          selectedRowKeys,
          selectRows,
          clearSelectedKeys,
          getCheckboxProps: (record) => ({
            disabled: record.status === 2,
          }),
        }}
        buttons={parseFields.call(this, buttons)}
      />
    );
  }
}

export default View;
