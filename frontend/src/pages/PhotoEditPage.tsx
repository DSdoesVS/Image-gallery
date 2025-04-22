// src/pages/PhotoEditPage.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PhotoForm from '../components/photos/PhotoForm'
import { fetchPhoto, updatePhoto } from '../services/api'
import { CircularProgress, Box, Alert } from '@mui/material'
import { Photo } from '../types/Photo'

export default function PhotoEditPage() {
  const { photoId } = useParams<{ photoId: string }>()
  const navigate = useNavigate()
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!photoId) return
    fetchPhoto(+photoId)
      .then(p => setPhoto(p))
      .catch(() => setError('Failed to load photo'))
      .finally(() => setLoading(false))
  }, [photoId])

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!photo) return null

  const handleSubmit = async (data: {
    title: string
    url: string
    thumbnailUrl: string
    albumId: string
  }) => {
    await updatePhoto(+photoId, {
      title: data.title,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      albumId: data.albumId
    })
    // after update, go back to the album’s photo carousel
    navigate(`/albums/${data.albumId}`)
  }

  return (
    <PhotoForm
      title="Edit Photo"
      initialData={photo}
      onSubmit={handleSubmit}
    />
  )
}
