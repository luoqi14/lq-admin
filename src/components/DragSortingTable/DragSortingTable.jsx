/* eslint-disable react/no-multi-comp, no-param-reassign, max-len */
import React, { Component } from 'react';
import { Icon } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Table from '../EditableTable';
import './style.scss';

let dragingIndex = -1;

const svg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M489.184 418.14v51.17c0 7.829-6.335 14.164-14.165 14.164h-49.58c-7.823 0-14.16-6.335-14.16-14.164v-51.17c0-7.824 6.337-14.167 14.16-14.167h49.58c7.83 0 14.165 6.344 14.165 14.166z m-0.084-136.984v51.172c0 7.827-6.334 14.165-14.165 14.165h-49.58c-7.821 0-14.157-6.337-14.157-14.165v-51.172c0-7.822 6.336-14.166 14.157-14.166h49.58c7.83-0.001 14.165 6.344 14.165 14.166z m0.084-137.504v51.17c0 7.827-6.335 14.165-14.165 14.165h-49.58c-7.823 0-14.16-6.337-14.16-14.165v-51.17c0-7.824 6.337-14.168 14.16-14.168h49.58c7.83 0 14.165 6.344 14.165 14.168z m0 685.456v51.169c0 7.83-6.335 14.166-14.165 14.166h-49.58c-7.823 0-14.16-6.335-14.16-14.166v-51.169c0-7.823 6.337-14.168 14.16-14.168h49.58c7.83 0 14.165 6.345 14.165 14.168z m-0.084-136.984v51.174c0 7.825-6.334 14.163-14.165 14.163h-49.58c-7.821 0-14.157-6.337-14.157-14.163v-51.174c0-7.822 6.336-14.167 14.157-14.167h49.58c7.83 0 14.165 6.345 14.165 14.167z m0.084-137.506v51.171c0 7.826-6.335 14.164-14.165 14.164h-49.58c-7.823 0-14.16-6.337-14.16-14.164v-51.171c0-7.825 6.337-14.168 14.16-14.168h49.58c7.83 0 14.165 6.343 14.165 14.168z m117.62-136.479v51.17c0 7.83-6.334 14.165-14.164 14.165h-49.566c-7.823 0-14.16-6.335-14.16-14.164v-51.17c0-7.824 6.337-14.167 14.16-14.167h49.566c7.83 0 14.165 6.344 14.165 14.166z m-0.082-136.983v51.172c0 7.827-6.334 14.165-14.165 14.165h-49.566c-7.822 0-14.158-6.337-14.158-14.165v-51.172c0-7.822 6.336-14.166 14.158-14.166h49.566c7.83-0.001 14.165 6.344 14.165 14.166z m0.083-137.504v51.17c0 7.827-6.335 14.165-14.165 14.165h-49.566c-7.823 0-14.16-6.337-14.16-14.165v-51.17c0-7.824 6.337-14.168 14.16-14.168h49.566c7.83 0 14.165 6.344 14.165 14.168z m0 685.456v51.169c0 7.83-6.335 14.166-14.165 14.166h-49.566c-7.823 0-14.16-6.335-14.16-14.166v-51.169c0-7.823 6.337-14.168 14.16-14.168h49.566c7.83 0 14.165 6.345 14.165 14.168z m-0.083-136.984v51.174c0 7.825-6.334 14.163-14.165 14.163h-49.566c-7.822 0-14.158-6.337-14.158-14.163v-51.174c0-7.822 6.336-14.167 14.158-14.167h49.566c7.83 0 14.165 6.345 14.165 14.167z m0.083-137.506v51.171c0 7.826-6.335 14.164-14.165 14.164h-49.566c-7.823 0-14.16-6.337-14.16-14.164v-51.171c0-7.825 6.337-14.168 14.16-14.168h49.566c7.83 0 14.165 6.343 14.165 14.168z m0 0" />
  </svg>
);

const DragIcon = props => <Icon component={svg} {...props} />;

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow)
);

class DragSortingTable extends Component {
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { value } = this.props;
    const dragRow = value[dragIndex];

    const newValue = update(value, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
    });

    this.props.onChange(newValue);
  };

  render() {
    const {
      dataSource = [],
      value = [],
      columns,
      compRef,
      components = {
        body: {},
      },
      className = '',
    } = this.props;
    return (
      <DndProvider backend={HTML5Backend}>
        <Table
          {...this.props}
          ref={compRef}
          className={`${className} drag-sorting-table`}
          columns={[
            {
              name: '',
              label: '',
              width: 1,
              render: () => (
                <Icon
                  style={{ fontSize: 24, color: '#868686', margin: 0 }}
                  component={DragIcon}
                />
              ),
            },
            ...columns,
          ]}
          dataSource={dataSource.length > 0 ? dataSource : value}
          components={{
            ...this.components,
            body: {
              ...components.body,
              ...this.components.body,
            },
          }}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
        />
      </DndProvider>
    );
  }
}

export default DragSortingTable;
