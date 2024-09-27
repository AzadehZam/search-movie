import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App"; // Adjust the import path according to your file structure
import "@testing-library/jest-dom/extend-expect"; // For better assertions

beforeEach(() => {
  fetch.resetMocks(); // Reset mocks before each test
});

test("renders Movie Search title", () => {
  render(<App />);
  const titleElement = screen.getByText(/movie search/i);
  expect(titleElement).toBeInTheDocument();
});

test("displays 'Movie not found!' when no movie is found", async () => {
  fetch.mockResponseOnce(
    JSON.stringify({ Response: "False", Error: "Movie not found!" })
  );

  render(<App />);

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/enter movie title/i), {
    target: { value: "NonExistentMovie" },
  });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  // Assert that the "Movie not found!" message is displayed
  expect(await screen.findByText(/movie not found!/i)).toBeInTheDocument();
});

test("displays movie data when movie is found", async () => {
  const movieData = {
    Title: "Inception",
    Year: "2010",
    Genre: "Action, Sci-Fi",
    Director: "Christopher Nolan",
    Writer: "Christopher Nolan",
    Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt",
    Country: "USA",
    Plot: "A thief who steals corporate secrets through the use of dream-sharing technology...",
    imdbRating: "8.8",
    Poster: "https://example.com/inception.jpg",
  };

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ Response: "True", ...movieData }),
  });

  render(<App />);
  const input = screen.getByLabelText(/Enter Movie Title/i);
  fireEvent.change(input, { target: { value: "Inception" } });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  const titleElement = await screen.findByText(/Inception/i);
  expect(titleElement).toBeInTheDocument();
  expect(screen.getByText(/2010/i)).toBeInTheDocument();
  expect(screen.getByText(/action, sci-fi/i)).toBeInTheDocument();

  // Check for the Director and Writer
  const directors = screen.getAllByText(/Christopher Nolan/i);
  expect(directors.length).toBe(2); // Expecting two occurrences

  expect(screen.getByText(/leonardo dicaprio/i)).toBeInTheDocument();
  expect(screen.getByText(/usa/i)).toBeInTheDocument();
});

test("displays error message on fetch failure", async () => {
  fetch.mockRejectOnce(new Error("Network error"));

  render(<App />);

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/enter movie title/i), {
    target: { value: "SomeMovie" },
  });
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

  // Assert that the error message is displayed
  expect(
    await screen.findByText(/error: \[network error\]/i)
  ).toBeInTheDocument();
});
