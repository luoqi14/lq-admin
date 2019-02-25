import React, { Component } from 'react';
import { message } from 'antd';
import { DetailPage } from '@f12/components';
import { parseFields } from '../../../../util';

class View extends Component {
  componentDidMount() {
    this.props.load({
      id: this.props.match.params.id,
    });
  }

  submit = (form) => {
    // force is important, as default the value not change won't validate the rules
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        message.info(JSON.stringify(values));
        this.props.save(values).then((success) => {
          if (success) {
            this.props.history.goBack();
          }
        });
      }
    });
  };

  render() {
    const {
      record,
      changeRecord,
      breadcrumb,
      fields,
      buttons,
    } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <DetailPage
          values={record}
          changeRecord={changeRecord}
          breadcrumb={breadcrumb}
          fields={parseFields.call(this, fields.map((field) => ({
            ...field,
            required: true,
          })))}
          buttons={parseFields.call(this, buttons)}
        />
      </div>
    );
  }
}

export default View;
