// makesure the props.values
// only support path a.b or a[0] or a[0].b
import { Form } from 'antd';
import set from 'lodash/set';
import get from 'lodash/get';
import { isFormField } from 'rc-form/es/createFormField';

const isField = field =>
  typeof field === 'object' &&
  field !== null &&
  'value' in field &&
  !isFormField(field.value);
const isObject = field => typeof field === 'object' && field !== null;
const isArray = field =>
  Object.prototype.toString.call(field) === '[object Array]';
const isPath = (key, props, value) => {
  const names = props.fields.map(field => {
    let name = field.name;
    if (field.fields) {
      // dynamic
      field.fields.forEach(f => {
        name += f.name;
      });
    }
    return name;
  });
  const nameStr = names.join('');
  const res =
    nameStr.indexOf(`${key}[`) > -1 ||
    nameStr.indexOf(`${key}.`) > -1 ||
    key.indexOf('Temp*') > -1;
  let res2;
  const checkFirst = props.values[key] && props.values[key][0];
  if (isObject(checkFirst)) {
    const firstKey = Object.keys(checkFirst)[0];
    if (isFormField(checkFirst[firstKey])) {
      res2 = true;
    }
  }
  let res3;
  if (value._path) {
    res3 = true;
  }
  let res4;
  const field = props.fields.find(i => i.name === key);
  if (field && field.type === 'dynamicAddDel') {
    res4 = true;
  }
  return res || res2 || res3 || res4;
};

const decorateFields = (rawFields = {}, props) => {
  const keys = Object.keys(rawFields);
  const fields = {};
  keys.forEach(key => {
    const field = rawFields[key];
    if (isField(field)) {
      fields[key] = Form.createFormField(field);
    } else if (isArray(field)) {
      if (isPath(key, props, field)) {
        fields[key.replace(/Temp\*/g, '')] = field.map(fld => {
          if (isField(fld)) {
            return Form.createFormField(fld);
          } else if (isObject(fld)) {
            if (isFormField(fld)) {
              return fld;
            }
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
      if (isFormField(field)) {
        fields[key] = field;
      } else {
        fields[key] = decorateFields(field, props);
      }
    } else {
      fields[key] = Form.createFormField({ value: field });
    }
  });
  return fields;
};

const mapPropsToFields = (props = {}) => {
  const { fields = [] } = props;

  const res = fields
    .filter(f => {
      return (
        f.type !== 'title' && f.type !== 'dynamicAddDel' && f.type !== 'tabs'
      );
    })
    .reduce((acc, field) => {
      const changedField = get(acc, field.name, field);
      const { dirty, errors, touched, validating, value } = changedField;
      const newField = {
        dirty,
        errors,
        touched,
        validating,
        ...field,
        value,
      };
      if (newField.disabled) {
        newField.errors = null;
      }
      return set(acc, field.name, Form.createFormField(newField));
    }, decorateFields(props.values, props));

  return res;
};

export default mapPropsToFields;
