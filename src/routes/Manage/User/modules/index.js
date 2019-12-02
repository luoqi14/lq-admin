import { message } from 'antd';
import fetch from '../../../../util/fetch';
import {
  createAction,
  mapToAntdFields,
  mapToSendData,
  JSON_CONTENT_TYPE,
} from '../../../../util';
import { moduleReducer } from '../../../../store/reducers';
// ------------------------------------
// Constants
// ------------------------------------
const USER_REQUEST = 'USER_REQUEST';
const USER_SUCCESS = 'USER_SUCCESS';
const USER_FAILURE = 'USER_FAILURE';
const USER_SEARCH_CHANGE = 'USER_SEARCH_CHANGE';
const USER_ACTIVE_REQUEST = 'USER_ACTIVE_REQUEST';
const USER_ACTIVE_SUCCESS = 'USER_ACTIVE_SUCCESS';
const USER_ACTIVE_FAILURE = 'USER_ACTIVE_FAILURE';
const USER_AREA_REQUEST = 'USER_AREA_REQUEST';
const USER_AREA_SUCCESS = 'USER_AREA_SUCCESS';
const USER_AREA_FAILURE = 'USER_AREA_FAILURE';
const USER_DEPARTMENT_REQUEST = 'USER_DEPARTMENT_REQUEST';
const USER_DEPARTMENT_SUCCESS = 'USER_DEPARTMENT_SUCCESS';
const USER_DEPARTMENT_FAILURE = 'USER_DEPARTMENT_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: params => ({
    types: [USER_REQUEST, USER_SUCCESS, USER_FAILURE],
    callAPI: () =>
      fetch(
        '/user/list',
        mapToSendData(params, data => {
          const newData = { ...data };
          const areaId = newData.areaId || [];
          newData.areaId = areaId[areaId.length - 1];
          const deptId = newData.deptId || [];
          newData.deptId = deptId[deptId.length - 1];
          return newData;
        }),
        JSON_CONTENT_TYPE
      ),
    payload: params,
  }),
  changeSearch: createAction(USER_SEARCH_CHANGE, 'fields'),
  active: params => ({
    types: [USER_ACTIVE_REQUEST, USER_ACTIVE_SUCCESS, USER_ACTIVE_FAILURE],
    callAPI: () => fetch('/user/updateStatus', params, JSON_CONTENT_TYPE),
    payload: params,
  }),
  loadArea: params => ({
    types: [USER_AREA_REQUEST, USER_AREA_SUCCESS, USER_AREA_FAILURE],
    callAPI: () => fetch('/area/list', mapToSendData(params)),
    payload: params,
  }),
  loadDepartment: params => ({
    types: [
      USER_DEPARTMENT_REQUEST,
      USER_DEPARTMENT_SUCCESS,
      USER_DEPARTMENT_FAILURE,
    ],
    callAPI: () => fetch('/dept/list', params),
    payload: params,
  }),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USER_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [USER_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.rows,
    loading: false,
    page: {
      pageNo: action.pageNo,
      pageSize: action.pageSize,
      total: action.data.total,
    },
  }),
  [USER_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [USER_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [USER_ACTIVE_REQUEST]: state => ({
    ...state,
    loading: true,
  }),
  [USER_ACTIVE_SUCCESS]: state => {
    message.success('操作成功');
    return {
      ...state,
      loading: false,
    };
  },
  [USER_ACTIVE_FAILURE]: state => ({
    ...state,
    loading: false,
  }),
  [USER_AREA_REQUEST]: state => ({
    ...state,
    areaLoading: true,
  }),
  [USER_AREA_SUCCESS]: (state, action) => {
    return {
      ...state,
      areaLoading: false,
      areaData: action.data,
    };
  },
  [USER_AREA_FAILURE]: state => ({
    ...state,
    areaLoading: false,
  }),
  [USER_DEPARTMENT_REQUEST]: state => ({
    ...state,
    departmentLoading: true,
  }),
  [USER_DEPARTMENT_SUCCESS]: (state, action) => {
    return {
      ...state,
      departmentLoading: false,
      departmentData: action.data,
    };
  },
  [USER_DEPARTMENT_FAILURE]: state => ({
    ...state,
    departmentLoading: false,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  departmentLoading: false,
  departmentData: [],
  areaLoading: false,
  areaData: [],
  loading: false,
  searchParams: {},
  page: {
    pageNo: 1,
    pageSize: 10,
  },
  columns: [
    {
      label: '用户名称',
      name: 'name',
      search: true,
    },
    {
      label: '所属组织',
      name: 'deptId',
      type: 'address',
      data: 'props:departmentData',
      loading: 'props:departmentLoading',
      fieldNames: { label: 'name', value: 'id' },
      search: true,
      hidden: true,
      placeholder: '请选择组织',
      changeOnSelect: true,
    },
    {
      label: '所属组织',
      name: 'deptName',
    },
    {
      label: '所属片区',
      name: 'areaId',
      type: 'address',
      data: 'props:areaData',
      loading: 'props:areaLoading',
      fieldNames: { label: 'name', value: 'id' },
      search: true,
      hidden: true,
      placeholder: '请选择片区',
      changeOnSelect: true,
    },
    {
      label: '所属片区',
      name: 'areaName',
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
      label: '登录账号',
      name: 'phone',
      search: true,
    },
    {
      label: '创建者',
      name: 'createUserName',
    },
    {
      label: '创建时间',
      name: 'createTime',
      type: 'datetime',
    },
    {
      label: '更新者',
      name: 'updateUserName',
    },
    {
      label: '更新时间',
      name: 'updateTime',
      type: 'datetime',
    },
    // {
    //   label: '状态',
    //   name: 'status',
    //   type: 'select',
    //   valueType: 'number',
    //   data: {
    //     1: '正常',
    //     2: '冻结',
    //   },
    //   search: true,
    // },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
  buttons: [
    {
      label: '新增',
      onClick: 'func:btnClick',
    },
  ],
};
initialState.searchParams = mapToAntdFields(
  initialState.columns.filter(col => col.search)
);

export default function reducer(state = initialState, action = {}) {
  return moduleReducer(state, action, initialState, ACTION_HANDLERS);
}
