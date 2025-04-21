import express from 'express'
import {Request, Response} from "@types/express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User'

dotenv.config()

const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body

    const existing = await User.findOne({ username })
    if (existing) return res.status(409).json({ error: 'Username already taken' })

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({ name, username, email, passwordHash })

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name, username, email }
    })
  } catch {
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.passwordHash!)
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' })

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email }
    })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
