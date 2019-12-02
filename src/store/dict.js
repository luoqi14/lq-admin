import { message } from 'antd';
import fetch from '../util/fetch';
// ------------------------------------
// Constants
// ------------------------------------
const DICT_REQUEST = 'DICT_REQUEST';
const DICT_SUCCESS = 'DICT_SUCCESS';
const DICT_FAILURE = 'DICT_FAILURE';
// ------------------------------------
// Actions
// ------------------------------------
const dictRequest = type => ({
  type: 'DICT_REQUEST',
  payload: type,
});

const dictSuccess = (data, type) => ({
  type: 'DICT_SUCCESS',
  payload: data,
  dictType: type,
});

const dictFailure = msg => ({
  type: 'DICT_FAILURE',
  payload: msg,
});

export const dict = type => (dispatch, getState) => {
  dispatch(dictRequest(type));
  const dictCache = getState().dict;
  return new Promise((resolve, reject) => {
    if (dictCache[type]) {
      dispatch(dictSuccess(dictCache[type], type));
      resolve(dictCache[type]);
    } else {
      fetch('/dict/list', {
        type,
      }).then(json => {
        if (json.resultCode === '0') {
          dispatch(dictSuccess(json.resultData, type));
          resolve(json.resultData.dicts);
        } else {
          dispatch(dictFailure(json.resultDesc));
          reject(json.resultDesc);
        }
      });
    }
  });
};

// ------------------------------------
// Reducer
// ------------------------------------

const ACTION_HANDLERS = {
  [DICT_REQUEST]: state => ({
    ...state,
  }),
  [DICT_SUCCESS]: (state, action) => {
    const newState = {
      ...state,
    };

    newState[action.dictType] = action.payload.dicts;
    return newState;
  },
  [DICT_FAILURE]: (state, action) => {
    message.error(action.payload);
    return {
      ...state,
    };
  },
};

const initialState = {
  // 前端映射
  map: {
    // 活动应用范围
    rangeType: {
      1: '全量',
      2: '指定城市',
      3: '指定范围',
    },
    // 活动应用范围
    cityRangeType: {
      1: '全量',
      2: '指定城市',
      3: '指定门店',
    },
    // 商品范围
    productType: {
      1: '全商品',
      2: '指定商品',
    },
    // 活动状态
    status: {
      1: '开启',
      2: '未开启',
      3: '关闭',
    },
    ModuleType: {
      1: '首页banner',
      2: '磁贴',
      4: '主题',
    },
  },
  // 支付有礼状态
  payGiftStatus: {
    1: '未开始',
    2: '进行中',
    3: '已结束',
    4: '手动停止',
    5: '券发完停止',
  },
  // 支付有礼类型
  payGiftType: {
    1: '优惠券',
    2: '余额',
    3: '萝卜币',
  },
};
export default function dictReducer(state = initialState, action = {}) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
