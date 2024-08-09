# Decentralized API

## Prerequisites

- Node.js (v12 or later).
- MongoDB (v4 or later).

## Installation

1. Clone the repository
   ```
   git clone https://github.com/Daniel-16/decentralized.git
   ```
2. Navigate to the project directory:
   ```
   cd decentralized
   cd server
   ```
3. Install the dependencies
   ```
   npm install
   ```

## Setup

1. Create a `.env` file in the root directory and add the following environment variables
   ```bash
   MONGODB_DEV=mongodb://localhost:27017/decentralized
   BASE_URL=https://rest.unique.network/opal/v1
   JWT_SECRET=enter-a-jwt-secret-here
   ```
2. Start the development server
   ```
   npm start
   ```
   If you have nodemon installed globally, you could run
   ```
   npm run dev
   ```
   The server would run on `http://localhost:5500`

## API Endpoints

### User

- `POST /api/createUser`: Create a new user
  - Required fields: `username`, `email`, `password`
  - Expected response: JSON object containing user details as well as an account address from the unique network. A web token is also sent to keep the user signed in for a while.
- `POST /api/loginUser`: Signs in an existing user.
  - Required fields: `email`, `password`.
  - Expected response: JSON object containing user details as well as web token.
- `GET /api/getUser`: Returns the details of a signed in user.
  - Authorization required in header: `Bearer token`
- `GET /api/getStores`: Get all the stores available in the Database.
- `GET /api/getServices`: Get all services available in the Database.
