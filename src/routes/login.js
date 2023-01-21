const express = require('express');
const router = express.Router();
const dataLaporan = require('../helpers/dataLaporan');
const { user } = require('../models');

const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('login', { title: 'Login', layout: 'layouts/blank' });
});

router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  const tempUser = await user.findOne({ where: { username } });
  if (!tempUser) {
    console.log('masuk');
    req.flash('error', 'Username atau Password Salah');
    return res.redirect('/login');
  }
  const isValidPassword = await bcrypt.compare(password, tempUser.password);
  if (!isValidPassword) {
    req.flash('error', 'Username atau Password Salah');
    return res.redirect('/login');
  }
  req.flash('success', 'Login Berhasil');
  req.session.login = true;
  req.session.userId = tempUser.id;
  req.session.username = tempUser.name;
  req.session.role = tempUser.role;
  return res.redirect('/dashboard');
});

router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Sign Up', layout: 'layouts/blank' });
});

router.post('/signup', async (req, res, next) => {
  const { username, laporan } = req.body;
  const tempUser = await user.findOne({ where: { username } });
  if (tempUser) {
    req.flash('error', 'Username Sudah Ada Harap menggunakan Username Yang Lain');
    return res.redirect('/login/signup');
  }
  const password = await bcrypt.hash(req.body.password, 10);
  const create = await user.create({ username, password });
  laporan && dataLaporan(create.id);
  req.flash('success', 'Silahkan Masuk');
  res.redirect('/login');
});

router.get('/datalaporan', async (req, res, next) => {
  dataLaporan();
  res.redirect('/login');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
  });
  res.redirect('/login');
});

module.exports = router;
