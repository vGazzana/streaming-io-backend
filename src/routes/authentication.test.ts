import fastify from "../fastify"; // O caminho do seu servidor Fastify// O caminho do cliente Prisma
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// Mocking prisma
vi.mock("@prisma/client", () => {
	return {
		PrismaClient: vi.fn().mockImplementation(() => ({
			users: {
				findUnique: () => {
					return {
						id: "clck6yx6x00002blg7p64q123",
						name: "Mock User - Vitest",
						email: "mock_prisma@vitest.dev",
						password: "123",
						status: "ACTIVE",
					};
				},
				findFirst: vi.fn(),
				create: () => {
					return {
						id: "clck6yx6x00002blg7p64q123",
						name: "Mock User - Vitest",
						email: "mock_prisma@vitest.dev",
						password: "123",
						status: "ACTIVE",
					};
				},
			},
		})),
	};
});

describe("Auth Routes Integration Test", () => {
	beforeAll(async () => {
		await fastify.listen({ port: 9091 });
	});

	afterAll(async () => {
		await fastify.close();
		vi.clearAllMocks();
	});

	it("POST /auth/login - httpstatus 200", async () => {
		const response = await fastify.inject({
			method: "POST",
			url: "/auth/login",
			payload: {
				data: {
					email: "mock_prisma@vitest.dev",
					password: "123",
				},
			},
		});
		expect(response.statusCode).toBe(200);
	});

	it("POST /auth/register - httpstatus 200", async () => {
		const response = await fastify.inject({
			method: "POST",
			url: "/auth/register",
			payload: {
				data: {
					name: "Mock User - Vitest",
					email: "mock_prisma@vitest.dev",
					password: "123",
				},
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.json().status).toBe("success");
	});
});
