const bcrypt = require('bcrypt');
const User = require('./model/User'); 

async function createAdminUser() {
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    const adminUser = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created');
}

createAdminUser().catch(console.error);