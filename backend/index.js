require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('express-async-errors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
async function start(){
  await sequelize.authenticate();
  console.log('DB connected');
  app.listen(PORT, ()=> console.log('Server listening on', PORT));
}
start();
