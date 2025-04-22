import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth'
import { requireAuth } from './middleware/requireAuth'
import User from './models/User'

import albumRoutes from './routes/albums'
import photoRoutes from './routes/photos'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use(albumRoutes)
app.use(photoRoutes)

// Simple protected test route
app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'You accessed a protected route', user: (req as any).user })
})

// Protected “list users” route
app.get('/users', requireAuth, async (req, res) => {
  const users = await User.find({}, 'name username email')
  res.json(users)
})

app.get('/', (_, res) => {
  res.send('Backend is running')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
