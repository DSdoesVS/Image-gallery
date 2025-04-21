// src/pages/PhotoCreatePage.tsx
import { useNavigate, useParams } from 'react-router-dom'
import PhotoForm from '../components/photos/PhotoForm'
import { createPhoto } from '../services/api'

export default function PhotoCreatePage() {
  const { albumId } = useParams<{ albumId?: string }>()
  const navigate = useNavigate()

  const handleSubmit = async (data: { title: string; url: string; thumbnailUrl: string; albumId: number }) => {
    await createPhoto(data)
    navigate(`/albums/${data.albumId}`)
  }

  return (
    <PhotoForm
      title="New Photo"
      initialData={{ albumId: albumId ? +albumId : 0 }}
      onSubmit={handleSubmit}
    />
  )
}
