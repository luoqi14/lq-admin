import React from 'react';
import { message as antdMessage, Icon } from 'antd';

let hide;

const onClose = () => {
  hide();
};

const message = {
  error: msg => {
    hide = antdMessage.error(
      <span>
        {msg}
        <Icon
          type="cross"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: -4,
            top: 4,
            color: '#999',
            cursor: 'pointer',
            fontSize: 12,
          }}
        />
      </span>,
      3
    );
  },
};

export default message;
