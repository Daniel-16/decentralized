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
  - Required fields: `nameOfItem`, `priceOfItem`, `itemImage`(optional).
  - Authorization required: `Bearer ${token}`
- `GET /api/getItems`: Gets all items in DB.
- `POST /api/purchaseItems`: Purchases an already existing item.
  - Required fields: `itemId`, `quantity`.
  - Authorization required: `Bearer ${token}`
- `GET /api/buyerPurchases`: Check all purchases made by a signed in user.
  - Authorization required: `Bearer ${token}`.
- `GET /api/checkStorePurchases`: This is for store owners to check purchases made to only their stores.
  - Authorization required: `Bearer ${token}`.

### Tokens and Collections

- `POST /api/createAndMint`: This is for creating a new collection alongside the collection's token.
  - Required fields: `mnemonic`, `tokenName`, `tokenDescription`, `tokenPrefix`, `name`, `description`.
    It then gets user account from the mnemonic and creates a unique network collection and token.
  - Authorization required: `Bearer ${token}`.
- `GET /api/getUserBalance`: This gets a user's current balance in the form of tokens/NFT acquired.
  - Required fields: `walletAddress`.
  - Authorization required: `Bearer ${token}`.
- `POST /api/transferToken`: Transfer a token from one user to another.
  - Required fields:
    - `mnemonic`: The mnemonic of the signed-in user (token sender).
    - `collectionId`: The ID of the collection containing the token.
    - `tokenId`: The ID of the token to be transferred.
    - `toAddress`: The wallet address of the token receiver.
  - Authorization required: `Bearer ${token}`.
  - Description: This endpoint uses the Unique Network SDK to transfer an NFT token from the sender's address to the receiver's address. It updates the token ownership in the database and returns the transfer details, including the new owner's address, token ID, and collection ID.
- `POST /api/mintToken`: Mint a new token and add it to an existing collection

  - Required fields:
    - `collectionId`: ID of the collection to add the token to
    - `mnemonic`: Mnemonic phrase of the authenticated user
    - `tokenName`: Name of the new token
    - `tokenDescription`: Description of the new token
  - Authorization required: `Bearer ${token}`
  - Description: This endpoint creates a new token and adds it to the specified collection. It uses the provided mnemonic to authenticate the user and perform the minting process.

- `GET /api/getCollections`: Retrieve all collections owned by the authenticated user
  - Authorization required: `Bearer ${token}`
  - Description: This endpoint returns a list of all collections associated with the currently authenticated user. No additional parameters are required.
