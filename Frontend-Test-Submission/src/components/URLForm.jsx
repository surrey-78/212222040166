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
          const res = await axios.post('http://localhost:8000/shorturls', {
            url,
            validity: parseInt(validity),
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
    <div>
      <Grid container spacing={2}>
        {inputs.map((input, i) => (
          <Grid item xs={12} key={i}>
            <TextField label="URL" fullWidth onChange={e => handleChange(i, 'url', e.target.value)} />
            <TextField label="Validity (mins)" onChange={e => handleChange(i, 'validity', e.target.value)} />
            <TextField label="Shortcode" onChange={e => handleChange(i, 'shortcode', e.target.value)} />
          </Grid>
        ))}
        <Button onClick={addInput} disabled={inputs.length >= 5}>Add Another</Button>
        <Button onClick={handleSubmit}>Shorten URLs</Button>
      </Grid>
      {results.map((res, idx) => (
        <div key={idx}>
          {res.shortlink ? (
            <p>{res.shortlink} — expires at {res.expiry}</p>
          ) : (
            <p style={{ color: 'red' }}>Error: {res.error}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default URLForm;
