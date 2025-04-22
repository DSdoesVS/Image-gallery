// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    background:{ default: '#f5f5f5', paper: '#ffffff' },
    text:      { primary: '#212121', secondary: '#757575' }
  },
  spacing: 8,
  shape:   { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          fontFamily: '"Roboto", sans-serif'
        }
      }
    }
  }
});

export default theme;
