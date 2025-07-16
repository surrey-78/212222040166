import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Container,
  Divider
} from '@mui/material';
import axios from 'axios';

const URLForm = () => {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async () => {
    const responses = await Promise.all(
      inputs.map(async ({ url, validity, shortcode }) => {
        if (!url.trim()) {
          return { error: 'URL is required' };
        }

        try {
          const validityInMinutes = validity ? parseInt(validity) * 1440 : undefined;

          const res = await axios.post('http://localhost:8000/shorturls', {
            url,
            validity: validityInMinutes,
            shortcode: shortcode?.trim() || undefined
          });

          return res.data;
        } catch (err) {
          return { error: err.response?.data?.error || 'Unknown error' };
        }
      })
    );
    setResults(responses);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Shorten URLs
          </Typography>

          {inputs.map((input, i) => (
            <Grid container spacing={2} alignItems="center" key={i} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Original URL"
                  fullWidth
                  required
                  value={input.url}
                  onChange={(e) => handleChange(i, 'url', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Validity (days)"
                  type="number"
                  fullWidth
                  value={input.validity}
                  onChange={(e) => handleChange(i, 'validity', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Custom Shortcode"
                  fullWidth
                  value={input.shortcode}
                  onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
                />
              </Grid>
            </Grid>
          ))}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              onClick={addInput}
              disabled={inputs.length >= 5}
            >
              Add Another
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Shorten URLs
            </Button>
          </Box>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card elevation={3} sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {results.map((res, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                {res.shortlink ? (
                  <Box>
                    <Typography>
                      <strong>Shortlink:</strong>{' '}
                      <a href={res.shortlink} target="_blank" rel="noopener noreferrer">
                        {res.shortlink}
                      </a>
                    </Typography>
                    <Typography>
                      <strong>Expires At:</strong>{' '}
                      {new Date(res.expiry).toLocaleString()}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="error">
                    <strong>Error:</strong> {res.error}
                  </Typography>
                )}
                {idx !== results.length - 1 && <Divider sx={{ mt: 2, mb: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default URLForm;
