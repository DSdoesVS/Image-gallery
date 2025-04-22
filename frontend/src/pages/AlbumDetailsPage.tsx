// src/pages/AlbumDetailsPage.tsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  fetchAlbumPhotos,
  deletePhoto
} from '../services/api'
import { Photo } from '../types/Photo'
import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  IconButton,
  Container,
  Button
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function AlbumDetailsPage() {
  const { albumId } = useParams<{ albumId?: string }>()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)

  // Fetch all photos for this album on mount / albumId change
  useEffect(() => {
    if (!albumId) return
    fetchAlbumPhotos(+albumId)
      .then(data => {
        setPhotos(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load photos')
        setLoading(false)
      })
  }, [albumId])

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>{error}</Alert>
      </Box>
    )
  }

  // Handlers for carousel navigation
  const prev = () => setCurrent(i => (i === 0 ? photos.length - 1 : i - 1))
  const next = () => setCurrent(i => (i === photos.length - 1 ? 0 : i + 1))

  // Delete current photo
  const handleDeletePhoto = async (photoId: number) => {
    await deletePhoto(photoId)
    setPhotos(ps => ps.filter(p => p.id !== photoId))
    setCurrent(i => {
      // If we removed the last photo, step back
      if (i >= photos.length - 1) return photos.length - 2
      return i
    })
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header with New Photo button and position indicator */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          component={Link}
          to={`/albums/${albumId}/photos/new`}
          variant="contained"
          size="small"
        >
          New Photo
        </Button>
        <Typography variant="h6" color="primary">
          Photo {current + 1} of {photos.length}
        </Typography>
      </Box>

      {/* Main carousel area */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 240px)',
          minHeight: '300px',
          maxHeight: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f8f8f8',
          mx: 'auto'
        }}
      >
        <IconButton
          onClick={prev}
          size="small"
          sx={{
            position: 'absolute',
            left: 8,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            boxShadow: 1
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box
          component="img"
          src={photos[current].url}
          alt={photos[current].title}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />

        <IconButton
          onClick={next}
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
            boxShadow: 1
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {/* Edit/Delete controls for the current photo */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
        <Button
          component={Link}
          to={`/photos/${photos[current].id}/edit`}
          variant="outlined"
          size="small"
        >
          Edit Photo
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeletePhoto(photos[current].id)}
        >
          Delete Photo
        </Button>
      </Box>

      {/* Thumbnail strip */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5, px: 1, py: 1 }}>
        {photos.map((p, idx) => (
          <Box
            key={p.id}
            component="img"
            src={p.thumbnailUrl}
            alt={p.title}
            sx={{
              width: 45,
              height: 45,
              objectFit: 'cover',
              cursor: 'pointer',
              opacity: idx === current ? 1 : 0.6,
              border: idx === current ? '2px solid' : '1px solid #eee',
              borderColor: idx === current ? 'primary.main' : 'divider',
              borderRadius: 1,
            }}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </Box>
    </Container>
  )
}
