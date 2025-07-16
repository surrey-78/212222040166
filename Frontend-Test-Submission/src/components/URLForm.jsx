import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
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
        try {
          const validityInMinutes = validity ? parseInt(validity) * 1440 : undefined; 
          const res = await axios.post('http://localhost:8000/shorturls', {
            url,
            validity: validityInMinutes,
            shortcode: shortcode || undefined
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
    <div style={{ padding: 24 }}>
      <Grid container spacing={2}>
        {inputs.map((input, i) => (
          <Grid container item spacing={1} key={i}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="URL"
                fullWidth
                required
                value={input.url}
                onChange={e => handleChange(i, 'url', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Validity (days)"
                type="number"
                fullWidth
                value={input.validity}
                onChange={e => handleChange(i, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Shortcode"
                fullWidth
                value={input.shortcode}
                onChange={e => handleChange(i, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button onClick={addInput} disabled={inputs.length >= 5} variant="outlined" style={{ marginRight: 8 }}>
            Add Another
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Shorten URLs
          </Button>
        </Grid>
      </Grid>

      <div style={{ marginTop: 24 }}>
        {results.map((res, idx) => (
          <div key={idx}>
            {res.shortlink ? (
              <p>
                <strong>Shortlink:</strong> <a href={res.shortlink} target="_blank" rel="noopener noreferrer">{res.shortlink}</a><br />
                <strong>Expires at:</strong> {res.expiry}
              </p>
            ) : (
              <p style={{ color: 'red' }}>Error: {res.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default URLForm;
