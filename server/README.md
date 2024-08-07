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
  - Expected response: JSON object containing user details as well as an account address and mnemonic generated from the unique network. A web token is also sent to keep the user signed in for a while.
- `POST /api/loginUser`: Signs in an existing user.
  - Required fields: `email`, `password`.
  - Expected response: JSON object containing user details as well as web token.
- `GET /api/getUser`: Returns the details of a signed in user.
  - Authorization required: `Bearer ${token}`

### Items

- `POST /api/createItem`: Creates a new item
  - Required fields: `nameOfItem`, `priceOfItem`.
  - Authorization required: `Bearer ${token}`
- `GET /api/getItems`: Gets all items in DB.
- `POST /api/purchaseItems`: Purchases an already existing item.
  - Required fields: `itemId`, `quantity`.
  - Authorization required: `Bearer ${token}`
- `GET /api/purchases`: This is for a user to check purchases they have made.
  - Authorization required: `Bearer ${token}`.
- `GET /api/checkStorePurchases`: This is for store owners to check purchases made to only their stores.
  - Authorization required: `Bearer ${token}`.

### Tokens and Collections

- `POST /api/createAndMint`: This is for creating a new collection alongside the collection's token.
  - Required fields: `mnemonic`, `tokenName`, `tokenDescription`, `tokenPrefix`, `name`, `description`.
    It then gets user account from the mnemonic and creates a unique network collection and token.
  - Authorization required: `Bearer ${token}`.
- `GET /api/getUserBalance`: This gets a user's current balance in the form of tokens acquired.
  - Required fields: `walletAddress`.
  - Authorization required: `Bearer ${token}`.
