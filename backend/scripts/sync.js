const { sequelize, User, Store } = require('../models');
const bcrypt = require('bcrypt');

async function sync(){
  await sequelize.sync({ alter: true });
  console.log('Synced models');
  // create default system admin if not exists
  const admin = await User.findOne({ where: { email: 'admin@example.com' }});
  if (!admin) {
    const hash = await bcrypt.hash('Admin@1234', 10);
    await User.create({ name: 'Default System Administrator User', email: 'admin@example.com', password_hash: hash, role: 'SYSTEM_ADMIN', address: 'HQ' });
    console.log('Created admin user: admin@example.com / Admin@1234');
  } else {
    console.log('Admin already exists');
  }
  process.exit(0);
}
sync().catch(e=>{ console.error(e); process.exit(1); });
