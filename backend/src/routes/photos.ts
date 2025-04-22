import express from 'express'
import Album from '../models/Album'
import Photo from '../models/Photo'
import { requireAuth, AuthRequest } from '../middleware/requireAuth'

const router = express.Router()

// List photos in an album
router.get('/albums/:albumId/photos', requireAuth, async (req: AuthRequest, res) => {
  const { albumId } = req.params
  const album = await Album.findById(albumId)
  if (!album) return res.status(404).json({ error: 'Album not found' })
  if (album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  const photos = await Photo.find({ albumId })
  res.json(photos)
})

// Create a photo
router.post('/albums/:albumId/photos', requireAuth, async (req: AuthRequest, res) => {
  const { albumId } = req.params
  const album = await Album.findById(albumId)
  if (!album) return res.status(404).json({ error: 'Album not found' })
  if (album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  const { title, url, thumbnailUrl } = req.body
  const photo = await Photo.create({ title, url, thumbnailUrl, albumId })
  res.status(201).json(photo)
})

// Get a single photo
router.get('/photos/:photoId', requireAuth, async (req: AuthRequest, res) => {
  const photo = await Photo.findById(req.params.photoId)
  if (!photo) return res.status(404).json({ error: 'Photo not found' })
  const album = await Album.findById(photo.albumId)
  if (!album || album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  res.json(photo)
})

// Update a photo
router.put('/photos/:photoId', requireAuth, async (req: AuthRequest, res) => {
  const photo = await Photo.findById(req.params.photoId)
  if (!photo) return res.status(404).json({ error: 'Photo not found' })
  const album = await Album.findById(photo.albumId)
  if (!album || album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  const { title, url, thumbnailUrl } = req.body
  photo.title = title
  photo.url = url
  photo.thumbnailUrl = thumbnailUrl
  await photo.save()
  res.json(photo)
})

// Delete a photo
router.delete('/photos/:photoId', requireAuth, async (req: AuthRequest, res) => {
  const photo = await Photo.findById(req.params.photoId)
  if (!photo) return res.status(404).json({ error: 'Photo not found' })
  const album = await Album.findById(photo.albumId)
  if (!album || album.userId.toString() !== req.user!.id) return res.status(403).json({ error: 'Forbidden' })
  await photo.deleteOne()
  res.status(204).end()
})

export default router
