const express = require('express');
const router = express.Router();
const group = require('../helpers/group');
const jsonToTable = require('../helpers/jsonToTable');
const dataFormat = require('../helpers/dataFormat');
const { teacher, kriteria, link } = require('../models');

router.get('/', async (req, res, next) => {
  const username = req.session.username;
  const kriterias = await kriteria.getAll();
  return res.render('teacher/index', { title: 'Teacher', username, kriterias });
});

router.get('/table', async (req, res, next) => {
  try {
    const locations = await link.getAll();
    const tempData = group(locations, 'teacher_id');
    const data = dataFormat(tempData);
    return res.status(200).json(jsonToTable(data));
  } catch (error) {
    return res.json([]);
  }
});

router.post('/', async (req, res, next) => {
  const data = req.body;
  const tempLocation = await teacher.findOne({
    where: {
      name: data.name,
    },
  });
  if (tempLocation) {
    req.flash('error', 'Nama Lokasi Tidak Boleh Sama');
    return res.redirect('/teacher');
  }
  const location = await teacher.create({ name: data.name, alamat: data.alamat, contact: data.contact });
  for (const value of Object.keys(data)) {
    if (value != 'name' && value != 'alamat' && value != 'contact') {
      await link.create({
        kriteria_id: value,
        teacher_id: location.id,
        value: data[value],
      });
    }
  }
  req.flash('success', 'Data Berhasil Ditambahkan');
  return res.redirect('/teacher');
});

router.post('/:id', async (req, res, next) => {
  const data = req.body;
  const { id } = req.params;
  const tempteacher = await teacher.findOne({ where: { id }, raw: true, nest: true });
  console.log(tempteacher);
  if (tempteacher) {
    teacher.update({ name: data.name }, { where: { id } });
  }
  for (const value of Object.keys(data)) {
    if (value != 'name') {
      await link.update(
        {
          kriteria_id: value,
          teacher_id: tempteacher.id,
          value: data[value],
        },
        {
          where: {
            kriteria_id: value,
            teacher_id: tempteacher.id,
          },
        }
      );
    }
  }
  req.flash('success', 'Data Berhasil Diubah');
  return res.redirect('/teacher');
});

router.get('/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  const tempLocation = await teacher.findByPk(id);
  await tempLocation.destroy();
  req.flash('success', 'Data Berhasil Dihapus');
  return res.redirect('/teacher');
});

router.get('/form', async (req, res, next) => {
  const forms = await kriteria.getAll();
  return res.render('teacher/form', {
    action: '/teacher',
    forms,
    name: '',
    title: 'Teacher',
  });
});

router.get('/form/:id', async (req, res, next) => {
  const { id } = req.params;
  const kriterias = await kriteria.getAll();
  const tempForms = await link.getAll({ teacher_id: id });
  const name = tempForms[0]['teacher']['name'];
  const forms = kriterias.map(kriteria => {
    const passkriteria = kriteria.dataValues;
    const find = tempForms.find(asli => asli.kriteria_id == kriteria.id) || '';
    return { ...passkriteria, value: find.value };
  });
  return res.render('teacher/form', {
    action: `/teacher/${id}`,
    forms,
    name,
    title: 'Teacher',
  });
});

module.exports = router;
