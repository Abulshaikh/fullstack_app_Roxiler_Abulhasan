const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    address: { type: DataTypes.TEXT },
    role: { type: DataTypes.ENUM('SYSTEM_ADMIN','NORMAL_USER','STORE_OWNER'), allowNull: false, defaultValue: 'NORMAL_USER' }
  }, { tableName: 'users', underscored: true, timestamps: true });

  User.prototype.toSafeJSON = function(){
    const v = this.get();
    delete v.password_hash;
    return v;
  };

  return User;
};
