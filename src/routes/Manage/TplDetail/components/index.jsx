import React, { Component } from 'react';
import DetailPage from '../../../../components/DetailPage';
import { parseFields } from '../../../../util';

class View extends Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    if (id === '0') {
      this.type = '1';
    } else {
      this.type = '2';
    }
  }

  componentDidMount() {
    const { match, load } = this.props;
    const { id } = match.params;
    if (this.type !== '1') {
      load({
        id,
      });
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  submit = form => {
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        this.props.save(values).then(res => {
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
        name: '1',
        href: '/xxx',
      },
      {
        id: 2,
        name: '2',
      },
      {
        id: 3,
        name: typeMap[this.type],
      },
    ];

    return (
      <div style={{ width: '100%' }} className={className}>
        <DetailPage
          loading={loading}
          values={record}
          changeRecord={changeRecord}
          breadcrumb={breadcrumb}
          fields={parseFields.call(
            this,
            fields.map(field => ({
              required: true,
              ...field,
            }))
          )}
          buttons={parseFields.call(this, buttons)}
        />
      </div>
    );
  }
}

export default View;
