// makesure the props.changeRecord
const onFieldsChange = (props, flds, allFlds) => {
  props.changeRecord && props.changeRecord({
    ...allFlds,
  }, flds);
};

export default onFieldsChange;
