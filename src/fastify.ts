import Fastify from "fastify";
import { getAllRoutes } from "./routes";

const fastify = Fastify({
	logger: true,
});

for (const { prefix, routes } of getAllRoutes()) {
	fastify.register(routes, { prefix });
}

fastify.get("/health-check", async (request, reply) => {
	return { status: "ok" };
});

export default fastify;
