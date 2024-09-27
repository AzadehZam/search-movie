const http = require("http");
const fetch = require("node-fetch");
require("dotenv").config(); // Load environment variables from .env

// In-memory store for rate limiting
const rateLimitStore = {};

// Rate limit config: 10 requests per 1 minute (60000 milliseconds)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

const rateLimiter = (ip) => {
  const currentTime = Date.now();

  // Initialize data for the IP if it doesn't exist
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { requests: 1, firstRequestTime: currentTime };
    return false; // Not rate limited
  }

  const { requests, firstRequestTime } = rateLimitStore[ip];

  // Check if the current request is within the time window
  if (currentTime - firstRequestTime < RATE_LIMIT_WINDOW_MS) {
    if (requests >= MAX_REQUESTS) {
      return true; // Rate limit exceeded
    } else {
      // Increment request count
      rateLimitStore[ip].requests += 1;
      return false; // Not rate limited
    }
  } else {
    // Reset request count and time after window passes
    rateLimitStore[ip] = { requests: 1, firstRequestTime: currentTime };
    return false; // Not rate limited
  }
};

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", 86400); // Cache the preflight request for 1 day

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(204); // No Content
    return res.end();
  }

  const ip = req.socket.remoteAddress; // Get the user's IP address

  // Rate limiting check
  if (rateLimiter(ip)) {
    res.writeHead(429, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ message: "Too many requests, please try again later." })
    );
  }

  if (req.url.startsWith("/searchMovie") && req.method === "GET") {
    try {
      let q = req.url.split("?"),
        result = {};
      if (q.length >= 2) {
        q[1].split("&").forEach((item) => {
          try {
            result[item.split("=")[0]] = item.split("=")[1];
          } catch (e) {
            result[item.split("=")[0]] = "";
          }
        });
      }
      if (result.title) {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const omdbResponse = await fetch(
          "http://www.omdbapi.com/?" +
            new URLSearchParams({
              apikey: process.env.OMDB_API_KEY,
              t: result.title,
            }),
          requestOptions
        );

        const omdbResponseJson = await omdbResponse.json();
        if (omdbResponse.status === 200) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(omdbResponseJson));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Something went wrong" }));
        }
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "No movie title provided!" }));
      }
    } catch (error) {
      console.error(error);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("Unsupported Route");
  }
});

server.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
