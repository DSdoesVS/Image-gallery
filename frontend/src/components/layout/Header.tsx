// src/components/layout/Header.tsx
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Photo Gallery
        </Typography>
        {/* Make sure Home points to "/" */}
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        <Button component={Link} to="/users" color="inherit">
          Users
        </Button>
      </Toolbar>
    </AppBar>
  )
}
