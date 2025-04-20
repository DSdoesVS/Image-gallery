import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UserForm from '../components/users/UserForm'
import { fetchUsers, updateUser } from '../services/api'
import { User } from '../types/User'
import { CircularProgress } from '@mui/material'

export default function UserEditPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<Partial<User> | null>(null)

  useEffect(() => {
    if (!userId) return
    fetchUsers()
      .then(list => {
        const found = list.find(u => u.id === +userId)
        setInitial(found || null)
      })
  }, [userId])

  if (!initial) return <CircularProgress />

  const handleSubmit = async (data: Partial<User>) => {
    await updateUser(+userId!, data)
    navigate('/users')
  }

  return <UserForm title="Edit User" initialData={initial} onSubmit={handleSubmit} />
}
