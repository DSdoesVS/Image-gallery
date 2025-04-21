// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
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

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <main style={{ padding: 16 }}>
        <Routes>
          {/* 1) True Home landing */}
          <Route path="/" element={<HomePage />} />

          {/* 2) User CRUD */}
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/new" element={<UserCreatePage />} />
          <Route path="/users/:userId" element={<UserDetailsPage />} />

          {/* 3) Album CRUD */}
          <Route
            path="/users/:userId/albums/new"
            element={<AlbumCreatePage />}
          />
          <Route
            path="/albums/:albumId/edit"
            element={<AlbumEditPage />}
          />
          <Route
            path="/albums/:albumId"
            element={<AlbumDetailsPage />}
          />

          {/* 4) Fallback → go home */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/albums/:albumId/photos/new" element={<PhotoCreatePage />} />
          <Route path="/photos/:photoId/edit"       element={<PhotoEditPage />} />

        </Routes>
      </main>
    </BrowserRouter>
  )
}
