import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import StatsPage from './components/StatsPage';
import URLForm from './components/URLForm';

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
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<URLForm />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
