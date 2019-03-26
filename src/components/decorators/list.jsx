import React, { Component } from 'react';

const list = (Cmp) => {
  class ListDecorator extends Component {
    componentDidMount() {
      const {
        load,
        searchParams,
        page,
      } = this.props;
      load({
        ...searchParams,
        ...page,
      });
    }

    render() {
      const {
        columns,
        data,
        title,
        visible,
        name,
        record,
        changeRecord,
        close,
        searchParams,
        changeSearch,
        load,
        loading,
        confirmDisabled,
        save,
        resetSearch,
        page,
        rowKey,
        buttons,
        fields,
      } = this.props;

      return (
        <Cmp
          {...this.props}
          rowKey={rowKey}
          data={data}
          name={name}
          columns={columns}
          title={title}
          buttons={buttons}
          modalVisible={visible}
          fields={fields}
          record={record}
          changeRecord={changeRecord}
          cancel={close}
          searchParams={searchParams}
          changeSearch={changeSearch}
          search={load}
          loading={loading}
          confirmDisabled={confirmDisabled}
          save={save}
          resetSearch={resetSearch}
          page={page}
          {...this.state}
        />
      );
    }
  }
  return ListDecorator;
};

export default list;
