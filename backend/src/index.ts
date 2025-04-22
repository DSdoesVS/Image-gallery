import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth'
import { requireAuth, AuthRequest } from './middleware/requireAuth'
import User from './models/User'

import albumRoutes from './routes/albums'
import photoRoutes from './routes/photos'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET is not defined in environment variables')
  process.exit(1)
}

if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in environment variables')
  process.exit(1)
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use(albumRoutes)
app.use(photoRoutes)

// Simple protected test route
app.get('/protected', requireAuth, (req: AuthRequest, res) => {
  res.json({ message: 'You accessed a protected route', user: req.user })
})

// Protected "list users" route
app.get('/users', requireAuth, async (req, res) => {
  try {
    const users = await User.find({}, 'name username email')
    res.json(users)
  } catch (err) {
    console.error('Error fetching users:', err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Health check route
app.get('/', (_, res) => {
  res.send('Backend is running')
})

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Server error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
