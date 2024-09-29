# Movie Search Application

A simple movie search application that allows users to search for movies using the OMDB API. This project is built with React for the frontend and Node.js for the backend, featuring a rate limiter and CORS handling.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- Search for movies by title.
- Displays movie details fetched from the OMDB API.
- Implements rate limiting to prevent abuse.
- CORS handling for secure cross-origin requests.

## Technologies Used

- **Frontend:** React, JavaScript, CSS, MUI
- **Backend:** Node.js
- **API:** OMDB API
- **Deployment:** Vercel (frontend), Heroku (backend)
- **CI/CD:** GitHub Actions for continuous integration

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AzadehZam/search-movie.git
   ```
   
2. Navigate to the frontend directory:
   ```bash
   cd search-movie/frontend
   ```

3. Install the frontend dependencies:
   ```bash
   npm install
   ```

4. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```

5. Install the backend dependencies:
   ```bash
   npm install
   ```

6. Create a `.env` file in the backend directory and add your OMDB API key:
   ```plaintext
   OMDB_API_KEY=your_api_key_here
   ```

## Usage

1. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```

2. Start the frontend application:
   ```bash
   cd frontend
   npm start
   ```

3. Open your web browser and go to `http://localhost:3000` to view the application.

## Deployment

- The frontend is deployed on Vercel. You can view it [here](https://search-movie-dxax1kazo-azadehzams-projects.vercel.app/).
- The backend is deployed on Heroku. You can view it [here](https://search-server-6ccacca5eaaf.herokuapp.com/).

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss changes or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

