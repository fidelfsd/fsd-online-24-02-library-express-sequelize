const request = require("supertest");
const app = require("../app");
const db = require("../database/db");

let server;

beforeAll(async () => {
   await db.authenticate();
   server = app.listen(4000);
});

afterAll(async () => {
   if (server) await server.close();
   await db.close();
});

describe("API Health Check", () => {
   test("should return healthy status", async () => {
      const response = await request(server).get("/api/healthy");

      const status = response.status;

      expect(status).toBe(200);
   });
});
