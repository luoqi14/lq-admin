import React, { Component } from 'react';
import ListPage from '../../../../components/ListPage';
import { parseFields } from '../../../../util';
import TableAction from '../../../../components/TableAction';

class View extends Component {
  componentDidMount() {
    this.load();
  }

  load(params = {}) {
    this.props.load({
      ...this.props.searchParams,
      ...this.props.page,
      ...params,
    });
  }

  btnClick = () => {
    this.props.history.push('/Manage/xxxDetail/0');
  };

  renderAction = (text, record) => (
    <TableAction
      buttons={[
        {
          label: '编辑',
          onClick: () => {
            this.props.history.push(`/Manage/xxxDetail/${record.id}`);
          },
        },
        {
          label: '删除',
          onClick: () => {
            this.props
              .delete({
                id: record.id,
              })
              .then(res => {
                if (res.success) {
                  this.load();
                }
              });
          },
          confirm: '确定要删除吗',
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
