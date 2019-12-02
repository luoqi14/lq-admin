import React from 'react';
import { Popconfirm } from 'antd';
import './style.scss';

export default props => {
  let title = props.title;
  if (props.subtitle) {
    title = (
      <div className="fe-popconfirm-title">
        {props.title}
        <br />
        <span className="fe-popconfirm-subtitle">{props.subtitle}</span>
      </div>
    );
  }
  return <Popconfirm {...props} title={title} />;
};
