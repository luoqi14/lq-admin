import React, { Component } from 'react';
import { Popconfirm, Button } from 'antd';
import ListPage from '../../../../components/ListPage';
import Img from '../../../../components/Img';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.loadUsers({
      ...this.props.searchParams,
      ...this.props.sorter,
      ...this.props.page,
    });
  }

  btnClick = () => {
    const { lockUser, selectedRowKeys } = this.props;
    lockUser({ ids: selectedRowKeys, multi: true });
  };

  btnDisable = () => {
    return this.props.selectedRowKeys.length === 0;
  };

  renderImg = url => {
    return <Img src={url} />;
  };

  renderAction = (text, record) =>
    record.status === 1 && (
      <Popconfirm
        title="你确定要注销吗?"
        onConfirm={this.props.lockUser.bind(this, { ids: [record.id] })}
      >
        <Button type="primary">注销</Button>
      </Popconfirm>
    );

  render() {
    const {
      menuRouter,
      users,
      loading,
      page,
      loadUsers,
      changeSearch,
      searchParams,
      sorter,
      selectedRowKeys,
      selectRows,
      clearSelectedKeys,
      columns,
      buttons,
      className,
    } = this.props;

    return (
      <ListPage
        className={className}
        columns={parseFields.call(this, columns)}
        breadcrumb={menuRouter}
        data={users}
        loading={loading}
        page={page}
        search={loadUsers}
        changeSearch={changeSearch}
        searchParams={searchParams}
        sorter={sorter}
        xScroll={800}
        checkbox={{
          selectedRowKeys,
          selectRows,
          clearSelectedKeys,
          getCheckboxProps: record => ({
            disabled: record.status === 2,
          }),
        }}
        buttons={parseFields.call(this, buttons)}
      />
    );
  }
}

export default View;
