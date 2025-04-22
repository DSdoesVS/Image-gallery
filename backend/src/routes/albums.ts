import express from 'express'
import Album from '../models/Album'
import { requireAuth } from '../middleware/requireAuth'

const router = express.Router()

// List a user's albums
router.get('/users/:userId/albums', requireAuth, async (req, res) => {
  const { userId } = req.params
  if (req.user!.id !== userId) return res.status(403).json({ error: 'Forbidden' })
  const albums = await Album.find({ userId })
  res.json(albums)
})

// Create a new album
router.post('/users/:userId/albums', requireAuth, async (req, res) => {
  const { userId } = req.params
  if (req.user!.id !== userId) return res.status(403).json({ error: 'Forbidden' })
  const { title } = req.body
  const album = await Album.create({ title, userId })
  res.status(201).json(album)
})

// Get one album
router.get('/albums/:albumId', requireAuth, async (req, res) => {
  const album = await Album.findById(req.params.albumId)
  if (!album) return res.status(404).json({ error: 'Not found' })
  if (album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  res.json(album)
})

// Update an album
router.put('/albums/:albumId', requireAuth, async (req, res) => {
  const album = await Album.findById(req.params.albumId)
  if (!album) return res.status(404).json({ error: 'Not found' })
  if (album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  album.title = req.body.title
  await album.save()
  res.json(album)
})

// Delete an album
router.delete('/albums/:albumId', requireAuth, async (req, res) => {
  const album = await Album.findById(req.params.albumId)
  if (!album) return res.status(404).json({ error: 'Not found' })
  if (album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  await album.deleteOne()
  res.status(204).end()
})

export default router
