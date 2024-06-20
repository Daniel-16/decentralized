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
   ```
2. Start the development server
   ```
   npm run dev
   ```
   The server would run on `http://localhost:5500`

## API Endpoints

### Store

- `POST /api/createStore`: Create a store
  - Required fields: `nameOfStore`.
- `POST /api/createService/:storeId`: Create a service with the store id as param.
  - Required fields: `nameOfService`.
- `POST /api/createCoupon/:storeId`: Create a coupon for relevant store and service.
  - Required fields: `collectionId`, `tokenId`, `redeemed`.
- `GET /api/getStores`: Get all the stores available in the Database.
- `GET /api/getServices`: Get all services available in the Database.
