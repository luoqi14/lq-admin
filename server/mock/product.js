const express = require('express');
const mockjs = require('mockjs');

const router = express.Router();

const product = mockjs.mock({
  'list|300': [{
    "productNo|1-10000": 1,
    "hqProductName|1-10": 1,
    "showName|1-10": 1,
    "l1L2Names|1-10": 1,
  }]
});

router.post('/', (req, res) => {
  const params = req.body;
  const limit = +params.limit || 10;
  const offset = +params.offset ? params.offset + 1 : 1;
  const searchParams = [{
    name: 'hqProductName',
    fuzzy: true,
  }];
  let list = product.list;
  const result = {
    success: true,
    payload: {
      total: list.length,
      rows: list,
    }
  };

  res.json(result);
});

module.exports = router;
