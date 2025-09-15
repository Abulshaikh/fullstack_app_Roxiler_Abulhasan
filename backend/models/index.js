const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, { dialectOptions: { ssl: process.env.DB_SSL === 'true' } });
} else {
  // fallback to sqlite for easy local testing
  const storage = process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'data', 'dev.sqlite');
  sequelize = new Sequelize({ dialect: 'sqlite', storage });
}

const User = require('./user')(sequelize);
const Store = require('./store')(sequelize);
const Rating = require('./rating')(sequelize);

// Associations
User.hasMany(Store, { foreignKey: 'owner_id' });
Store.belongsTo(User, { foreignKey: 'owner_id' });

User.belongsToMany(Store, { through: Rating, foreignKey: 'user_id', otherKey: 'store_id' });
Store.belongsToMany(User, { through: Rating, foreignKey: 'store_id', otherKey: 'user_id' });

Rating.belongsTo(User, { foreignKey: 'user_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

module.exports = { sequelize, User, Store, Rating };
