// src/components/photos/PhotoForm.tsx
import { FC, useState, useEffect } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { Photo } from '../../types/Photo'

interface Props {
  title: string
  initialData?: Partial<Photo>
  onSubmit: (data: { title: string; url: string; thumbnailUrl: string; albumId: number }) => void
}

const PhotoForm: FC<Props> = ({ title, initialData, onSubmit }) => {
  const [photoTitle, setPhotoTitle] = useState(initialData?.title || '')
  const [url, setUrl] = useState(initialData?.url || '')
  const [thumb, setThumb] = useState(initialData?.thumbnailUrl || '')
  const [albumId, setAlbumId] = useState(initialData?.albumId || 0)

  useEffect(() => {
    if (initialData) {
      setPhotoTitle(initialData.title || '')
      setUrl(initialData.url || '')
      setThumb(initialData.thumbnailUrl || '')
      setAlbumId(initialData.albumId || 0)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title: photoTitle, url, thumbnailUrl: thumb, albumId })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>

      <TextField
        fullWidth
        label="Photo Title"
        value={photoTitle}
        onChange={e => setPhotoTitle(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Image URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Thumbnail URL"
        value={thumb}
        onChange={e => setThumb(e.target.value)}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Album ID"
        type="number"
        value={albumId}
        onChange={e => setAlbumId(Number(e.target.value))}
        margin="normal"
        required
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {title}
      </Button>
    </Box>
  )
}

export default PhotoForm
