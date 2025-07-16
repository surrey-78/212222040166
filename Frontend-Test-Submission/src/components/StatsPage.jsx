import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const StatsPage = () => {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/shorturls/${code}`);
      setStats(res.data);
    } catch (err) {
      alert('Shortcode not found');
    }
  };

  return (
    <div>
      <TextField label="Shortcode" onChange={e => setCode(e.target.value)} />
      <Button onClick={fetchStats}>Get Stats</Button>
      {stats && (
        <div>
          <p>Original URL: {stats.originalUrl}</p>
          <p>Created At: {stats.createdAt}</p>
          <p>Expiry: {stats.expiry}</p>
          <p>Total Clicks: {stats.totalClicks}</p>
          {stats.clicks.map((c, i) => (
            <p key={i}>{c.timestamp} | {c.referrer} | {c.location}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsPage;
