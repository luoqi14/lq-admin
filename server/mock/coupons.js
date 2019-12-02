const express = require('express');
const mockjs = require('mockjs');

const router = express.Router();

const coupons = mockjs.mock({
  'list|30': [{
    id: '@id',
    couponName: '@string',
    cityId: 30,
    'couponType|1-4': 1,  // 优惠券类型
    'vipCoupon|1-2': 1, // 会员共享
    'putType|1-3': 1, // 投放类型
    'minUsedAmount|100-200': 100, // 最低消费金额
    'deductions|1-100': 1,  // 抵扣金额
    'putIntoCount|1000-2000': 1000, // 投放量
    'deductions|1-1000': 1, // 可用量
    createUserName: '@cname', // 创建人
    createTime: '@date("yyyy-MM-dd HH:mm:ss")',
    'status|0-2': 0,  // 优惠券状态
    'pullType|1-3': 1,  // 优惠券发送类型
    showTime: '@date("yyyy-MM-dd HH:mm:ss")', // 优惠券展示时间
    'couponDescribe': '呆萝卜优惠券', // 描述
  }]
});

router.post('/', (req, res) => {
  const params = req.body;
  const pageSize = +params.pageSize || 10;
  const pageNo = +params.pageNo || 1;
  const searchParams = [{
    name: 'couponName',
    fuzzy: true,
  }, {
    name: 'couponType',
    fuzzy: false,
  }, {
    name: 'putType',
    fuzzy: false,
  }, {
    name: 'vipCoupon',
    fuzzy: false,
  }];
  let list = coupons.list;
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
  const result = {
    resultCode: '0',
    result: '操作成功',
    resultData: {
      pageNo,
      pageSize,
      total: list.length,
      list
    }
  };

  res.json(result);
})

router.post('/add', (req, res) => {
  const params = req.body;
  const result = {
    resultCode: '0',
    resultDesc: '操作成功'
  };

  res.json(result);
});

module.exports = router;
