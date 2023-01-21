const express = require('express');
const router = express.Router();
const jsonToTable = require('../helpers/jsonToTable');
const { teacher, kriteria, user } = require('../models');

router.get('/', async (req, res, next) => {
  let status = true;
  const waspas = await teacher.findAll({
    order: [['result', 'DESC']],
  });
  const kriterias = await kriteria.findAll();
  waspas.forEach(el => {
    if (!el.result) status = false;
  });
  res.render('dashboard', { title: 'Dashboard', status, kriterias, waspas });
});

module.exports = router;
