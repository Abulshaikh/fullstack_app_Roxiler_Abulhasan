const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { User, Store, Rating } = require('../models').sequelize.models || require('../models');

router.use(auth);
router.use(roles('SYSTEM_ADMIN'));

// create user (admin)
const createSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).allow(''),
  password: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$')).required(),
  role: Joi.string().valid('SYSTEM_ADMIN','NORMAL_USER','STORE_OWNER').required()
});

router.post('/users', async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { name, email, address, password, role } = value;
  const existing = await User.findOne({ where: { email }});
  if (existing) return res.status(409).json({ error: 'Email exists' });
  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, address, password_hash, role });
  res.status(201).json({ user: user.toSafeJSON() });
});

// admin dashboard counts
router.get('/dashboard', async (req, res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  res.json({ totalUsers, totalStores, totalRatings });
});

// list users with simple filters (name,email,address,role)
router.get('/users', async (req, res) => {
  const { name, email, address, role, page=1, limit=20, sort='createdAt:desc' } = req.query;
  const where = {};
  if (name) where.name = name;
  if (email) where.email = email;
  if (address) where.address = address;
  if (role) where.role = role;
  const order = [ sort.split(':') ];
  const users = await User.findAll({ where, order, limit: parseInt(limit), offset: (page-1)*limit });
  res.json(users.map(u=>u.toSafeJSON()));
});

module.exports = router;
