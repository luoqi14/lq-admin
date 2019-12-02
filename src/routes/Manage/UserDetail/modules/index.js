import { message } from 'antd';
import fetch from '../../../../util/fetch';
import {
  createAction,
  JSON_CONTENT_TYPE,
  mapReceivedData,
  mapToAntdFields,
} from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const USERDETAIL_REQUEST = 'USERDETAIL_REQUEST';
const USERDETAIL_SUCCESS = 'USERDETAIL_SUCCESS';
const USERDETAIL_FAILURE = 'USERDETAIL_FAILURE';
const USERDETAIL_RECORD_CHANGE = 'USERDETAIL_RECORD_CHANGE';
const USERDETAIL_RESET = 'USERDETAIL_RESET';
const USERDETAIL_ROLE_REQUEST = 'USERDETAIL_ROLE_REQUEST';
const USERDETAIL_ROLE_SUCCESS = 'USERDETAIL_ROLE_SUCCESS';
const USERDETAIL_ROLE_FAILURE = 'USERDETAIL_ROLE_FAILURE';
const USERDETAIL_SAVE_REQUEST = 'USERDETAIL_SAVE_REQUEST';
const USERDETAIL_SAVE_SUCCESS = 'USERDETAIL_SAVE_SUCCESS';
const USERDETAIL_SAVE_FAILURE = 'USERDETAIL_SAVE_FAILURE';
const USERDETAIL_DEPARTMENT_REQUEST = 'USERDETAIL_DEPARTMENT_REQUEST';
const USERDETAIL_DEPARTMENT_SUCCESS = 'USERDETAIL_DEPARTMENT_SUCCESS';
const USERDETAIL_DEPARTMENT_FAILURE = 'USERDETAIL_DEPARTMENT_FAILURE';
const USERDETAIL_AREA_REQUEST = 'USERDETAIL_AREA_REQUEST';
const USERDETAIL_AREA_SUCCESS = 'USERDETAIL_AREA_SUCCESS';
const USERDETAIL_AREA_FAILURE = 'USERDETAIL_AREA_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: params => ({
    types: [USERDETAIL_REQUEST, USERDETAIL_SUCCESS, USERDETAIL_FAILURE],
    callAPI: () =>
      fetch('/user/detail', params, { ...JSON_CONTENT_TYPE, urlParam: true }),
    payload: params,
  }),
  changeRecord: createAction('USERDETAIL_RECORD_CHANGE', 'fields'),
  reset: createAction('USERDETAIL_RESET'),
  loadRole: params => ({
    types: [
      USERDETAIL_ROLE_REQUEST,
      USERDETAIL_ROLE_SUCCESS,
      USERDETAIL_ROLE_FAILURE,
    ],
    callAPI: () => fetch('/role/list', params, JSON_CONTENT_TYPE),
    payload: params,
  }),
  save: params => ({
    types: [
      USERDETAIL_SAVE_REQUEST,
      USERDETAIL_SAVE_SUCCESS,
      USERDETAIL_SAVE_FAILURE,
    ],
    callAPI: () => fetch('/user/update', params, JSON_CONTENT_TYPE),
    payload: params,
  }),
  loadDepartment: params => ({
    types: [
      USERDETAIL_DEPARTMENT_REQUEST,
      USERDETAIL_DEPARTMENT_SUCCESS,
      USERDETAIL_DEPARTMENT_FAILURE,
    ],
    callAPI: () => fetch('/dept/list', params),
    payload: params,
  }),
  loadArea: params => ({
    types: [
      USERDETAIL_AREA_REQUEST,
      USERDETAIL_AREA_SUCCESS,
      USERDETAIL_AREA_FAILURE,
    ],
    callAPI: () => fetch('/area/list', params),
    payload: params,
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USERDETAIL_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [USERDETAIL_SUCCESS]: (state, action) => {
    return {
      ...state,
      record: mapReceivedData(action.data, data => {
        const newData = { ...data };
        if (newData.deptId == '0') {
          newData.deptId = null;
        }
        if (newData.identify == '0') {
          newData.identify = null;
        }
        if (newData.areaId == '0') {
          newData.areaId = null;
        }
        return newData;
      }),
      loading: false,
    };
  },
  [USERDETAIL_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [USERDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [USERDETAIL_RESET]: state => ({
    ...state,
    record: { ...mapToAntdFields(state.fields) },
  }),
  [USERDETAIL_ROLE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [USERDETAIL_ROLE_SUCCESS]: (state, action) => {
    return {
      ...state,
      roleData: action.data.rows,
      loading: false,
    };
  },
  [USERDETAIL_ROLE_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [USERDETAIL_SAVE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [USERDETAIL_SAVE_SUCCESS]: state => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [USERDETAIL_SAVE_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [USERDETAIL_DEPARTMENT_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [USERDETAIL_DEPARTMENT_SUCCESS]: (state, action) => {
    return {
      ...state,
      loading: false,
      departmentData: action.data,
    };
  },
  [USERDETAIL_DEPARTMENT_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [USERDETAIL_AREA_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [USERDETAIL_AREA_SUCCESS]: (state, action) => {
    return {
      ...state,
      loading: false,
      areaData: action.data,
    };
  },
  [USERDETAIL_AREA_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  roleData: [],
  departmentData: [],
  areaData: [],
  fields: [
    {
      label: '基础信息',
      type: 'title',
    },
    {
      label: 'ID',
      name: 'id',
      hidden: true,
    },
    {
      label: 'ID',
      name: 'userId',
      hidden: true,
    },
    {
      label: '所属组织',
      name: 'deptId',
      type: 'treeSelect',
      showSearch: false,
      data: 'props:departmentData',
      fieldNames: {
        value: 'id',
        title: 'name',
      },
      placeholder: '请选择所属组织',
      changeOnSelect: true,
    },
    {
      label: '所属片区',
      name: 'areaId',
      type: 'treeSelect',
      showSearch: false,
      data: 'props:areaData',
      fieldNames: {
        value: 'id',
        title: 'name',
      },
      placeholder: '请选择所属片区',
      changeOnSelect: true,
    },
    {
      label: '用户身份',
      name: 'identify',
      type: 'select',
      data: {
        1: '辅警',
        2: '民警',
      },
    },
    {
      label: '用户名称',
      name: 'name',
    },
    {
      label: '登录账号（手机号）',
      name: 'phone',
      phone: true,
    },
    {
      label: '性别',
      name: 'gender',
      type: 'radio',
      data: {
        '-1': '未知',
        1: '男',
        2: '女',
      },
      value: '1',
    },
    {
      label: '头像',
      name: 'avatarUrl',
      type: 'image',
      action: '/upload',
      mostPic: 1,
      tokenSeparators: ',',
      required: false,
    },
    {
      label: '身份证',
      name: 'idCard',
      ID: true,
    },
    {
      label: '党员',
      name: 'partyFlag',
      type: 'radio',
      data: [
        {
          id: '1',
          label: '是',
        },
        {
          id: '0',
          label: '否',
        },
      ],
    },
    {
      label: '生日',
      name: 'birthday',
      type: 'date',
      required: false,
    },
    {
      label: '类型',
      name: 'type',
      hidden: true,
      value: '1',
    },
    {
      label: '设置角色',
      type: 'title',
    },
    {
      label: '角色',
      name: 'userRoleIdList',
      type: 'checkbox',
      data: 'props:roleData',
      valueName: 'id',
      displayName: 'name',
      checkAll: true,
      wrapperSpan: 20,
    },
  ],
  buttons: [
    {
      label: '取消',
      type: 'default',
      onClick: 'func:cancel',
    },
    {
      label: '保存',
      onClick: 'func:submit',
    },
  ],
  typeMap: {
    1: '新增',
    2: '编辑',
    3: '详情',
  },
};

initialState.record = mapToAntdFields(initialState.fields);
initialState.record.platformList = [];

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
