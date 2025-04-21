import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './src/models/User'   // pulls in src/models/User.ts
const initialUsers: { name: string; username: string; email: string }[] =
  require('./users.json')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!)
  const count = await User.countDocuments()
  if (count > 0) {
    console.log('🛑 Users already seeded. Exiting.')
    process.exit(0)
  }

  console.log('🔄 Seeding users...')
  for (const u of initialUsers) {
    const passwordHash = await bcrypt.hash('Password123!', 10)
    await User.create({
      name:         u.name,
      username:     u.username,
      email:        u.email,
      passwordHash
    })
  }
  console.log('✅ Seeding complete.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seeder error:', err)
  process.exit(1)
})