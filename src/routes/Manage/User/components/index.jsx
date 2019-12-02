import React, { Component } from 'react';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';
import TableAction from '../../../../components/TableAction';

class View extends Component {
  componentDidMount() {
    this.load();
    this.props.loadArea({
      pageNo: 1,
      pageSize: 1000000,
    });
    this.props.loadDepartment({
      pageNo: 1,
      pageSize: 1000000,
    });
  }

  load(params = {}) {
    this.props.load({
      ...this.props.searchParams,
      ...this.props.page,
      ...params,
    });
  }

  btnClick = () => {
    this.props.history.push('/Manage/UserDetail/0');
  };

  renderAction = (text, record) => (
    <TableAction
      buttons={[
        {
          label: '编辑',
          onClick: () => {
            this.props.history.push(`/Manage/UserDetail/${record.id}`);
          },
        },
        {
          label: '打卡区域',
          onClick: () => {
            this.props.history.push(`/Manage/UserLocation/${record.id}`);
          },
        },
      ]}
    />
  );

  render() {
    const {
      className,
      columns,
      menuRouter,
      data,
      loading,
      page,
      load,
      changeSearch,
      searchParams,
      buttons,
    } = this.props;

    return (
      <ListPage
        className={className}
        columns={parseFields.call(this, columns)}
        breadcrumb={menuRouter}
        data={data}
        loading={loading}
        page={page}
        search={load}
        changeSearch={changeSearch}
        searchParams={searchParams}
        xScroll={800}
        buttons={parseFields.call(this, buttons)}
      />
    );
  }
}

export default View;
