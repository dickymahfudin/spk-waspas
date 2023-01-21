const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const jsonToTable = require('../helpers/jsonToTable');
const group = require('../helpers/group');
const dataFormat = require('../helpers/dataFormat');
const { kriteria, link, user } = require('../models');

router.get('/', async (req, res, next) => {
  const username = req.session.username;
  return res.render('kriteria/index', { title: 'Kriteria', username });
});

router.get('/table', async (req, res, next) => {
  try {
    const user_id = req.session.userId;
    const kriterias = (await kriteria.getAll(user_id)).map(e => {
      const data = e.dataValues;
      const jenis = data.jenis === 0 ? 'Cost' : 'Benefit';
      return { ...data, jenis };
    });
    if (kriterias.length) {
      return res.json(jsonToTable(kriterias));
    }
    return res.json([]);
  } catch (error) {
    return res.json([]);
  }
});

router.post('/', async (req, res, next) => {
  const { name, bobot, jenis } = req.body;
  // const user_id = req.session.userId;
  const tempName = await kriteria.findOne({ where: { name } });

  if (tempName) {
    req.flash('error', 'Nama kriteria Tidak Boleh Sama');
    return res.redirect('/kriteria');
  }
  const listKriteria = await kriteria.findAll({ raw: true, nest: true });
  const sum = (listKriteria.reduce((a, b) => a + b.bobot, 0) || 0) + +bobot;
  if (sum > 1) {
    req.flash('error', 'Jumlah Keseluruhan Bobot Tidak boleh Lebih Dari 1');
    return res.redirect('/kriteria');
  }
  const create = await kriteria.create({ name, bobot, jenis: +jenis });
  const tempLink = await link.getAll();
  if (tempLink.length != 0) {
    const tempgroup = group(tempLink, 'teacher_id');
    const data = dataFormat(tempgroup);
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const el = data[key];
        await link.create({
          // user_id,
          kriteria_id: create.id,
          teacher_id: el.id,
          value: 0,
        });
      }
    }
  }
  // await user.update({ status: false });
  req.flash('success', 'Data Berhasil Ditambahkan');
  return res.redirect('/kriteria');
});

router.post('/:id', async (req, res, next) => {
  const { name, bobot, jenis } = req.body;
  const id = req.params.id;
  const listKriteria = await kriteria.findAll({ where: { id: { [Op.not]: id } }, raw: true, nest: true });
  const sum = (listKriteria.reduce((a, b) => a + b.bobot, 0) || 0) + +bobot;
  if (sum > 1) {
    req.flash('error', 'Jumlah Keseluruhan Bobot Tidak boleh Lebih Dari 1');
    return res.redirect('/kriteria');
  }
  const user_id = req.session.userId;
  const tempName = await kriteria.findByPk(id);
  await tempName.update({ name, bobot, jenis: +jenis });
  await user.update({ status: false }, { where: { id: user_id } });
  req.flash('success', 'Data Berhasil Diubah');
  return res.redirect('/kriteria');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempkriteria = await kriteria.findByPk(id);
  await tempkriteria.destroy();
  req.flash('success', 'Data Berhasil Dihapus');
  return res.redirect('/kriteria');
});

router.get('/form', async (req, res, next) => {
  const value = { name: '', bobot: '' };
  return res.render('kriteria/form', {
    action: '/kriteria',
    value,
    title: 'Kriteria',
  });
});
router.get('/form/:id', async (req, res, next) => {
  const id = req.params.id;
  const value = await kriteria.findByPk(id);
  return res.render('kriteria/form', {
    action: `/kriteria/${id}`,
    value,
    title: 'Kriteria',
  });
});

module.exports = router;
