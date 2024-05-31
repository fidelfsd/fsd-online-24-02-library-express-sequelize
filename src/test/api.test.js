const request = require("supertest");
const app = require("../app");
const db = require("../database/db");

let server;
let userId;

beforeAll(async () => {
   await db.authenticate();
   server = app.listen(4000);
});

afterAll(async () => {
   if (server) server.close();
   await db.close();
});

describe("API Health Check", () => {
   test("should return healthy status", async () => {
      const response = await request(server).get("/api/healthy");

      const status = response.status;

      expect(status).toBe(200);
   });
});

describe("User Registration", () => {
   test("should register a new user", async () => {
      const response = await request(server)
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
      const response = await request(server)
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
});


describe("User Authentication", () => {
   test("should login an existing user", async() => {
      const response = await request(server).post()
   })
})


describe("User Profile Management", () => {
   test("should delete an authenticated user", async () => {
      const response = await request(server)
         .delete(`/api/users/${userId}`)
         .set("Accept", "application/json");

      const { status, body } = response;
      expect(status).toBe(200);
      expect(body.success).toBe(true);
   });
});


