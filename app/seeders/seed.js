import mongoose from 'mongoose';
import UserSchema from '../services/users/userSchema.js';
import RoleSchema from '../services/roles/roleSchema.js';

import { log, getEnv } from '../core/utils.js';
import datetime from '../core/datetime.js'


const now = datetime.getTimeStamp()

let runSeeder =  getEnv('RUN_SEED','bool')
if(runSeeder){
 
const MONGODB_URI = getEnv('MONGODB_URI')
const User = mongoose.model('User', UserSchema);
const Role = mongoose.model('Role', RoleSchema);


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedRoles();
    await seedUsers();
   
    console.log('Database seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });

async function seedRoles() {
  try {
    await Role.deleteMany({});
    const roles = [
      {name : 'admin'},
      { name: 'head' },
      { name: 'regular' },
      
    ];
    await Role.insertMany(roles);
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

async function seedUsers() {
  try {
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      console.error('admin role not found');
      process.exit(1);
    }
    await User.deleteMany({});
    const user = new User({
      firstName: 'Masoumeh',
      lastName: 'Dorsnagi',
      phone: 9127932965,
      userCode: 1,
      createdAt: datetime.toJalaali(),
      role: [adminRole._id], // Assigning the head role to the user
    });

    await user.save();
    console.log('User seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}


}