// makesure the props.values
// only support path a.b or a[0] or a[0].b
import { Form } from 'antd';
import set from 'lodash/set';
import get from 'lodash/get';

const isField = (field) => typeof field === 'object' && field !== null && 'value' in field;
const isObject = (field) => typeof field === 'object' && field !== null;
const isArray = (field) => Object.prototype.toString.call(field) === '[object Array]';
const isPath = (key, props) => {
  const names = props.fields.map((field) => field.name);
  const nameStr = names.join('');
  return nameStr.indexOf(`${key}[`) > -1 ||
    nameStr.indexOf(`${key}.`) > -1 ||
    key.indexOf('Temp*') > -1;
};

const decorateFields = (rawFields = {}, props) => {
  const keys = Object.keys(rawFields);
  const fields = {};
  keys.forEach((key) => {
    const field = rawFields[key];
    if (isField(field)) {
      fields[key] = Form.createFormField(field);
    } else if (isArray(field)) {
      if (isPath(key, props)) {
        fields[key] = field.map((fld) => {
          if (isField(fld)) {
            return Form.createFormField(fld);
          } else if (isObject(fld)) {
            return decorateFields(fld, props);
          }
          return Form.createFormField({ value: fld });
        });
      } else {
        fields[key] = Form.createFormField({ value: field });
      }
    } else if (isObject(field)) {
      if (!fields[key]) {
        fields[key] = {};
      }
      fields[key] = decorateFields(field, props);
    } else {
      fields[key] = Form.createFormField({ value: field });
    }
  });
  return fields;
};

const mapPropsToFields = (props = {}) => {
  const {
    fields = [],
  } = props;

  const res = fields.filter((f) => {
    return f.type !== 'title';
  }).reduce((acc, field) => {
    const changedField = get(acc, field.name, field);
    const {
      dirty,
      errors,
      touched,
      validating,
      value,
    } = changedField;
    const newField = {
      dirty, errors, touched, validating, ...field, value, 
    };
    if (newField.disabled) {
      newField.errors = null;
    }
    if (newField.type === 'dynamicAddDel') {
      const val = newField.value || [];
      const fld = newField.fields || [];
      val.forEach((v, i) => {
        fld.forEach((f) => {
          const name = f.name || f.nameMap;
          let oldField = get(acc, `${field.name}Temp*[${i}].${name}`);
          if (oldField) {
            oldField.value = v[name];
          } else {
            oldField = {};
            oldField.value = v[name];
          }
          set(acc, `${field.name}Temp*[${i}].${name}`, Form.createFormField(oldField));
        });
      });
    }
    return set(acc, field.name, Form.createFormField(newField));
  }, decorateFields(props.values, props));

  return res;
};

export default mapPropsToFields;
