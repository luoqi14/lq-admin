import React, { Component } from 'react';

const list = (Cmp, id) => {
  class ListDecorator extends Component {
    componentDidMount() {
      const {
        load,
        searchParams,
        page,
      } = this.props;
      const params = {
        ...searchParams,
        ...page,
      };
      if (id) {
        params[id] = this.props.params.id;
      }
      load(params);
    }

    render() {
      const {
        columns,
        data,
        title,
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
          modalVisible={false}
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
