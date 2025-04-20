import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import UserListPage from './pages/UserListPage'
import UserCreatePage from './pages/UserCreatePage'
import UserEditPage from './pages/UserEditPage'
import UserDetailsPage from './pages/UserDetailsPage'
import AlbumDetailsPage from './pages/AlbumDetailsPage'


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/new" element={<UserCreatePage />} />
        <Route path="/users/:userId/edit" element={<UserEditPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/:userId" element={<UserDetailsPage />} />
        <Route path="/albums/:albumId" element={<AlbumDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
