import { Form } from 'antd';
import moment from 'moment';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';

// ------------------------------------
// Constants
// ------------------------------------
const BASICDETAIL_USER_REQUEST = 'BASICDETAIL_USER_REQUEST';
const BASICDETAIL_USER_SUCCESS = 'BASICDETAIL_USER_SUCCESS';
const BASICDETAIL_USER_FAILURE = 'BASICDETAIL_USER_FAILURE';
const BASICDETAIL_SEARCH_CHANGE = 'BASICDETAIL_SEARCH_CHANGE';
const BASICDETAIL_RECORD_CHANGE = 'BASICDETAIL_RECORD_CHANGE';
const BASICDETAIL_SEARCH = 'BASICDETAIL_SEARCH';
const BASICDETAIL_RESET = 'BASICDETAIL_RESET';
const BASICDETAIL_CONFIRM = 'BASICDETAIL_CONFIRM';
const BASICDETAIL_TOGGLE = 'BASICDETAIL_TOGGLE';
const BASICDETAIL_SHOW = 'BASICDETAIL_SHOW';
const BASICDETAIL_IMG_CHANGE = 'BASICDETAIL_IMG_CHANGE';
const BASICDETAIL_REFRESH = 'BASICDETAIL_REFRESH';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  loadUser: params => ({
    types: [
      BASICDETAIL_USER_REQUEST,
      BASICDETAIL_USER_SUCCESS,
      BASICDETAIL_USER_FAILURE,
    ],
    callAPI: () => fetch('/users', params),
    payload: params,
  }),
  changeSearch: createAction('BASICDETAIL_SEARCH_CHANGE', 'fields'),
  changeRecord: createAction('BASICDETAIL_RECORD_CHANGE', 'fields'),
  search: createAction('BASICDETAIL_SEARCH', 'fields'),
  reset: createAction('BASICDETAIL_RESET'),
  confirm: createAction('BASICDETAIL_CONFIRM'),
  toggle: createAction('BASICDETAIL_TOGGLE'),
  show: createAction('BASICDETAIL_SHOW', 'visible', 'index'),
  changeImgs: createAction('BASICDETAIL_IMG_CHANGE', 'imgs'),
  refresh: createAction('BASICDETAIL_REFRESH'),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BASICDETAIL_USER_REQUEST]: (state, action) => ({
    ...state,
    user: {
      ...state.user,
      loading: true,
      query: action.name || '',
    },
  }),
  [BASICDETAIL_USER_SUCCESS]: (state, action) => {
    const { pageNo, pageSize, total } = action.data;
    let data = [];
    if (action.pageNo !== 1) {
      data = [...state.user.data, ...action.data.list];
    } else {
      data = [...action.data.list];
    }
    return {
      ...state,
      user: {
        ...state.user,
        loading: false,
        data,
        pageNo,
        pageSize,
        count: total,
      },
    };
  },
  [BASICDETAIL_USER_FAILURE]: state => ({
    ...state,
    user: {
      ...state.user,
      loading: false,
    },
  }),
  [BASICDETAIL_SEARCH_CHANGE]: (state, action) => ({
    ...state,
    searchParams: action.fields,
  }),
  [BASICDETAIL_RECORD_CHANGE]: (state, action) => ({
    ...state,
    record: action.fields,
  }),
  [BASICDETAIL_SEARCH]: state => ({
    ...state,
  }),
  [BASICDETAIL_RESET]: state => ({
    ...state,
    searchParams: {},
  }),
  [BASICDETAIL_CONFIRM]: state => ({
    ...state,
  }),
  [BASICDETAIL_TOGGLE]: state => ({
    ...state,
    disabled: !state.disabled,
  }),
  [BASICDETAIL_SHOW]: (state, action) => ({
    ...state,
    visible: action.visible,
    index: action.index,
  }),
  [BASICDETAIL_IMG_CHANGE]: (state, action) => ({
    ...state,
    imgs: action.imgs,
  }),
  [BASICDETAIL_REFRESH]: state => ({
    ...state,
    record: {
      ...state.record,
      number1: {
        value: 1000000000000,
      },
    },
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  visible: false,
  index: 0,
  imgs: ['/logo.png', '/404.png'],
  user: {
    data: [],
    query: '',
    loading: false,
  },
  searchParams: {},
  record: {
    tag1: ['11', '22'], // or { value: [11, 22] }
    footers: [{ value: '1' }, { value: '2' }], // [1, 2] can means { value: [1, 2] } or [{value: 1}, {value: 2}]
    teacher: {
      name: '3',
    },
    teachers: [{ name: '4' }],
    dynamic1: [
      { name: Form.createFormField({ value: 'name1' }) },
      { name: Form.createFormField({ value: 'name2' }) },
    ],
    title: 'tt',
    switch1: true,
    date2: '1970-01-01',
    select1: {
      value: '1',
    },
    number1: 10000,
    image1: '/logo.png',
    file1: '/logo.png',
    table1: [
      {
        id: '1',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '2',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '3',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '4',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '5',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '6',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '7',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '8',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '9',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '10',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '11',
        col1: 'col1',
        col2: 'col2',
      },
      {
        id: '12',
        col1: 'col1',
        col2: 'col2',
      },
    ],
    map1: [120.21201, 30.2084],
    address1: {
      value: ['浙江省', '杭州市', '滨江区'],
    },
    datetimeRange1: {
      value: [moment('2017-01-01'), moment('2017-01-02')],
    },
  },
  disabled: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
