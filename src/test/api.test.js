const request = require("supertest");
const app = require("../app");
const db = require("../database/db");

let userId;
let userToken;
let adminToken;

beforeAll(async () => {
   await db.authenticate();

   // Obtain admin token
   const adminLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({
         email: "admin@example.com",
         password: "12345678",
      })
      .set("Accept", "application/json");

   adminToken = adminLoginResponse.body.token;
});

afterAll(async () => {
   await db.close();
});

describe("API Health Check", () => {
   test("should return healthy status", async () => {
      const response = await request(app).get("/api/healthy");

      const status = response.status;

      expect(status).toBe(200);
   });
});

describe("User Registration", () => {
   test("should register a new user", async () => {
      const response = await request(app)
         .post("/api/auth/register")
         .send({
            first_name: "TestUser",
            email: "test@user.com",
            password: "12345",
         })
         .set("Accept", "application/json");

      const { status, body } = response;

      expect(status).toBe(200);
      expect(body.success).toBe(true);

      userId = body.data.userId;
   });

   test("should not allow duplicate email registration", async () => {
      const response = await request(app)
         .post("/api/auth/register")
         .send({
            first_name: "TestUser2",
            email: "test@user.com",
            password: "12345",
         })
         .set("Accept", "application/json");

      const { status, body } = response;

      expect(status).toBe(500);
      expect(body.success).toBe(false);
   });

   test("should not register user with invalid email", async () => {
      const response = await request(app)
         .post("/api/auth/register")
         .send({
            first_name: "TestUser3",
            email: "testuser.com",
            password: "12345",
         })
         .set("Accept", "application/json");

      const { status, body } = response;

      expect(status).toBe(400);
      expect(body.success).toBe(true);
   });
});

describe("User Authentication", () => {
   test("should login an existing user", async () => {
      const response = await request(app)
         .post("/api/auth/login")
         .send({
            email: "test@user.com",
            password: "12345",
         })
         .set("Accept", "application/json");

      const { status, body } = response;

      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(typeof body.token).toEqual("string");

      userToken = body.token;
   });
});

describe("User Profile Management", () => {
   test("should retreive user profile for authenticated user", async () => {
      const response = await request(app)
         .get("/api/users/profile")
         .set("Authorization", `Bearer ${userToken}`)
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
   });

   test("should not delete a user without admin token", async () => {
      const response = await request(app)
         .delete(`/api/users/${userId}`)
         .set("Accept", "application/json")
         .set("Authorization", `Bearer ${userToken}`);

      const { status } = response;
      expect(status).toBe(403);
   });

   test("should delete an authenticated user by admin", async () => {
      const response = await request(app)
         .delete(`/api/users/${userId}`)
         .set("Accept", "application/json")
         .set("Authorization", `Bearer ${adminToken}`);

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body.success).toBe(true);
   });
});
