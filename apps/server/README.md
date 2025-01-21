# KooponCraftAPI

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
- `GET /api/getStores`: Retrieve details of all stores
  - Authorization required: `Bearer <token>`
  - Response:
    - JSON object containing all stores

### Items (Ignore for now)

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

- `GET /api/getStoreItems`: Retrieve all items for a specific store

  - Authorization required: `Bearer <token>`
  - Description: Fetches all items for a specific store

#### Purchase Items (Priority: High)

- `POST /api/purchaseItem`: Purchase an item in the form of a token (NFT)

  - Authorization required: `Bearer <token>`
  - Required fields:
    - `tokenId`: ID of the token to purchase
    - `collectionId`: ID of the collection containing the token
    - `priceOfCoupon`: Price of the coupon. In this case, it is the price of the item.
    - `isItem`: Boolean value to indicate if the token is an actual item.
  - Description: Purchases an item in the form of a token (NFT) and adds it to the user's collection.

- `GET /api/buyerPurchases`: Retrieve user's purchase history

  - Authorization required: `Bearer <token>`
  - Description: Fetches all purchases made by the authenticated user

- `GET /api/checkStorePurchases`: Retrieve store's sales history
  - Authorization required: `Bearer <token>`
  - Description: For store owners to view all purchases made from their store

### Tokens and Collections

- `POST /api/createCollection`: Create a new collection
  - Authorization required: `Bearer <token>`
  - Required fields:
    - `name`: Name of the collection
    - `description`: Description of the collection
    - `tokenPrefix`: Prefix for tokens in this collection
  - Description: This endpoint creates a new unique network collection. It uses the authenticated user's mnemonic to retrieve the user's account, then creates the collection with the specified name, description, and token prefix. The newly created collection is associated with the authenticated user.
- `GET /api/getUserBalance`: This gets a user's current balance from their UNQ wallet.
  - Authorization required: `Bearer <token>`
  - Description: Retrieves the balance information for the authenticated user's UNQ wallet and updates the user's balance in the database.
- `POST /api/transferToken`(Obsolete for now): Transfer a token from one user to another.
  - Required fields:
    - `mnemonic`: The mnemonic of the signed-in user (token sender).
    - `collectionId`: The ID of the collection containing the token.
    - `tokenId`: The ID of the token to be transferred.
    - `toAddress`: The wallet address of the token receiver.
  - Authorization required: `Bearer <token>`.
  - Description: This endpoint uses the Unique Network SDK to transfer an NFT token from the sender's address to the receiver's address. It updates the token ownership in the database and returns the transfer details, including the new owner's address, token ID, and collection ID.
- `POST /api/mintToken`: Mint a new token and add it to an existing collection

  - Required fields:
    - `collectionId`: ID of the collection to add the token to.
    - `tokenName`: Name of the new token.
    - `tokenImageUrl`: URL of the token's image.
    - `tokenDescription`: Description of the new token.
  - Authorization required: `Bearer <token>`
  - Description: This endpoint creates a new token and adds it to the specified collection. It gets the mnemonic from the authenticated user and mints the token.

- `GET /api/getCollections`: Retrieve all collections owned by the authenticated user

  - Authorization required: `Bearer <token>`
  - Description: This endpoint returns a list of all collections associated with the currently authenticated user. No additional parameters are required.

- `POST /api/purchaseCoupon`: Purchase a coupon

  - Authorization required: `Bearer <token>`
  - Required fields:
    - `tokenId`: ID of the coupon to purchase
    - `collectionId`: ID of the collection containing the coupon
  - Description: This endpoint allows the user to purchase a coupon with their UNQ balance. It updates the coupon's purchase status and adds the coupon to the user's collection.

<!-- - `DELETE /api/burnToken`: Burn a token. Also used to redeem a coupon.

  - Authorization required: `Bearer <token>`
  - Required fields: `collectionId`, `tokenId`
  - Description: This endpoint allows the user to burn a token. If the token is a coupon, it will be redeemed. -->

- `POST /api/initiateCouponSwap`: Initiate a coupon swap with another user

  - Authorization required: `Bearer <token>`
  - Required fields:
    - `ownCollectionId`: ID of the collection containing the coupon to swap from the coupon owner's collection
    - `ownTokenId`: ID of the coupon to swap from the coupon owner's collection
    - `desiredCollectionId`: ID of the collection containing the coupon to swap to the coupon owner's collection
    - `desiredTokenId`: ID of the coupon to swap to the coupon owner's collection
    - `recipientAddress`: Wallet address of the user to swap the coupon with
  - Description: This endpoint allows the user to initiate a coupon swap with another user. It updates the coupon's swap status and adds the coupon to the user's collection.

- `POST /api/acceptCouponSwap`: Accept a coupon swap with another user

  - Authorization required: `Bearer <token>`
  - Required fields:
    - `swapOfferId`: ID of the swap offer to accept
  - Description: This endpoint allows the user to accept a coupon swap with another user. It updates the coupon's swap status and adds the coupon to the user's collection.

  - `POST /api/declineCouponSwap`: Decline a coupon swap with another user

    - Authorization required: `Bearer <token>`
    - Required fields:
      - `swapOfferId`: ID of the swap offer to decline
    - Description: This endpoint allows the user to decline a coupon swap offer from another user. It updates the swap offer status to declined and notifies the offer creator.

- `POST /api/mintSpecialToken`: Mint a special token
  - Authorization required: `Bearer <token>`
  - Required fields:
    - `collectionId`: ID of the collection containing the special token
    - `tokenName`: Name of the special token
    - `tokenDescription`: Description of the special token
    - `tokenImageUrl`: URL of the special token's image
  - Description: This endpoint allows the store owner to mint a special token. It updates the special token's ownership in the database if the token is won by the user when the user purchases two or more items from the store.

#### Redeem Coupons

- `POST /api/redeemCoupon`: Sends a request to redeem a coupon to the store owner
  - Authorization required: `Bearer <token>`
  - Required fields:
    - `collectionId`: ID of the collection containing the coupon.
    - `tokenId`: ID of the coupon to redeem.
  - Description: This endpoint allows the user to send a request to redeem a coupon to the store owner.
- `DELETE /api/acceptRedeemRequest/:redeemRequestId`: Accepts a redeem request from a user
  - Authorization required: `Bearer <token>`
  - Required fields:
    - `/:redeemRequestId`: ID of the redeem request to accept.
  - Description: This endpoint allows the store owner to accept a redeem request from a user and it then calls the burnTokenHelper to burn the coupon.

## Marketplace

- `GET /api/getAllCoupons`: Retrieve all coupons
  - Description: Fetches all coupons available for purchase and are not items.
- `GET /api/getStoreCoupons`: Retrieve all coupons for a specific store
  - Description: Fetches all coupons and items available for purchase for a specific store.

### New updates (11/08/24)

- Added a category field to the `TokenModel`.
- Added validation for the category field in the `CreateAndMintToken.js` file.
- `GET /api/getItemsByCategory/:category`: Retrieve all items for a specific category
  - Description: Fetches all items for a specific category.
- Removed the conversion of UNQ to USD in the `mintToken` endpoint.
- `GET /api/getLeaderboard`: Retrieve the top 10 users by points for leaderboard
  - Description: Fetches the top 10 users by points for leaderboard.
