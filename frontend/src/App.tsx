import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Typography, 
  Box 
} from '@mui/material';
import UserTable from './components/UserTable';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            User Management Dashboard
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
            Monitor user accounts, password changes, and access patterns
          </Typography>
          <Box sx={{ mt: 4 }}>
            <UserTable />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
