import React, { Component } from 'react';
import { Col } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import ImagePicker from './ImagePicker';
import './style.scss';
import unit from '../decorators/unit';

class ImagePickerGroup extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    tokenSeparators: PropTypes.string,
    disabled: PropTypes.bool,
    action: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    getToken: PropTypes.func,
    getUrl: PropTypes.func,
    single: PropTypes.bool,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    mostPic: PropTypes.number,
    type: PropTypes.string,
    onPreview: PropTypes.func,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    headers: PropTypes.object,
    fullValue: PropTypes.bool,
    fieldNames: PropTypes.object,
    showName: PropTypes.bool,
    beforeUpload: PropTypes.func,
    adjust: PropTypes.bool,
  };

  static defaultProps = {
    tokenSeparators: undefined,
    disabled: false,
    width: 100,
    height: 100,
    getToken: undefined,
    getUrl: undefined,
    single: false,
    data: {},
    mostPic: 10000,
    type: 'image',
    onPreview: undefined,
    text: '',
    headers: undefined,
    fullValue: false,
    fieldNames: {
      url: 'url',
      name: 'name',
    },
    showName: false,
    beforeUpload: undefined,
    adjust: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      items: props.value || [],
      blankShow: true,
    };
    this.fullValue = this.formatValues(this.state.items);
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({
        items: value || [],
        disabled: nextProps.disabled,
      });
    }
  }

  onChange(value, fullValue) {
    const { tokenSeparators } = this.props;
    let items = this.state.items;
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators);
    }
    items = [...items];
    items[value.key] = value.value;
    this.fullValue[value.key] = fullValue;
    this.props.onChange(this.parseValues(items));
    this.props.afterChange && this.props.afterChange(this.fullValue);
  }

  onClose(seq) {
    const { tokenSeparators } = this.props;
    let items = this.state.items;
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators);
    }
    items = [...items];

    items.splice(seq, 1);

    this.setState({
      ...this.state,
      items,
    });

    this.fullValue.splice(seq, 1);
    this.props.onChange(this.parseValues(items));
    this.props.afterChange && this.props.afterChange(this.fullValue);
  }

  onDragStart() {
    this.setState({
      blankShow: false,
    });
  }

  onDragEnd(result) {
    // dropped outside the list
    this.setState({
      blankShow: true,
    });
    if (!result.destination) {
      return;
    }

    const reorder = (list, startIndex, endIndex) => {
      let newList = list;
      if (typeof newList === 'string') {
        newList = [newList];
      }
      const res = Array.from(newList);
      const [removed] = res.splice(startIndex, 1);
      res.splice(endIndex, 0, removed);

      return res;
    };

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
    this.props.onChange(this.parseValues(items));
  }

  formatValues(items) {
    let newItems = items;
    const { tokenSeparators } = this.props;
    if (tokenSeparators && newItems.length !== 0) {
      newItems = newItems.toString().split(tokenSeparators);
    } else if (typeof items === 'string') {
      newItems = [items];
    }
    return newItems;
  }

  parseValues(items) {
    let newItems = items;
    const { tokenSeparators, fullValue } = this.props;
    if (fullValue) {
      return this.fullValue;
    }
    if (tokenSeparators) {
      newItems = newItems.join(tokenSeparators);
    }
    return newItems;
  }

  add() {
    const defaultValue = {
      value: '',
    };
    const items = [...this.state.items, defaultValue];
    this.setState({
      ...this.state,
      items,
    });
    this.props.onChange(this.parseValues(items));
  }

  render() {
    const {
      tokenSeparators,
      action,
      width,
      height,
      disabled,
      getToken,
      getUrl,
      single,
      data,
      type,
      onPreview,
      text,
      headers,
      fullValue,
      fieldNames,
      showName,
      extras = [],
      beforeUpload,
      adjust,
    } = this.props;

    let { mostPic } = this.props;

    const getListStyle = isDraggingOver => ({
      background: isDraggingOver ? 'rgba(0, 0, 0, 0.05)' : 'white',
      display: 'flex',
      width: '100%',
      overflow: 'auto',
      transition: 'all .2s',
    });

    const getItemStyle = (draggableStyle, isDragging) => ({
      userSelect: 'none',
      opacity: isDragging ? 0.6 : 1,
      background: 'transparent',
      ...draggableStyle,
    });

    const createItems = () => {
      let items = this.state.items;
      items = this.formatValues(items);
      items = items.slice(0, this.props.mostPic);
      const res = items.map((item, index) => (
        <Draggable key={item} draggableId={item} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              style={getItemStyle(
                provided.draggableProps.style,
                snapshot.isDragging
              )}
            >
              <Col
                className={`imagepicker-item-wrapper ${
                  items.length >= mostPic && items.length - 1 === index
                    ? 'imagepicker-item-wrapper-last'
                    : ''
                }`}
                key={`upload${index.toString()}`}
              >
                <ImagePicker
                  value={item}
                  sequence={index}
                  disabled={disabled}
                  onChange={this.onChange.bind(this)}
                  onClose={this.onClose.bind(this)}
                  closeable
                  action={action}
                  width={width}
                  mostPic={mostPic}
                  height={height}
                  getToken={getToken}
                  getUrl={getUrl}
                  data={data}
                  type={type}
                  onPreview={
                    onPreview
                      ? (value, name = '') => {
                          onPreview(value, index, name);
                        }
                      : undefined
                  }
                  text={text}
                  headers={headers}
                  fullValue={fullValue}
                  fieldNames={fieldNames}
                  showName={showName}
                  extra={extras[index]}
                  beforeUpload={beforeUpload}
                  adjust={adjust}
                />
              </Col>
            </div>
          )}
        </Draggable>
      ));
      // blank placeholder
      if (single) {
        mostPic = 1;
      }
      if (items.length === 0 || (!(items.length > mostPic - 1) && !disabled)) {
        res.push(
          <Col
            className="imagepicker-item-wrapper"
            key="uploadBlank"
            style={{ display: this.state.blankShow ? 'block' : 'none' }}
          >
            <ImagePicker
              value={undefined}
              sequence={items.length}
              disabled={disabled}
              onChange={this.onChange.bind(this)}
              onClose={this.onClose.bind(this)}
              closeable={false}
              tokenSeparators={tokenSeparators}
              action={action}
              width={width}
              height={height}
              getToken={getToken}
              getUrl={getUrl}
              data={data}
              type={type}
              text={text}
              headers={headers}
              fullValue={fullValue}
              fieldNames={fieldNames}
              showName={showName}
              beforeUpload={beforeUpload}
            />
          </Col>
        );
      }
      return res;
    };

    return (
      <DragDropContext
        onDragEnd={this.onDragEnd.bind(this)}
        onDragStart={this.onDragStart.bind(this)}
      >
        <div value={this.state.item} className="imagepicker-container">
          <Droppable
            key="droppable"
            droppableId="droppable"
            direction="horizontal"
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {createItems()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {this.renderUnit({
            position: 'inherit',
            display: 'flex',
            alignItems: 'center',
          })}
        </div>
      </DragDropContext>
    );
  }
}

export default unit(ImagePickerGroup);
