
import { FC, useState, useEffect, FormEvent } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'

interface AlbumFormData {
  title: string
  userId: number
}

interface AlbumFormProps {
  
  title: string
 
  initialValues?: AlbumFormData
  
  onSubmit: (data: AlbumFormData) => Promise<void>
}

const AlbumForm: FC<AlbumFormProps> = ({ title, initialValues, onSubmit }) => {
  const [titleField, setTitleField] = useState(initialValues?.title || '')
  const [userId, setUserId] = useState(initialValues?.userId || 0)
  const [submitting, setSubmitting] = useState(false)

  
  useEffect(() => {
    if (initialValues) {
      setTitleField(initialValues.title)
      setUserId(initialValues.userId)
    }
  }, [initialValues])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ title: titleField, userId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 1 }}>
        {title}
      </Typography>

      <TextField
        fullWidth
        label="Album Title"
        name="title"
        value={titleField}
        onChange={(e) => setTitleField(e.target.value)}
        required
      />

      <TextField
        fullWidth
        label="User ID"
        name="userId"
        type="number"
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
        required
      />

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        size="large"
        sx={{ mt: 2 }}
      >
        {submitting ? 'Saving…' : title}
      </Button>
    </Box>
  )
}

export default AlbumForm
