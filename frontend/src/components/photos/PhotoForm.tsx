import { FC, useState, useEffect } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Photo } from '../../types/Photo'

interface PhotoFormData {
  title: string
  url: string
  thumbnailUrl: string
  albumId: string
}

interface Props {
  title: string
  initialData?: Partial<Photo>
  onSubmit: (data: PhotoFormData) => void
}

const PhotoForm: FC<Props> = ({ title, initialData, onSubmit }) => {
  const { albumId = '' } = useParams<{ albumId: string }>()
  const [photoTitle, setPhotoTitle] = useState(initialData?.title || '')
  const [url, setUrl] = useState(initialData?.url || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '')

  useEffect(() => {
    if (initialData) {
      setPhotoTitle(initialData.title ?? '')
      setUrl(initialData.url ?? '')
      setThumbnailUrl(initialData.thumbnailUrl ?? '')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title: photoTitle, url, thumbnailUrl, albumId })
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
        value={thumbnailUrl}
        onChange={e => setThumbnailUrl(e.target.value)}
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
