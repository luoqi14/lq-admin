/* eslint-disable no-nested-ternary,global-require */
import React from 'react';
import { Input, Form, Row, Col, Tooltip, Icon, Cascader } from 'antd';
import moment from 'moment';
import Address from './Address';
import Captcha from './Captcha';
import CommonDatePicker from './DatePicker';
import CommonDateRange from './DateRange';
import ImagePicker from './ImagePicker';
import AutoComplete from './Input';
import AddressSearch from './AddressSearch';
import MonthPicker from './MonthPicker';
import MonthRange from './MonthRange';
import InputNumber from './Number';
import NumberRange from './NumberRange';
import Radio from './Radio';
import Checkbox from './Checkbox';
import Search from './Search';
import CommonSelect from './Select';
import MapView from './Map';
import TextArea from './TextArea';
import Switch from './Switch';
import DynamicAddDel from './DynamicAddDel';
import AddonBeforeAfter from './AddonBeforeAfter';
import Table from './DragSortingTable';
import Table2 from './EditableTable';
import TimePicker from './TimePicker';
import TimeRange from './TimeRange';
import MenuInTree from './MenuInTree';
import Transfer from './Transfer';
import Tree from './Tree';
import Display from './Display';
import Tag from './Tag';
import ColorPicker from './ColorPicker';
import TreeSelect from './TreeSelect';
import Tabs from './Tabs';

import './style.scss';

const FormItem = Form.Item;

const shapeSelectData = field => {
  let data = field.data;
  const valueName = field.valueName || 'id';
  const displayName = field.displayName || 'label';
  if (typeof data === 'function') {
    data = data();
  }
  let res = [];
  if (Object.prototype.toString.call(data) === '[object Object]') {
    Object.keys(data).forEach(item => {
      const itemObj = {};
      itemObj[valueName] = item;
      itemObj[displayName] = data[item];
      res.push(itemObj);
    });
  } else {
    res = data;
  }
  return res;
};

// 处理radio传参
const shapeRadioData = field => {
  const data = field.data;
  const valueName = field.valueName || 'id';
  const displayName = field.displayName || 'label';
  let res = {};
  if (Object.prototype.toString.call(data) === '[object Array]') {
    data.forEach(item => {
      res[item[valueName]] = item[displayName];
    });
  } else {
    res = data;
  }
  return res;
};

const components = {
  default: (field, defaultOpts) => {
    const newField = { ...field };
    const compProps = { ...(field.component && field.component.props) };
    delete newField.value;
    delete newField.colon;
    delete newField.br;
    const inputOpts = { ...defaultOpts };
    delete inputOpts.compRef;
    delete inputOpts.onPressEnter;
    return typeof field.component === 'function' ? (
      <field.component {...inputOpts} {...newField} />
    ) : (
      <field.component.type {...compProps} {...inputOpts} {...newField} />
    ); // not sure
  },
  html: field => field.html,
  date: (field, defaultOpts) => (
    <CommonDatePicker
      {...defaultOpts}
      form={null}
      format="YYYY-MM-DD"
      onChange={field.onChange}
      disabledDate={field.disabledDate}
    />
  ),
  address: (field, defaultOpts) => (
    <Address
      {...defaultOpts}
      form={null}
      displayValue={field.displayValue}
      changeOnSelect={!!field.changeOnSelect}
      data={field.data}
      fieldNames={field.fieldNames}
      onChange={field.onChange}
      loadData={field.loadData}
      showSearch={field.showSearch}
      appendToBody={field.appendToBody}
    />
  ),
  datetime: (field, defaultOpts) => (
    <CommonDatePicker
      {...defaultOpts}
      form={null}
      showTime={
        field.showTime || { defaultValue: moment('00:00:00', 'HH:mm:ss') }
      }
      format={field.format || 'YYYY-MM-DD HH:mm:ss'}
      onChange={field.onChange}
      disabledDate={field.disabledDate}
      disabledTime={field.disabledTime}
    />
  ),
  dateRange: (field, defaultOpts) => {
    return (
      <CommonDateRange
        {...defaultOpts}
        form={null}
        format="YYYY-MM-DD"
        maxInterval={field.maxInterval}
        shortcuts={field.shortcuts}
        minDate={field.minDate}
        maxDate={field.maxDate}
      />
    );
  },
  display: (field, defaultOpts) => <Display {...defaultOpts} />,
  datetimeRange: (field, defaultOpts) => (
    <CommonDateRange
      {...defaultOpts}
      form={null}
      showTime={defaultOpts.showtime || { format: 'HH:mm:ss' }}
      format={defaultOpts.format || 'YYYY-MM-DD HH:mm:ss'}
      maxInterval={field.maxInterval}
      shortcuts={field.shortcuts}
      minDate={field.minDate}
      maxDate={field.maxDate}
      defaultShowTime={field.defaultShowTime}
      startDisabled={field.startDisabled}
      endDisabled={field.endDisabled}
    />
  ),
  month: (field, defaultOpts) => <MonthPicker {...defaultOpts} form={null} />,
  monthRange: (field, defaultOpts) => (
    <MonthRange {...defaultOpts} form={null} />
  ),
  select: (field, defaultOpts) => (
    <CommonSelect
      {...defaultOpts}
      form={null}
      render={field.render}
      loading={field.loading}
      action={field.action}
      data={shapeSelectData(field)}
      multiple={field.multiple}
      combobox={field.combobox}
      onChange={field.onChange}
      valueName={field.valueName}
      displayName={field.displayName}
      onSelect={field.onSelect}
      onFocus={field.onFocus}
      onBlur={field.onBlur}
      showSearch={field.showSearch}
      allowClear={!field.required}
      page={field.page}
      inputWidth={field.inputWidth}
      addonBefore={field.addonBefore}
      addonAfter={field.addonAfter}
      appendToBody={field.appendToBody}
      selectAll={field.selectAll}
    />
  ),
  checkbox: (field, defaultOpts) => (
    <Checkbox
      {...defaultOpts}
      form={null}
      data={shapeRadioData(field)}
      checkAll={field.checkAll}
      itemSpan={field.itemSpan}
      readonly={field.readonly}
    />
  ),
  image: (field, defaultOpts) => (
    <ImagePicker
      {...defaultOpts}
      form={null}
      data={field.data}
      tokenSeparators={field.tokenSeparators}
      action={field.action}
      width={field.width}
      mostPic={field.mostPic}
      height={field.height}
      token={field.token}
      getUrl={field.getUrl}
      single={field.single}
      onPreview={field.onPreview}
      text={field.text}
      headers={field.headers}
      afterChange={field.afterChange}
      fullValue={field.fullValue}
      fieldNames={field.fieldNames}
      showName={field.showName}
      extras={field.extras}
      beforeUpload={field.beforeUpload}
      adjust={field.adjust}
      type="image"
    />
  ),
  menuInTree: (field, defaultOpts) => (
    <MenuInTree
      {...defaultOpts}
      form={null}
      onExpand={field.onExpand} // 点击展开
      expandedKeys={field.expandedKeys} // 展开的项
      autoExpandParent={field.autoExpandParent} // 是否自动展开父节点
      checkedKeys={field.checkedKeys} // 被勾选的项
      onCheck={field.onCheck} // 点击勾选
      onSelect={field.onSelect} // 点击树内容触发
      selectedKeys={field.selectedKeys}
      treeData={field.treeData}
      disabled={field.treeDisabled} // 树是否禁用
      adjust={field.adjust}
    />
  ),
  file: (field, defaultOpts) => (
    <ImagePicker
      {...defaultOpts}
      form={null}
      data={field.data}
      tokenSeparators={field.tokenSeparators}
      action={field.action}
      width={field.width}
      mostPic={field.mostPic}
      height={field.height}
      getToken={field.getToken}
      getUrl={field.getUrl}
      single={field.single}
      headers={field.headers}
      onPreview={field.onPreview}
      text={field.text}
      type="file"
      afterChange={field.afterChange}
      fullValue={field.fullValue}
      fieldNames={field.fieldNames}
      showName={field.showName}
      extras={field.extras}
      beforeUpload={field.beforeUpload}
    />
  ),
  password: (field, defaultOpts) => {
    const inputOpts = { ...defaultOpts };
    delete inputOpts.compRef;
    return <Input type="password" {...inputOpts} form={null} />;
  },
  number: (field, defaultOpts) => (
    <InputNumber
      {...defaultOpts}
      form={null}
      max={field.max}
      min={field.min}
      money={field.money}
      reduce={field.reduce}
      inputWidth={field.inputWidth}
      addonBefore={field.addonBefore}
      addonAfter={field.addonAfter}
      antdAddonAfter={field.antdAddonAfter}
      antdAddonBefore={field.antdAddonBefore}
      precision={field.precision}
      render={field.render}
      readonly={field.readonly}
      step={field.step}
    />
  ),
  textarea: (field, defaultOpts) => (
    <TextArea
      {...defaultOpts}
      form={null}
      max={field.max}
      autosize={
        field.maxRows
          ? { minRows: 2, maxRows: field.maxRows }
          : { minRows: 2, maxRows: 6 }
      }
    />
  ),
  radio: (field, defaultOpts) => (
    <Radio
      {...defaultOpts}
      form={null}
      data={field.data}
      styleType={field.styleType}
      disabledKeys={field.disabledKeys}
    />
  ),
  numberRange: (field, defaultOpts) => (
    <NumberRange
      {...defaultOpts}
      startMin={field.startMin}
      endMin={field.endMin}
      startMax={field.startMax}
      endMax={field.endMax}
      placeholderPrefix={field.placeholderPrefix}
      reduce={field.reduce}
      precision={field.precision}
      addonAfter={field.addonAfter}
      addonMiddle={field.addonMiddle}
      addonBefore={field.addonBefore}
    />
  ),
  captcha: (field, defaultOpts) => (
    <Captcha {...defaultOpts} size={field.size} onClick={field.onClick} />
  ),
  search: (field, defaultOpts) => (
    <Search {...defaultOpts} onSearch={field.onSearch} />
  ),
  map: (field, defaultOpts) => (
    <MapView {...defaultOpts} onDrag={field.onDrag} />
  ),
  // IE10 not support
  editor: (field, defaultOpts) => {
    const com = require('./Editor');
    const Editor = com.default;
    return (
      <Editor
        {...defaultOpts}
        action={field.action}
        getUrl={field.getUrl}
        fileName={field.fileName}
      />
    );
  },
  switch: (field, defaultOpts) => (
    <Switch
      {...defaultOpts}
      form={null}
      checkedChildren={field.checkedChildren}
      unCheckedChildren={field.unCheckedChildren}
      addonAfter={field.addonAfter}
    />
  ),
  dynamicAddDel: (field, defaultOpts) => (
    <DynamicAddDel
      {...defaultOpts}
      fields={field.fields}
      closeType={field.closeType}
      addButton={field.addButton}
      addButtonText={field.addButtonText}
      addButtonIcon={field.addButtonIcon}
      addButtonDisabled={field.addButtonDisabled}
      onDelete={field.onDelete}
      limit={field.limit}
      hidden={field.hidden}
      length={field.length}
    />
  ),
  tabs: (field, defaultOpts) => (
    <Tabs
      {...defaultOpts}
      fields={field.fields}
      prefix={field.prefix}
      renderTabTile={field.renderTabTile}
      tabExtra={field.tabExtra}
      value={field.value}
    />
  ),
  table: (field, defaultOpts) => {
    if (!('sortable' in field)) {
      const newField = field;
      newField.sortable = true;
    }
    const T = field.sortable ? Table : Table2;
    const newDefaultOpts = {
      ...defaultOpts,
    };
    delete newDefaultOpts.form; // editable table has own form
    return (
      <T
        {...newDefaultOpts}
        title={field.title}
        rowKey={field.rowKey}
        columns={field.columns}
        dataSource={field.dataSource}
        page={field.page}
        rowClassName={field.rowClassName}
        size="small"
        search={field.search}
        checkbox={field.checkbox}
        footer={field.footer}
      />
    );
  },
  text: (field, defaultOpts) => (
    <AutoComplete
      {...defaultOpts}
      form={null}
      data-__meta={null}
      data-__field={null}
      allowClear
      autoFocus={field.autoFocus}
      inputWidth={field.inputWidth}
      addonBefore={field.addonBefore}
      addonAfter={field.addonAfter}
      antdAddonAfter={field.antdAddonAfter}
      antdAddonBefore={field.antdAddonBefore}
      href={field.href}
      render={field.render}
      readonly={field.readonly}
      icon={field.icon}
      data={field.data}
    />
  ),
  addressSearch: (field, defaultOpts) => <AddressSearch {...defaultOpts} />,
  addonBeforeAfter: (field, defaultOpts) => (
    <AddonBeforeAfter
      {...defaultOpts}
      inputWidth={field.inputWidth}
      addonBefore={field.addonBefore}
      addonAfter={field.addonAfter}
      readonly={field.readonly}
      disabled={field.disabled}
    />
  ),
  tag: (field, defaultOpts) => (
    <Tag
      {...defaultOpts}
      placeholder={field.placeholder}
      wrongValueArray={field.wrongValueArray}
    />
  ),
  time: (field, defaultOpts) => (
    <TimePicker
      {...defaultOpts}
      form={null}
      disabledHours={field.disabledHours}
      disabledMinutes={field.disabledMinutes}
      disabledSeconds={field.disabledSeconds}
      defaultOpenValue={field.defaultOpenValue}
      format={field.format || 'HH:mm:ss'}
    />
  ),
  timeRange: (field, defaultOpts) => (
    <TimeRange
      {...defaultOpts}
      names={field.names}
      format={field.format || 'HH:mm:ss'}
    />
  ),
  transfer: (field, defaultOpts) => (
    <Transfer
      {...defaultOpts}
      dataSource={field.data}
      targetKeys={field.targetKeys}
      selectedKeys={field.selectedKeys}
      render={field.renderItem || (item => item.title)}
      onChange={field.onChange}
      onSelectChange={field.onSelectChange}
    />
  ),
  tree: (field, defaultOpts) => (
    <Tree
      {...defaultOpts}
      data={field.data}
      onCheck={field.onCheck}
      valueKey={field.valueKey}
      title={field.title}
      checkedKeys={field.checkedKeys}
      treeNodeDisabled={field.treeNodeDisabled}
      hideCheckBox={field.hideCheckBox}
      checkStrictly={field.checkStrictly}
      canCheckAll={field.canCheckAll}
    />
  ),
  treeSelect: (field, defaultOpts) => (
    <TreeSelect
      {...defaultOpts}
      treeData={field.data}
      allowClear={field.allowClear}
      loadData={field.loadData}
      maxTagCount={field.maxTagCount}
      multiple={field.multiple}
      showSearch={field.showSearch}
      onChange={field.onChange}
      onSearch={field.onSearch}
      onSelect={field.onSelect}
      treeNodeFilterProp={field.treeNodeFilterProp}
      filterTreeNode={field.filterTreeNode}
      fieldNames={field.fieldNames}
    />
  ),
  color: (field, defaultOpts) => (
    <ColorPicker
      {...defaultOpts}
      isCircle={field.isCircle}
      colors={field.colors}
    />
  ),
  cascader: (field, defaultOpts) => {
    return (
      <Cascader
        {...defaultOpts}
        loadData={field.loadData}
        fieldNames={field.fieldNames}
        changeOnSelect={field.changeOnSelect}
        options={field.options}
        getPopupContainer={node => node.parentNode}
      />
    );
  },
};

export const geneBox = (fld, opts = {}) => {
  const field = fld;

  field.label = field.label || '';
  field.cname = field.cname || '';

  // deal with placeholder
  const phMap = {
    date: '请选择日期',
    address: '请选择地址',
    datetime: '请选择时间',
    dateRange: ['请选择开始日期', '请选择结束日期'],
    time: '请选择时间',
    timeRange: ['请选择开始时间', '请选择结束时间'],
    month: '请选择月份',
    datetimeRange: ['请选择开始时间', '请选择结束时间'],
    monthRange: ['请选择开始月份', '请选择结束月份'],
    select: `请选择${field.label || field.cname}`,
    radio: `请选择${field.label || field.cname}`,
    checkbox: `请选择${field.label || field.cname}`,
  };
  let placeholder =
    field.placeholder ||
    phMap[field.type] ||
    `请输入${(field.label.trim() || field.cname).replace(/\(.*\)/, '')}`;
  placeholder = field.disabled || field.readonly ? '-' : placeholder;

  // combine with options from outside
  const defaultOpts = {
    size: field.size || 'default',
    ...opts,
    disabled: field.disabled,
    name: field.name,
    label: field.label,
    placeholder,
    required: field.allRequired || field.required,
    // allRequired: field.allRequired,
    unit: field.unit,
    className: field.className,
    compRef: field.ref,
    onBlur: field.onBlur,
    onPressEnter: field.onPressEnter,
    hidden: field.hidden,
    showtime: field.showTime,
    format: field.format,
  };
  if (field.onChange) {
    defaultOpts.onChange = field.onChange;
  }

  if (field.dropdownRender) {
    defaultOpts.dropdownRender = field.dropdownRender;
  }
  const type = field.component ? 'default' : field.type || 'text';

  return components[type](field, defaultOpts);
};

// layout, provide three mode, default/simple/long, or you can change it as you like
const doLayout = (field, itemLayout, csp) => {
  let fil = itemLayout
    ? {
        labelCol: itemLayout.labelCol.span
          ? { span: itemLayout.labelCol.span }
          : itemLayout.labelCol,
        wrapperCol: itemLayout.wrapperCol.span
          ? {
              span: itemLayout.wrapperCol.span,
            }
          : itemLayout.wrapperCol,
      }
    : {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 7,
        },
      };

  let cs = csp || 24;

  if (field.long) {
    cs = 24;
    fil = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
  }

  if (field.simple) {
    cs = 24;
    fil = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    };
  }

  if (field.double) {
    cs = 12;
    fil = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 14,
      },
    };
    if (field.double === 'right') {
      fil.pull = true;
    }
  }

  if (field.hideLabel) {
    fil = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24,
      },
    };
  }

  typeof field.colSpan === 'number' && (cs = field.colSpan);
  typeof field.labelSpan === 'number' && (fil.labelCol.span = field.labelSpan);
  typeof field.wrapperSpan === 'number' &&
    (fil.wrapperCol.span = field.wrapperSpan);

  if (field.type === 'title') {
    cs = 24;
    fil = {};
  }

  return {
    fil,
    cs,
  };
};

const addRequiredRule = (field, msgLabel, rules) => {
  if (field.required) {
    let msgPefix = '请输入';
    if (
      // eslint-disable-next-line max-len
      [
        'date',
        'datetime',
        'dateRange',
        'datetimeRange',
        'select',
        'radio',
        'checkbox',
        'table',
        'color',
      ].indexOf(field.type) > -1
    ) {
      msgPefix = '请选择';
    }
    if (/^(image|file)$/.test(field.type)) {
      msgPefix = '请上传';
    }

    const rule = {
      required: true,
      message:
        field.requiredMsg ||
        `${msgPefix}${field.type !== 'color' ? msgLabel : '颜色'}`,
    };

    if (!field.type || field.type === 'textarea') {
      rule.whitespace = true;
    }

    if (field.type === 'map') {
      rule.required = false;
    }
    // 'integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'
    if (field.valueType) {
      rule.type = field.valueType;
    }

    rules.push(rule);
  }
  if (field.allRequired) {
    if (field.type === 'datetimeRange' || field.type === 'dateRange') {
      if (!field.validator) {
        rules.push({
          validator: (r, value, cbc) => {
            if (typeof value === 'object' && !value[0]) {
              cbc(`请选择开始${msgLabel}`);
            } else if (typeof value === 'object' && !value[1]) {
              cbc(`请选择结束${msgLabel}`);
            }
            cbc();
          },
        });
      }
    }
  }
};

const addMMNumberRule = (field, msgLabel, rules) => {
  const transform = v => {
    if (typeof v === 'number') {
      return `${v}`;
    }
    return v;
  };
  if (typeof field.max === 'number') {
    rules.push({
      max: field.max,
      message: `${msgLabel}最大为${field.max}位`,
      transform,
    });
  }
  if (typeof field.min === 'number') {
    rules.push({
      min: field.min,
      message: `${msgLabel}最小为${field.min}位`,
      transform,
    });
  }
};

const addMMOtherRule = (field, msgLabel, rules) => {
  if (typeof field.max === 'number') {
    rules.push({
      validator: (rule, value, cbc) => {
        if (
          typeof value === 'number' &&
          field.max < +value / (field.reduce || 1)
        ) {
          cbc(
            `${msgLabel}最大为${field.max.toFixed(
              typeof field.precision === 'number' ? field.precision : 2
            )}`
          );
        }
        cbc();
      },
    });
  }
  if (typeof field.min === 'number') {
    rules.push({
      validator: (rule, value, cbc) => {
        if (
          typeof value === 'number' &&
          field.min > +value / (field.reduce || 1)
        ) {
          cbc(
            `${msgLabel}最小为${field.min.toFixed(
              typeof field.precision === 'number' ? field.precision : 2
            )}`
          );
        }
        cbc();
      },
    });
  }
};

const addMinMaxRule = (field, msgLabel, rules) => {
  if (field.type === 'tag') {
    rules.push({
      validator: (rule, val = [], cbk) => {
        if (typeof field.min === 'number' && val.length < field.min) {
          cbk(`${msgLabel}最小为${field.min}个`);
        } else if (typeof field.max === 'number' && val.length > field.max) {
          cbk(`${msgLabel}最大为${field.max}个`);
        }
        cbk();
      },
    });
  } else if (field.type !== 'number') {
    if (field.length) {
      const [minLength, maxLength] = field.length;
      rules.push({
        validator: (rule, val, cbk) => {
          const value = (val || '').toString();
          if (value && (value.length < minLength || value.length > maxLength)) {
            cbk(`${msgLabel}为${minLength}~${maxLength}位`);
          }
          cbk();
        },
      });
    } else {
      addMMNumberRule(field, msgLabel, rules);
    }
  } else if (field.type === 'number') {
    addMMOtherRule(field, msgLabel, rules);
  }
};

const addShortcutRule = (field, rules) => {
  if (field.pattern) {
    rules.push({ pattern: field.pattern, message: field.patternMsg });
  }
  if (field.telPhone) {
    rules.push({
      pattern: /^[0-9]{3,4}-?\d{7,8}$/,
      message: '请输入正确的电话座机号',
    });
  }
  if (field.phone) {
    rules.push({ pattern: /^1[0-9]{10}$/, message: '请输入正确的手机格式' });
  }
  if (field.email) {
    rules.push({
      pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
      message: '请输入正确的邮箱格式',
    });
  }
  if (field.number) {
    rules.push({ pattern: /^\d+$/, message: '请输入数字' });
  }
  if (field.ID) {
    rules.push({
      pattern: new RegExp(`${
        /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|/.source
      }
          ${
            /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
              .source
          }`),
      message: '身份证格式有误',
    });
  }
  if (field.char) {
    rules.push({
      pattern: /^[a-zA-Z0-9]+$/,
      message: '请输入字母或数字',
    });
  }
  if (field.charLimit) {
    rules.push({
      pattern: /^[\w\u4e00-\u9fa5`~!@#$%^&*()_+<>?:"{},./\\;'[\]·！#￥（——）：；“”‘、，|《。》？、\-【】[\]「」『』\n\s]*$/,
      message: '请输入中文、字母、数字或符号',
    });
  }
};

// rule
const doRule = fld => {
  const field = fld;
  if (!field.max && !field.component && !field.type) {
    field.max = 60; // default max length
  }
  const rules = [];
  if (
    field.disabled ||
    field.readonly ||
    (field.hidden && !field.search) ||
    field.type === 'display'
  ) {
    // makesure if the same name field switch the value is invalid, it seems to get the value at the first time
    rules.push({
      required: false,
    });
  } else {
    let msgLabel = '';
    if (typeof field.label === 'string') {
      msgLabel = field.label.replace(/\(.*\)/, '').trim();
    }

    if (!msgLabel) {
      msgLabel = field.cname || field.placeholder;
    }

    if (field.validator) {
      rules.push({ validator: field.validator });
    }

    // required
    addRequiredRule(field, msgLabel, rules);

    // min, max, number is different
    addMinMaxRule(field, msgLabel, rules);

    // shortcut rule
    addShortcutRule(field, rules);
  }

  return rules;
};

const doStyle = field => {
  // combine style and set hidden
  let styles = {};
  if (!field.search && field.hidden) {
    styles.display = 'none';
  }
  if (field.style) {
    styles = {
      ...styles,
      ...field.style,
    };
  }
  return styles;
};

const doValidate = (field, form, validateDisabled) => {
  const { getFieldError, isFieldTouched } = form;
  let fieldError = getFieldError(field.name);
  if (validateDisabled) {
    fieldError = isFieldTouched(field.name) && fieldError;
  }
  const validateStatus = fieldError ? 'error' : '';
  return {
    validateStatus,
    help: fieldError || '',
  };
};

const createFormItem = opts => {
  const { field, form, values } = opts;
  let { formItemLayout, colSpan } = opts;
  // just compatible with the low version
  if (field.dataIndex) {
    field.name = field.dataIndex;
  }
  if (field.title && !('label' in field)) {
    field.label = field.title;
  }
  if (field.allRequired) {
    field.required = field.allRequired;
  }

  const layout = doLayout(field, formItemLayout, colSpan);
  formItemLayout = layout.fil;
  colSpan = layout.cs;

  const styles = doStyle(field);

  // special class
  let className = (field.className && `${field.className}-form-item`) || '';
  if (!field.label || field.label === ' ') {
    className += ' item-no-required';
    if (!('colon' in field)) {
      field.colon = false;
    }
  }

  if (field.float) {
    className += ' form-item-float';
  }

  if (field.readonly) {
    className += ' form-item-readonly';
  }

  let children;
  if (field.type === 'title') {
    children = (
      <Col
        span={24}
        key={field.label}
        style={{
          ...styles,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className={`ant-form-title ${className}`}>
          <span>
            {typeof field.label === 'object' ? field.label : `${field.label}`}
          </span>
          {field.extra}
        </div>
      </Col>
    );
  } else if (field.type === 'custom') {
    children = field.children;
  }

  const createInner = (fld, value) => {
    const labelCol = !fld.float ? { ...formItemLayout.labelCol } : undefined;
    const wrapperCol = !fld.float
      ? { ...formItemLayout.wrapperCol }
      : undefined;
    typeof fld.labelSpan === 'number' && (labelCol.span = fld.labelSpan);
    typeof fld.wrapperSpan === 'number' && (wrapperCol.span = fld.wrapperSpan);
    let innerClassName = fld.items
      ? `${className} form-item-group`
      : `${className} ${fld.className || ''}`;
    innerClassName += fld.disabled ? ' form-item-disabled' : '';
    const noFormItem =
      field.type === 'dynamicAddDel' ||
      field.type === 'tabs' ||
      ((field.component || field.html) && !field.name);

    let label = fld.label;
    if (fld.labelExtra) {
      label = (
        <span>
          {label}
          {fld.labelExtra}
        </span>
      );
    }

    return !noFormItem ? (
      <FormItem
        key={fld.name}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        label={
          fld.help ? (
            <span>
              {label}&nbsp;
              <Tooltip title={fld.help}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          ) : (
            label
          )
        }
        className={innerClassName}
        style={{
          ...styles,
          float: fld.float ? 'left' : '',
          clear: fld.clear ? 'left' : '',
        }}
        colon={'colon' in fld ? fld.colon : !!fld.label}
        extra={fld.extra}
        {...doValidate(fld, form, opts.validateDisabled)}
      >
        {fld.items &&
          fld.items.map(item => {
            const newItem = { ...item };
            if (!('disabled' in newItem)) {
              newItem.disabled = !!fld.disabled;
            }
            newItem.className = `${newItem.className || ''} form-item-item`;
            return (
              <Col
                span={newItem.colSpan || 24}
                key={newItem.name || newItem.key}
                className={newItem.containerClassName || ''}
              >
                {createInner(newItem)}
              </Col>
            );
          })}
        {!fld.items &&
          form.getFieldDecorator(fld.name, {
            rules: doRule(fld),
            initialValue: value,
            validateFirst: true,
          })(geneBox(fld, { form }))}
      </FormItem>
    ) : (
      <Row style={{ ...styles }}>
        <Col span={colSpan.span} md={{ push: fld.push || 0 }}>
          {geneBox(fld, { form })}
        </Col>
      </Row>
    );
  };

  const containerStyle = {
    clear: field.br ? 'both' : 'none',
    ...(field.containerStyle || {}),
  };

  // every field sync value from props, for the reason setState won't invoke componentWillReceiveProps
  let val = field.value;
  if (values) {
    const value = values[field.name];
    if (typeof value === 'object' && value !== null && 'value' in value) {
      val = value.value;
    } else {
      val = value;
    }
  }

  return field.type === 'title' ? (
    children
  ) : field.float ? (
    createInner(field, val)
  ) : (
    <Col
      span={colSpan}
      key={field.name || field.key}
      pull={formItemLayout.pull && 2}
      style={containerStyle}
      className={field.containerClassName || ''}
    >
      {createInner(field, val)}
    </Col>
  );
};

export default createFormItem;
