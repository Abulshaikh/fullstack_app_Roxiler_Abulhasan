const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    owner_id: { type: DataTypes.UUID },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255) },
    address: { type: DataTypes.TEXT }
  }, { tableName: 'stores', underscored: true, timestamps: true });

  return Store;
};
