const express = require('express');
const mockjs = require('mockjs');

const router = express.Router();

const classify = mockjs.mock({
  'list|300': [{
    classifyId: '@id',
    classifyName: '@string',
    classifyNo: '@string',
    level: 2,
    classifyIcon: '@Random.image()',
  }]
});

router.post('/', (req, res) => {
  const params = req.body;
  const limit = +params.limit || 10;
  const offset = +params.offset ? params.offset + 1 : 1;
  const searchParams = [{
    name: 'level',
    fuzzy: true,
  }, {
    name: 'classifyName',
    fuzzy: false,
  }, {
    name: 'classifyNo',
    fuzzy: false,
  }];
  let list = classify.list;
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
