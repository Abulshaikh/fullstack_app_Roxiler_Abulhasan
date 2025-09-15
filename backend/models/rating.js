const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    store_id: { type: DataTypes.UUID, allowNull: false },
    rating: { type: DataTypes.SMALLINT, allowNull: false, validate: { min:1, max:5 } }
  }, { tableName: 'ratings', underscored: true, timestamps: true, indexes: [{ unique: true, fields: ['user_id','store_id'] }] });

  return Rating;
};
