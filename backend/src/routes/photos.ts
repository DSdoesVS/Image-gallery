import express from 'express';
import Album from '../models/Album';
import Photo from '../models/Photo';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

const router = express.Router();

// GET all photos in an album
router.get(
  '/albums/:albumId/photos',
  requireAuth,
  async (req: AuthRequest, res) => {
    const { albumId } = req.params;
    try {
      const album = await Album.findById(albumId);
      if (!album) return res.status(404).json({ error: 'Album not found' });
      if (album.userId.toString() !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const photos = await Photo.find({ albumId });
      return res.json(photos);
    } catch (err) {
      console.error('Error fetching album photos:', err);
      return res.status(500).json({ error: 'Server error while fetching photos' });
    }
  }
);

// Create a new photo in an album
router.post(
  '/albums/:albumId/photos',
  requireAuth,
  async (req: AuthRequest, res) => {
    const { albumId } = req.params;
    const { title, url, thumbnailUrl } = req.body;
    try {
      const album = await Album.findById(albumId);
      if (!album) return res.status(404).json({ error: 'Album not found' });
      if (album.userId.toString() !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const photo = await Photo.create({
        title,
        url,
        thumbnailUrl,
        albumId
      });
      return res.status(201).json(photo);
    } catch (err) {
      console.error('Error creating photo:', err);
      return res.status(500).json({ error: 'Server error while creating photo' });
    }
  }
);

// GET a single photo
router.get(
  '/photos/:photoId',
  requireAuth,
  async (req: AuthRequest, res) => {
    const { photoId } = req.params;
    try {
      const photo = await Photo.findById(photoId);
      if (!photo) return res.status(404).json({ error: 'Photo not found' });

      const album = await Album.findById(photo.albumId);
      if (!album) {
        return res.status(404).json({ error: 'Album not found for this photo' });
      }
      if (album.userId.toString() !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      return res.json(photo);
    } catch (err) {
      console.error('Error fetching photo:', err);
      return res.status(500).json({ error: 'Server error while fetching photo' });
    }
  }
);

// Update a photo
router.put(
  '/photos/:photoId',
  requireAuth,
  async (req: AuthRequest, res) => {
    const { photoId } = req.params;
    const { title, url, thumbnailUrl } = req.body;
    try {
      const photo = await Photo.findById(photoId);
      if (!photo) return res.status(404).json({ error: 'Photo not found' });

      const album = await Album.findById(photo.albumId);
      if (!album) {
        return res.status(404).json({ error: 'Album not found for this photo' });
      }
      if (album.userId.toString() !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      photo.title = title ?? photo.title;
      photo.url = url ?? photo.url;
      photo.thumbnailUrl = thumbnailUrl ?? photo.thumbnailUrl;
      await photo.save();

      return res.json(photo);
    } catch (err) {
      console.error('Error updating photo:', err);
      return res.status(500).json({ error: 'Server error while updating photo' });
    }
  }
);

// Delete a photo
router.delete(
  '/photos/:photoId',
  requireAuth,
  async (req: AuthRequest, res) => {
    const { photoId } = req.params;
    try {
      const photo = await Photo.findById(photoId);
      if (!photo) return res.status(404).json({ error: 'Photo not found' });

      const album = await Album.findById(photo.albumId);
      if (!album) {
        return res.status(404).json({ error: 'Album not found for this photo' });
      }
      if (album.userId.toString() !== req.user!.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      await photo.deleteOne();
      return res.status(204).send();
    } catch (err) {
      console.error('Error deleting photo:', err);
      return res.status(500).json({ error: 'Server error while deleting photo' });
    }
  }
);

export default router;
