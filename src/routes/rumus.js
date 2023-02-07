const express = require('express');
const router = express.Router();
const hitung = require('../helpers/hitung');
const group = require('../helpers/group');
const dataFormat = require('../helpers/dataFormat');
const { kriteria, link, teacher, user } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const locations = await link.getAll();
    const kriterias = await kriteria.findAll({ raw: true, nest: true });
    let status = true;

    const tempData = group(locations, 'teacher_id');
    let waspas;
    const datas = dataFormat(tempData).map(el => ({
      id: el.id,
      name: el.name,
      Pedagogik: el.Pedagogik,
      Sosial: el.Sosial,
      Profesional: el.Profesional,
      Kepribadian: el.Kepribadian,
    }));

    if (locations.length > 1 && kriterias.length > 1) {
      const hitungs = hitung(datas, kriterias);
      waspas = hitungs.waspas;
    }
    if (!waspas) status = false;
    return res.render('rumus', { title: 'Rumus', waspas, status });
  } catch (error) {
    const status = false;
    let moora, waspas;
    return res.render('rumus', { title: 'Rumus', waspas, status });
  }
});

router.get('/hitung', async (req, res, next) => {
  try {
    const locations = await link.getAll();
    const kriterias = await kriteria.getAll();

    const tempData = group(locations, 'teacher_id');
    const datas = dataFormat(tempData);
    console.log(datas);
    const hitungs = hitung(datas, kriterias);
    if (hitungs.waspas.hasil.length != 0) {
      let dbError = 0;
      hitungs.waspas.hasil.forEach(async db => {
        console.log(db);
        if (!db.q) {
          dbError++;
        } else {
          await teacher.update({ result: db.q }, { where: { id: db.id } });
        }
      });
      if (dbError > 1) {
        req.flash('error', 'Perhitungan Gagal Data teacher Tidak Boleh Kosong');
        return res.redirect('/rumus');
      }
      req.flash('success', 'Perhitungan Berhasil');
      return res.redirect('/rumus');
    }
    req.flash('error', 'Perhitungan Gagal Data teacher Tidak Boleh Kosong');
    return res.redirect('/rumus');
  } catch (error) {
    req.flash('error', 'Perhitungan Gagal Minimal 2 Data teacher dan 2 Data kriteria');
    return res.redirect('/rumus');
  }
});

router.get('/json', async (req, res, next) => {
  const locations = await link.getAll();
  const kriterias = await kriteria.getAll();

  const tempData = group(locations, 'teacher_id');
  const datas = dataFormat(tempData);
  const hitungs = hitung(datas, kriterias);
  res.json(hitungs);
});
module.exports = router;
