import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fastify from "./fastify";

const serverUrl = "http://localhost:3000";

describe("Server Integration Test", () => {
	beforeAll(async () => {
		await fastify.listen({ port: 3000 });
	});

	afterAll(async () => {
		await fastify.close();
	});

	it("should return true when server is listening", () => {
		expect(fastify.server.listening).toBe(true);
	});

	it("should start the server and respond to /health-check", async () => {
		const response = await fastify.inject({
			method: "GET",
			url: "/health-check",
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toEqual({ status: "ok" });
	});

	it("should handle non-existent routes with 404", async () => {
		const response = await fastify.inject({
			method: "GET",
			url: "/non-existent-route",
		});

		expect(response.statusCode).toBe(404);
	});
});
