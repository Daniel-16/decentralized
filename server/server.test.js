import request from "supertest";
import mongoose from "mongoose";
import app from "./index.js";
import UserModel from "./models/UserModel.js";
import connectDB from "./db.js";

describe("Server and User Signup API", () => {
  let server;

  beforeAll(async () => {
    await connectDB();
    server = app.listen(0);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should start the server successfully", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });

  it("should create a new user successfully", async () => {
    const newUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/createUser")
      .send(newUser)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.username).toBe(newUser.username);
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.token).toBeDefined();
    expect(response.body.account).toBeDefined();
    expect(response.body.mnemonic).toBeDefined();
  });

  it("should not create a user with an existing email", async () => {
    const existingUser = {
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    };

    await request(app).post("/api/createUser").send(existingUser);

    const response = await request(app)
      .post("/api/createUser")
      .send(existingUser)
      .expect("Content-Type", /json/)
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("A user with this email already exist");
  });
});
