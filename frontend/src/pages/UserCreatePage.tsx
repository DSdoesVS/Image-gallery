import { useNavigate } from 'react-router-dom'
import UserForm from '../components/users/UserForm'
import { createUser } from '../services/api'

export default function UserCreatePage() {
  const navigate = useNavigate()

  const handleSubmit = async (data: { name: string; username: string; email: string }) => {
    await createUser(data)
    navigate('/users')
  }

  return <UserForm title="New User" onSubmit={handleSubmit} />
}
