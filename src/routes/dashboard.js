const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const { teacher, kriteria, user } = require('../models');

router.get('/', async (req, res, next) => {
  let status = true;
  let waspas = await teacher.findAll({
    order: [['result', 'DESC']],
    raw: true,
    nest: true,
  });
  const kriterias = await kriteria.findAll();
  waspas.forEach(el => {
    if (!el.result) status = false;
  });
  let rang = 0;
  const temp = [];
  for (let i = 0; i < waspas.length; i++) {
    const el = waspas[i];
    rang++;
    if (i > 0) {
      const old = temp[i - 1];
      if (el.result == old.result) rang = old.rang;
    }
    temp.push({ ...el, rang });
  }
  waspas = temp;
  res.render('dashboard', { title: 'Dashboard', status, kriterias, waspas });
});

module.exports = router;
