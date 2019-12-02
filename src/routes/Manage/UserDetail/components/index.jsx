import React, { Component } from 'react';
import DetailPage from '../../../../components/DetailPage';
import { parseFields } from '../../../../util';

class View extends Component {
  constructor(props) {
    super(props);
    const { id } = props.match.params;
    if (id === '0') {
      this.type = '1';
    } else {
      this.type = '2';
    }
    props.loadRole({
      pageSize: 100000,
      pageNo: 1,
    });
    props.loadDepartment({
      pageSize: 100000,
      pageNo: 1,
    });
    props.loadArea({
      pageSize: 100000,
      pageNo: 1,
    });
  }

  componentDidMount() {
    const { match, load } = this.props;
    const { id } = match.params;
    if (this.type !== '1') {
      load({
        userId: id,
      });
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  submit = form => {
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        this.props.save({ ...values, id: values.userId }).then(res => {
          if (res.success) {
            this.props.history.goBack();
          }
        });
      }
    });
  };
  cancel = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      record,
      changeRecord,
      className,
      fields,
      buttons,
      loading,
      typeMap,
    } = this.props;

    const breadcrumb = [
      {
        id: 1,
        name: '用户管理',
        href: '/Manage/User',
      },
      {
        id: 2,
        name: `用户${typeMap[this.type]}`,
      },
    ];

    const firstFields = parseFields.call(
      this,
      fields.map(field => ({
        required: true,
        ...field,
      }))
    );

    return (
      <div style={{ width: '100%' }} className={className}>
        <DetailPage
          loading={loading}
          values={record}
          changeRecord={changeRecord}
          breadcrumb={breadcrumb}
          fields={firstFields}
          buttons={parseFields.call(this, buttons)}
        />
      </div>
    );
  }
}

export default View;
