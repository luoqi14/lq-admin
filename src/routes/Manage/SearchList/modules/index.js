import fetch from '../../../../util/fetch';
import { createAction, mapToSendData, mapToAntdFields } from '../../../../util';
import { moduleReducer } from '../../../../store/reducers';
// ------------------------------------
// Constants
// ------------------------------------
const SEARCHLIST_REQUEST = 'SEARCHLIST_REQUEST';
const SEARCHLIST_SUCCESS = 'SEARCHLIST_SUCCESS';
const SEARCHLIST_FAILURE = 'SEARCHLIST_FAILURE';
const SEARCHLIST_SEARCH_CHANGE = 'SEARCHLIST_SEARCH_CHANGE';
const SEARCHLIST_LOCK_REQUEST = 'SEARCHLIST_USERS_REQUEST';
const SEARCHLIST_LOCK_SUCCESS = 'SEARCHLIST_USERS_SUCCESS';
const SEARCHLIST_LOCK_FAILURE = 'SEARCHLIST_USERS_FAILURE';
const SEARCHLIST_ROW_SELECT = 'SEARCHLIST_ROW_SELECT';
const SEARCHLIST_ROW_CLEAR = 'SEARCHLIST_ROW_CLEAR';
// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  loadUsers: (params) => ({
    types: [SEARCHLIST_REQUEST, SEARCHLIST_SUCCESS, SEARCHLIST_FAILURE],
    callAPI: () => fetch('/users', mapToSendData(params)),
    payload: params,
  }),
  changeSearch: createAction('SEARCHLIST_SEARCH_CHANGE', 'fields'),
  lockUser: (params) => ({
    types: [SEARCHLIST_LOCK_REQUEST, SEARCHLIST_LOCK_SUCCESS, SEARCHLIST_LOCK_FAILURE],
    callAPI: () => fetch('/users/lock', params),
    payload: params,
  }),
  selectRows: createAction('SEARCHLIST_ROW_SELECT', 'changedRows', 'selected'),
  clearSelectedKeys: createAction('SEARCHLIST_ROW_CLEAR'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SEARCHLIST_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [SEARCHLIST_SUCCESS]: (state, action) => ({
    ...state,
    users: action.data.list,
    loading: false,
    page: {
      offset: action.data.offset,
      limit: action.data.limit,
      total: action.data.total,
    },
    sorter: {
      columnKey: action.columnKey,
      order: action.order,
    },
  }),
  [SEARCHLIST_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [SEARCHLIST_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [SEARCHLIST_LOCK_REQUEST] : (state) => ({
    ...state,
    loading: true,
  }),
  [SEARCHLIST_LOCK_SUCCESS]: (state, action) => {
    const { users } = state;
    const lockedUsers = action.data;
    lockedUsers.forEach((user) => {
      const index = users.findIndex((item) => item.id === user.id);
      users[index] = user;
    });
    return {
      ...state,
      loading: false,
      users,
      selectedRowKeys: action.multi ? [] : state.selectedRowKeys,
    };
  },
  [SEARCHLIST_LOCK_FAILURE]: (state) => ({
    ...state,
    loading: false,
  }),
  [SEARCHLIST_ROW_SELECT]: (state, action) => {
    let selectedRowKeys = [];
    if (action.selected) {
      selectedRowKeys =
        Array.from(new Set(state.selectedRowKeys.concat(action.changedRows.map((item) => (item.id)))));
    } else {
      selectedRowKeys = [];
    }
    return {
      ...state,
      selectedRowKeys,
    };
  },
  [SEARCHLIST_ROW_CLEAR] : (state) => ({
    ...state,
    selectedRowKeys: [],
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  users: [],
  sorter: {
    columnKey: 'createDatetime',
    order: 'descend',
  },
  page: {
    offset: 0,
    limit: 10,
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

export default function reducer(state = initialState, action = {}) {
  return moduleReducer(state, action, initialState, ACTION_HANDLERS);
}
