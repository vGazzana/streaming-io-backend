import Fastify from "fastify";
import onResponse from "./hooks/onResponse";
import { getAllRoutes } from "./routes";

const fastify = Fastify({
	logger: true,
});

fastify.addHook("onResponse", onResponse);

for (const { prefix, routes } of getAllRoutes()) {
	fastify.register(routes, { prefix });
}

fastify.get("/health-check", async (request, reply) => {
	return { status: "ok" };
});

export default fastify;
