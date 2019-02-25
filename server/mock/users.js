/* eslint-disable eqeqeq */
const express = require('express');
const mockjs = require('mockjs');

const router = express.Router();

const users = mockjs.mock({
  'list|25': [{
    id: '@id',
    name: '@cname',
    phone: /1[3458]\d{9}/,
    'type|1-2': 1,
    'storeId|1-2': 1,
    'status|1-2': 1,
    createDatetime: '@datetime',
  }],
});

router.post('/', (req, res) => {
  const params = req.body;
  const pageSize = +params.pageSize || 10;
  const pageNo = +params.pageNo || 1;
  const column = params.columnKey || 'createDatetime';
  const order = params.order || 'descend';
  const searchParams = [{
    name: 'name',
    fuzzy: true,
  }, {
    name: 'phone',
    fuzzy: true,
  }, {
    name: 'type',
    fuzzy: false,
  }, {
    name: 'storeId',
    fuzzy: false,
  }, {
    name: 'status',
    fuzzy: false,
  }];
  let list = users.list;
  list = list.filter((item) => {
    let ret = true;
    for (let i = 0; i < searchParams.length; i += 1) {
      const value = params[searchParams[i].name];
      if (value) {
        if (searchParams[i].fuzzy) {
          ret = ret && (item[searchParams[i].name].indexOf(value) > -1);
        } else {
          ret = ret && (item[searchParams[i].name] == value);
        }
      }
    }
    return ret;
  });
  list.sort((a, b) => {
    if (order === 'descend') {
      return a[column] < b[column] ? 1 : -1;
    }
    return a[column] < b[column] ? -1 : 1;
  });
  const ret = list.slice((pageNo - 1) * pageSize, pageNo * pageSize);
  const result = {
    resultCode: '0',
    resultDesc: '操作成功',
    resultData: {
      pageNo,
      pageSize,
      total: list.length,
      list: ret,
    },
  };

  res.json(result);
});

router.post('/lock', (req, res) => {
  const params = req.body;
  const ids = params.ids;
  const list = users.list;
  const ret = list.filter((item) => ids.indexOf(item.id) > -1);
  ret.forEach((item) => { item.status = 2; });
  const result = {
    resultCode: '0',
    resultDesc: '操作成功',
    resultData: ret,
  };

  res.json(result);
});

module.exports = router;
