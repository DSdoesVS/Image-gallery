import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import UserListPage from './pages/UserListPage'
import UserCreatePage from './pages/UserCreatePage'
import UserEditPage from './pages/UserEditPage'
import UserDetailsPage from './pages/UserDetailsPage'
import AlbumCreatePage from './pages/AlbumCreatePage'
import AlbumEditPage from './pages/AlbumEditPage'
import AlbumDetailsPage from './pages/AlbumDetailsPage'
import PhotoCreatePage from './pages/PhotoCreatePage'
import PhotoEditPage from './pages/PhotoEditPage'
import RequireAuth from './components/auth/RequireAuth'

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <main style={{ padding: 16 }}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />

          {/* User CRUD */}
          <Route
            path="/users"
            element={
              <RequireAuth>
                <UserListPage />
              </RequireAuth>
            }
          />
          <Route
            path="/users/new"
            element={
              <RequireAuth>
                <UserCreatePage />
              </RequireAuth>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <RequireAuth>
                <UserDetailsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/users/:userId/edit"
            element={
              <RequireAuth>
                <UserEditPage />
              </RequireAuth>
            }
          />

          {/* Album CRUD */}
          <Route
            path="/users/:userId/albums/new"
            element={
              <RequireAuth>
                <AlbumCreatePage />
              </RequireAuth>
            }
          />
          <Route
            path="/albums/:albumId"
            element={
              <RequireAuth>
                <AlbumDetailsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/albums/:albumId/edit"
            element={
              <RequireAuth>
                <AlbumEditPage />
              </RequireAuth>
            }
          />

          {/* Photo CRUD */}
          <Route
            path="/albums/:albumId/photos/new"
            element={
              <RequireAuth>
                <PhotoCreatePage />
              </RequireAuth>
            }
          />
          <Route
            path="/photos/:photoId/edit"
            element={
              <RequireAuth>
                <PhotoEditPage />
              </RequireAuth>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
