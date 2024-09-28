import request from "supertest";
import mongoose from "mongoose";
import app from "./index.js";
import UserModel from "./models/UserModel.js";
import ItemModel from "./models/ItemsModel.js";

describe("Server API Tests", () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await UserModel.deleteMany({});
    await ItemModel.deleteMany({});
  });

  describe("User Routes", () => {
    test("POST /api/createUser - Create a new user", async () => {
      const response = await request(app).post("/api/createUser").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.username).toBe("testuser");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("account");
      expect(response.body).toHaveProperty("mnemonic");
    });

    test("POST /api/loginUser - Login user", async () => {
      // First, create a user
      await UserModel.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const response = await request(app).post("/api/loginUser").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
    });
  });

  describe("Item Routes", () => {
    let authToken;

    beforeEach(async () => {
      // Create a user and get the auth token
      const user = await UserModel.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
      authToken = generateToken(user);
    });

    test("POST /api/createItem - Create a new item", async () => {
      const response = await request(app)
        .post("/api/createItem")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          nameOfItem: "Test Item",
          itemImage: "base64encodedimage",
          priceOfItem: 100,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.newItem).toHaveProperty("_id");
      expect(response.body.newItem.nameOfItem).toBe("Test Item");
      expect(response.body.newItem.priceOfItem).toBe(100);
    });

    test("GET /api/getItems - Get all items", async () => {
      // Create a test item
      await ItemModel.create({
        nameOfItem: "Test Item",
        itemImage: "base64encodedimage",
        priceOfItem: 100,
        itemOwnerId: "testownerid",
        itemOwner: "Test Owner",
      });

      const response = await request(app).get("/api/getItems");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBe(1);
      expect(response.body.items[0].nameOfItem).toBe("Test Item");
    });
  });
});
