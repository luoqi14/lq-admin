import { ArrayUtil } from '@xinguang/common-tool';
import fetch from '@f12/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const @@MODULENAME@@_REQUEST = '@@MODULENAME@@_REQUEST';
const @@MODULENAME@@_SUCCESS = '@@MODULENAME@@_SUCCESS';
const @@MODULENAME@@_FAILURE = '@@MODULENAME@@_FAILURE';
const @@MODULENAME@@_SEARCH_CHANGE = '@@MODULENAME@@_SEARCH_CHANGE';
const @@MODULENAME@@_LOCK_REQUEST = '@@MODULENAME@@_LOCK_REQUEST';
const @@MODULENAME@@_LOCK_SUCCESS = '@@MODULENAME@@_LOCK_SUCCESS';
const @@MODULENAME@@_LOCK_FAILURE = '@@MODULENAME@@_LOCK_FAILURE';
const @@MODULENAME@@_ROW_SELECT = '@@MODULENAME@@_ROW_SELECT';
const @@MODULENAME@@_ROW_CLEAR = '@@MODULENAME@@_ROW_CLEAR';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  load: (params) => ({
    types: [@@MODULENAME@@_REQUEST, @@MODULENAME@@_SUCCESS, @@MODULENAME@@_FAILURE],
    callAPI: () => fetch('/users', mapToSendData(params)),
    payload: params,
  }),
  changeSearch: createAction('@@MODULENAME@@_SEARCH_CHANGE', 'fields'),
  lock: (params) => ({
    types: [@@MODULENAME@@_LOCK_REQUEST, @@MODULENAME@@_LOCK_SUCCESS, @@MODULENAME@@_LOCK_FAILURE],
    callAPI: () => fetch('/users/lock', params),
    payload: params,
  }),
  selectRows: createAction('@@MODULENAME@@_ROW_SELECT', 'changedRows', 'selected'),
  clearSelectedKeys: createAction('@@MODULENAME@@_ROW_CLEAR'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  loading: false,
  data: [],
  sorter: {
    columnKey: 'createDatetime',
    order: 'descend',
  },
  selectedRowKeys: [],
  columns: [
    {
      label: '工号',
      name: 'id',
      sorter: true,
    },
    {
      label: '图片',
      name: 'avatar',
      render: 'func:renderImg',
    },
    {
      label: '员工姓名',
      name: 'name',
      search: true,
      sorter: true,
    },
    {
      label: '联系电话',
      name: 'phone',
      search: true,
      sorter: true,
    },
    {
      label: '员工类型',
      name: 'type',
      search: true,
      type: 'select',
      data: { 1: '店长', 2: '快递员' },
      sorter: true,
      value: '1',
    },
    {
      label: '所属门店',
      name: 'storeId',
      search: true,
      type: 'select',
      data: { 1: '计量问问店', 2: '杭师问问店' },
      sorter: true,
    },
    {
      label: '员工状态',
      name: 'status',
      search: true,
      type: 'select',
      data: { 1: '在职', 2: '离职' },
      sorter: true,
    },
    {
      label: '注册时间',
      name: 'createDatetime',
      type: 'datetimeRange',
      sorter: true,
    },
    {
      label: '操作',
      name: 'action',
      render: 'func:renderAction',
    },
  ],
  buttons: [{
    label: '批量注销',
    onClick: 'func:btnClick',
    disabled: 'func:btnDisable:run',
  }],
};
initialState.searchParams = mapToAntdFields(initialState.columns.filter((col) => col.search));

const ACTION_HANDLERS = {
  [@@MODULENAME@@_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [@@MODULENAME@@_SUCCESS]: (state, action) => ({
    ...state,
    data: action.data.list,
    loading: false,
    page: {
      pageNo: action.data.pageNo,
      pageSize: action.data.pageSize,
      total: action.data.total,
    },
    sorter: {
      columnKey: action.columnKey,
      order: action.order,
    },
  }),
  [@@MODULENAME@@_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [@@MODULENAME@@_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [@@MODULENAME@@_LOCK_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [@@MODULENAME@@_LOCK_SUCCESS]: (state, action) => {
    const data = state.data;
    const lockData = action.data;
    lockData.forEach((lockItem) => {
      const index = data.findIndex((item) => item.id === lockItem.id);
      data[index] = lockItem;
    });
    return {
      ...state,
      loading: false,
      data,
      selectedRowKeys: action.multi ? [] : state.selectedRowKeys,
    };
  },
  [@@MODULENAME@@_LOCK_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [@@MODULENAME@@_ROW_SELECT]: (state, action) => {
    let selectedRowKeys = [];
    if (action.selected) {
      selectedRowKeys =
        Array.from(new Set(state.selectedRowKeys.concat(action.changedRows.map((item) => (item.id)))));
    } else {
      selectedRowKeys = ArrayUtil.dislodge(state.selectedRowKeys, action.changedRows.map((item) => (item.id)));
    }
    return {
      ...state,
      selectedRowKeys,
    };
  },
  [@@MODULENAME@@_ROW_CLEAR] : (state) => ({
    ...state,
    selectedRowKeys: [],
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
