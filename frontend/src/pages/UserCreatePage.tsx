import { useNavigate } from 'react-router-dom'
import UserForm from '../components/users/UserForm'
import { createUser } from '../services/api'
import { User } from '../types/User'

export default function UserCreatePage() {
  const navigate = useNavigate()

  const handleSubmit = async (data: Partial<User>) => {
    await createUser(data)
    navigate('/users')
  }

  return <UserForm title="New User" onSubmit={handleSubmit} />
}
