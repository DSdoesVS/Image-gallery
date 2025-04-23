
import { useNavigate, useParams } from 'react-router-dom'
import AlbumForm from '../components/albums/AlbumForm'
import { createAlbum } from '../services/api'

export default function AlbumCreatePage() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

  const handleSubmit = async (data: { title: string; userId: number }) => {
    await createAlbum(data)
    navigate(`/users/${data.userId}`)
  }

  return (
    <AlbumForm
      title="New Album"
      initialValues={userId ? { title: '', userId: Number(userId) } : undefined}
      onSubmit={handleSubmit}
    />
  )
}
