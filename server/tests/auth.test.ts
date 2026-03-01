import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createServer } from "../index";
import mongoose from "mongoose";

// Setup and Teardown
const app = createServer();

describe("Auth API Endpoints", () => {
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    name: "Test User",
    password: "securepassword123",
  };

  // We are not connecting to a real DB, so these tests will hit the Mongoose schema errors
  // To test the API structure (validation, headers, routing), we test the validation failure first

  it("should fail signup if password is too short", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ ...testUser, password: "short" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should fail signup if email is invalid", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ ...testUser, email: "not-an-email" });

    expect(response.status).toBe(400);
  });

  it("should fail login with missing credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(400);
  });

  it("should reject unauthorized requests to /me", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "No token provided");
  });
});
