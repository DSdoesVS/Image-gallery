// src/pages/AlbumEditPage.tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AlbumForm from '../components/albums/AlbumForm'
import { fetchAlbum, updateAlbum } from '../services/api'
import { CircularProgress, Alert } from '@mui/material'

export default function AlbumEditPage() {
  const { albumId } = useParams<{ albumId: string }>()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<{ title: string; userId: number }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!albumId) return
    fetchAlbum(Number(albumId))
      .then(album => {
        setInitialValues({ title: album.title, userId: album.userId })
      })
      .catch(() => setError('Failed to load album'))
      .finally(() => setLoading(false))
  }, [albumId])

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!initialValues) return null

  const handleSubmit = async (data: { title: string; userId: number }) => {
    await updateAlbum(Number(albumId), data)
    navigate(`/users/${data.userId}`)
  }

  return (
    <AlbumForm
      title="Edit Album"
      initialValues={initialValues}
      onSubmit={handleSubmit}
    />
  )
}
