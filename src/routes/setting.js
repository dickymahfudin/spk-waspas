const express = require('express');
const router = express.Router();
const { teacher, kriteria, link } = require('../models');
const dataLaporan = require('../helpers/dataLaporan');

router.get('/', (req, res, next) => res.render('setting', { title: 'Setting' }));

router.get('/destroy', async (req, res, next) => {
  await teacher.destroy({ where: {} });
  await kriteria.destroy({ where: {} });
  await link.destroy({ where: {} });
  return res.redirect('/');
});

router.get('/add', async (req, res, next) => {
  await teacher.destroy({ where: {} });
  await kriteria.destroy({ where: {} });
  await link.destroy({ where: {} });
  await dataLaporan();
  return res.redirect('/rumus/hitung');
});

module.exports = router;
