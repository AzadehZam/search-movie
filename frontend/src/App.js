import "./App.css";
import { useState, useCallback } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Box,
  Rating,
} from "@mui/material";
import { Movie as MovieIcon } from "@mui/icons-material";

function App() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);

  const MAX_CACHE_SIZE = 10;

  const saveMovieDataToLocalStorage = (title, data) => {
    let cachedMovies = JSON.parse(localStorage.getItem("cachedMovies")) || [];

    if (cachedMovies.length >= MAX_CACHE_SIZE) {
      cachedMovies.shift();
    }
    cachedMovies.push({ title, data });

    localStorage.setItem("cachedMovies", JSON.stringify(cachedMovies));
  };

  const fetchMovieData = useCallback(async () => {
    let cachedMovies = JSON.parse(localStorage.getItem("cachedMovies")) || [];
    const cachedMovie = cachedMovies.find((movie) => movie.title === title);

    if (cachedMovie) {
      setMovieData(cachedMovie.data);
      setMessage("");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/";

      const response = await fetch(`${API_URL}searchMovie?title=${title}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.Response === "False") {
        setMessage(`Error: ${data.Error}`);
        setMovieData(null);
      } else {
        setMovieData(data);
        saveMovieDataToLocalStorage(title, data);
        setMessage("");
      }
    } catch (err) {
      setMessage(`Error: [${err.message}]`);
    } finally {
      setLoading(false);
    }
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMovieData(null);
    fetchMovieData();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        <MovieIcon fontSize="large" sx={{ mr: 1, color: "#3f51b5" }} />
        <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
          Movie Search
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Enter Movie Title"
          value={title}
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            textTransform: "none",
            mb: 3,
            backgroundColor: "#3f51b5", // Custom button color matching the MovieIcon
            "&:hover": {
              backgroundColor: "#303f9f", // Slightly darker hover effect
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </form>

      {message && (
        <Typography
          variant="body2"
          color="error"
          sx={{
            mt: 2,
            textAlign: "center",
            fontWeight: "bold",
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "error.main",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
          }}
        >
          {message}
        </Typography>
      )}

      {movieData && (
        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <img
                  src={movieData.Poster}
                  alt={movieData.Title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {movieData.Title}
                </Typography>
                <Typography variant="body1">
                  <strong>Year:</strong> {movieData.Year}
                </Typography>
                <Typography variant="body1">
                  <strong>Genre:</strong> {movieData.Genre}
                </Typography>
                <Typography variant="body1">
                  <strong>Director:</strong> {movieData.Director}
                </Typography>
                <Typography variant="body1">
                  <strong>Writer:</strong> {movieData.Writer}
                </Typography>
                <Typography variant="body1">
                  <strong>Actors:</strong> {movieData.Actors}
                </Typography>
                <Typography variant="body1">
                  <strong>Country:</strong> {movieData.Country}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Plot:</strong> {movieData.Plot}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    IMDB Rating: {movieData.imdbRating}
                  </Typography>
                  <Rating
                    name="imdb-rating"
                    value={Number(movieData.imdbRating) / 2}
                    precision={0.1}
                    readOnly
                    sx={{ ml: 2 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default App;
