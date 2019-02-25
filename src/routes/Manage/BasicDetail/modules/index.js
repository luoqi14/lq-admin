import moment from 'moment';
import fetch from 'lq-fetch';
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
  loadUser: (params) => ({
    types: [BASICDETAIL_USER_REQUEST, BASICDETAIL_USER_SUCCESS, BASICDETAIL_USER_FAILURE],
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
  [BASICDETAIL_USER_REQUEST] : (state, action) => ({
    ...state,
    user: {
      ...state.user,
      loading: true,
      query: action.name || '',
    },
  }),
  [BASICDETAIL_USER_SUCCESS]: (state, action) => {
    const {
      pageNo,
      pageSize,
      total,
    } = action.data;
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
  [BASICDETAIL_USER_FAILURE]: (state) => ({
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
  [BASICDETAIL_SEARCH]: (state) => ({
    ...state,
  }),
  [BASICDETAIL_RESET]: (state) => ({
    ...state,
    searchParams: {},
  }),
  [BASICDETAIL_CONFIRM]: (state) => ({
    ...state,
  }),
  [BASICDETAIL_TOGGLE]: (state) => ({
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
  [BASICDETAIL_REFRESH]: (state) => ({
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
    address1: {
      value: ['130000', '130200', '130204'],
    },
    radio1: {
      value: 1,
    },
    checkbox1: {
      value: ['1'],
    },
    input1: {
      value: 'GRAB_OVERTIME',
    },
    password1: {
      value: '123456',
    },
    number1: {
      value: 1000,
    },
    numberRange1: {
      value: [0, 1000],
    },
    date1: {
      value: '2017-01-01',
    },
    dateRange1: {
      value: ['2017-01-01', '2017-01-02'],
    },
    datetime1: {
      value: '2017-01-01',
    },
    datetimeRange1: {
      value: [moment('2017-01-01'), moment('2017-01-02')],
    },
    month1: {
      value: '2017-01',
    },
    monthRange1: {
      value: [moment('2017-01'), moment('2017-01')],
    },
    file1: {
      value: '/logo-gray.png',
    },
    file2: {
      value: ['/1.pdf'],
    },
    initDistance: {
      value: '44',
    },
    editor1: {
      value: '3232',
    },
    switch1: {
      value: 1,
    },
    propertyPrice: {
      value: 1,
    },
    timeStart: {
      value: '11:26:58',
    },
    timeEnd: {
      value: '11:26:59',
    },
    transfer1: {
      value: [2],
    },
    display1: {
      value: '不编辑',
    },
    tag1: {
      value: ['Unremovable', 'Tag 2', 'Tag 3'],
    },
    footers: ['1', '2'],
    teacher: {
      name: 'rose',
    },
    teachers: [{ name: 'jack' }],
  },
  disabled: false,
};

export default function reducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
