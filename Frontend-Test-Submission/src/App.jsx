import { useState } from 'react'
import './App.css'
import URLForm from './components/URLform';
import StatsPage from './components/StatsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLForm />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Router>
  );
}

export default App
