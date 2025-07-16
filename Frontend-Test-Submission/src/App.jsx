import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import StatsPage from './components/StatsPage';
import URLForm from './components/URLForm';
import './App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0f2c',
      paper: '#1a1f3d',
    },
    primary: {
      main: '#00bcd4',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
            <Button
              color="inherit"
              component={NavLink}
              to="/"
              style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
            >
              Create URL
            </Button>
            <Button
              color="inherit"
              component={NavLink}
              to="/stats"
              style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
            >
              Stats
            </Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="center">
            <Routes>
              <Route path="/" element={<URLForm />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
