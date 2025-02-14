import request from "supertest";
import app from "../server"; // Ensure this is the correct path to your Express app

describe("User API", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "John Doe",
      email: "john@example.com",
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("John Doe");
  });

  it("should fetch all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return 404 for a non-existent user", async () => {
    const res = await request(app).get("/api/users/nonexistent-id");
    expect(res.status).toBe(404);
  });
});
