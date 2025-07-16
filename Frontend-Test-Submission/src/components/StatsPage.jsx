import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Container,
  Divider
} from '@mui/material';
import axios from 'axios';

const StatsPage = () => {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setError('');
    setStats(null);
    try {
      const res = await axios.get(`http://localhost:8000/shorturls/${code}`);
      setStats(res.data);
    } catch (err) {
      setError('Shortcode not found or server error');
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            URL Shortener Stats
          </Typography>

          <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} mb={2}>
            <TextField
              label="Enter Shortcode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={fetchStats}
              disabled={!code.trim()}
              sx={{ minWidth: '150px' }}
            >
              Get Stats
            </Button>
          </Box>

          {error && (
            <Typography color="error" variant="body1" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {stats && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Typography><strong>Original URL:</strong> {stats.originalUrl}</Typography>
              <Typography><strong>Created At:</strong> {formatDate(stats.createdAt)}</Typography>
              <Typography><strong>Expiry:</strong> {formatDate(stats.expiry)}</Typography>
              <Typography><strong>Total Clicks:</strong> {stats.totalClicks}</Typography>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>Click Details:</Typography>

              {stats.clicks.length > 0 ? (
                stats.clicks.map((c, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Timestamp:</strong> {formatDate(c.timestamp)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Referrer:</strong> {c.referrer || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {c.location || 'Unknown'}
                    </Typography>
                    {i !== stats.clicks.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No click data available.</Typography>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default StatsPage;
