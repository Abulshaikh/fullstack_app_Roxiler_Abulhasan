const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { User, Store, Rating, sequelize } = require('../models');

router.get('/', auth, async (req, res) => {
  // list stores with avg rating and user's submitted rating if logged in
  const stores = await Store.findAll();
  const out = [];
  for (const s of stores){
    const avg = await Rating.findOne({ where: { store_id: s.id }, attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg']] });
    let avgVal = avg && avg.dataValues && avg.dataValues.avg ? parseFloat(avg.dataValues.avg).toFixed(2) : null;
    let userRating = null;
    if (req.user){
      const r = await Rating.findOne({ where: { store_id: s.id, user_id: req.user.id }});
      if (r) userRating = r.rating;
    }
    out.push({ ...s.toJSON(), averageRating: avgVal, userRating });
  }
  res.json(out);
});

// create store (admin)
router.post('/', auth, roles('SYSTEM_ADMIN'), async (req, res) => {
  const schema = Joi.object({ name: Joi.string().required(), email: Joi.string().email().allow(''), address: Joi.string().max(400).allow(''), owner_id: Joi.string().guid().allow(null) });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const s = await Store.create(value);
  res.status(201).json(s);
});

// submit or update rating (normal user)
router.post('/:storeId/rating', auth, roles('NORMAL_USER'), async (req, res) => {
  const schema = Joi.object({ rating: Joi.number().integer().min(1).max(5).required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { storeId } = req.params;
  const userId = req.user.id;
  const [rating, created] = await Rating.upsert({ user_id: userId, store_id: storeId, rating: value.rating }, { returning: true });
  res.json({ success: true });
});

// owner: list users who rated their store and avg rating
router.get('/:storeId/ratings', auth, roles('STORE_OWNER','SYSTEM_ADMIN'), async (req, res) => {
  const { storeId } = req.params;
  const ratings = await Rating.findAll({ where: { store_id: storeId }, include: [{ model: User, attributes: ['id','name','email','address'] }] });
  const avg = await Rating.findOne({ where: { store_id: storeId }, attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avg']] });
  const avgVal = avg && avg.dataValues && avg.dataValues.avg ? parseFloat(avg.dataValues.avg).toFixed(2) : null;
  res.json({ avg: avgVal, ratings });
});

module.exports = router;
