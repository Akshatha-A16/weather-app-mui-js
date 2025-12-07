import { useEffect, useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Switch,
  FormControlLabel,
  Container,
  Paper,
  InputBase,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';


const KEY = process.env.REACT_APP_WEATHER_KEY;
const BASE  = 'https://api.openweathermap.org/data/2.5/weather';

const light = createTheme({ palette: { mode: 'light' } });
const dark  = createTheme({ palette: { mode: 'dark' } });

function App() {
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('dark') || 'false'));
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => localStorage.setItem('dark', JSON.stringify(darkMode)), [darkMode]);

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true); setError('');
    try {
      const { data: res } = await axios.get(BASE, { params: { q: city, units: 'metric', appid: KEY } });
      setData(res);
      setCity('');
    } catch (e) {
      setError(e.response?.data?.message || 'City not found');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkMode ? dark : light}>
      <CssBaseline />
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={() => setDarkMode(d => !d)} />}
        label="Dark"
        sx={{ position: 'absolute', top: 16, right: 16 }}
      />
      <Container maxWidth="xs" sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Weather App
        </Typography>

        <Paper
          component="form"
          onSubmit={(e) => { e.preventDefault(); search(); }}
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '10px' }}>
            <SearchIcon />
          </IconButton>
        </Paper>

        {loading && <CircularProgress sx={{ mt: 3 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {data && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5">{data.name}</Typography>
              <Typography variant="h3" color="primary">
                {Math.round(data.main.temp)}°C
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip label={data.weather[0].description.toUpperCase()} color="secondary" />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
                <Typography variant="body2">Humidity: {data.main.humidity}%</Typography>
                <Typography variant="body2">Wind: {data.wind.speed} m/s</Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;