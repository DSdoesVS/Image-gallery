import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchAlbumPhotos } from '../services/api'
import { Photo } from '../types/Photo'
import { CircularProgress, Alert, Box, Typography, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function AlbumDetailsPage() {
  const { albumId } = useParams<{ albumId?: string }>()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)

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

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>

  const prev = () =>
    setCurrent(i => (i === 0 ? photos.length - 1 : i - 1))
  const next = () =>
    setCurrent(i => (i === photos.length - 1 ? 0 : i + 1))

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Photo {current + 1} of {photos.length}
      </Typography>
      <Box sx={{ position: 'relative', textAlign: 'center' }}>
        <IconButton onClick={prev} sx={{ position: 'absolute', left: 0, top: '50%' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box
          component="img"
          src={photos[current].url}
          alt={photos[current].title}
          sx={{ maxWidth: '100%', maxHeight: '70vh' }}
        />
        <IconButton onClick={next} sx={{ position: 'absolute', right: 0, top: '50%' }}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', overflowX: 'auto', mt: 2, gap: 1 }}>
        {photos.map((p, idx) => (
          <Box
            key={p.id}
            component="img"
            src={p.thumbnailUrl}
            alt={p.title}
            sx={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              cursor: 'pointer',
              opacity: idx === current ? 1 : 0.6
            }}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </Box>
}