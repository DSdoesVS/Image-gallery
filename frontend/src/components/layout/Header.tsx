// src/components/layout/Header.tsx
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Photo Gallery
        </Typography>
        
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>

        {isAuthenticated ? (
          <>
            <Button component={Link} to="/users" color="inherit">
              Users
            </Button>
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                {user?.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/register" color="inherit">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
