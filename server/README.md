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

  - Required fields:
    - `username`: User's chosen username
    - `email`: User's email address
    - `password`: User's password
  - Response:
    - JSON object containing:
      - User details
      - Account address (generated from Unique Network)
      - Mnemonic (generated from Unique Network)
      - JWT token for authentication

- `POST /api/loginUser`: Authenticate an existing user

  - Required fields:
    - `email`: User's email address
    - `password`: User's password
  - Response:
    - JSON object containing:
      - User details
      - JWT token for authentication

- `GET /api/getUser`: Retrieve details of the authenticated user
  - Authorization required: `Bearer <token>`
  - Response:
    - JSON object containing user details

### Items

- `POST /api/createItem`: Create a new item

  - Authorization required: `Bearer <token>`
  - Required fields:
    - `nameOfItem`: Name of the item
    - `priceOfItem`: Price of the item
    - `itemImage`: Image of the item (optional)
  - Description: Creates a new item in the database

- `GET /api/getItems`: Retrieve all items

  - Authorization: Not required
  - Description: Fetches all items stored in the database

- `POST /api/purchaseItem`: Purchase an existing item

  - Authorization required: `Bearer <token>`
  - Required fields:
    - `itemId`: ID of the item to purchase
    - `quantity`: Number of items to purchase
  - Description: Processes the purchase of an item for the authenticated user

- `GET /api/buyerPurchases`: Retrieve user's purchase history

  - Authorization required: `Bearer <token>`
  - Description: Fetches all purchases made by the authenticated user

- `GET /api/checkStorePurchases`: Retrieve store's sales history
  - Authorization required: `Bearer <token>`
  - Description: For store owners to view all purchases made from their store

### Tokens and Collections

- `POST /api/createAndMint`: This is for creating a new collection alongside the collection's token.
  - Required fields: `mnemonic`, `tokenName`, `tokenDescription`, `tokenPrefix`, `name`, `description`.
    It then gets user account from the mnemonic and creates a unique network collection and token.
  - Authorization required: `Bearer <token>`.
- `GET /api/getUserBalance`: This gets a user's current balance in the form of tokens/NFT acquired.
  - Required fields: `walletAddress`.
  - Authorization required: `Bearer <token>`.
- `POST /api/transferToken`: Transfer a token from one user to another.
  - Required fields:
    - `mnemonic`: The mnemonic of the signed-in user (token sender).
    - `collectionId`: The ID of the collection containing the token.
    - `tokenId`: The ID of the token to be transferred.
    - `toAddress`: The wallet address of the token receiver.
  - Authorization required: `Bearer <token>`.
  - Description: This endpoint uses the Unique Network SDK to transfer an NFT token from the sender's address to the receiver's address. It updates the token ownership in the database and returns the transfer details, including the new owner's address, token ID, and collection ID.
- `POST /api/mintToken`: Mint a new token and add it to an existing collection

  - Required fields:
    - `collectionId`: ID of the collection to add the token to
    - `mnemonic`: Mnemonic phrase of the authenticated user
    - `tokenName`: Name of the new token
    - `tokenDescription`: Description of the new token
  - Authorization required: `Bearer <token>`
  - Description: This endpoint creates a new token and adds it to the specified collection. It uses the provided mnemonic to authenticate the user and perform the minting process.

- `GET /api/getCollections`: Retrieve all collections owned by the authenticated user
  - Authorization required: `Bearer <token>`
  - Description: This endpoint returns a list of all collections associated with the currently authenticated user. No additional parameters are required.
