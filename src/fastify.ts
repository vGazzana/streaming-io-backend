import Fastify from "fastify";
import onRequest from "./hooks/onRequest";
import { getAllRoutes } from "./routes";

const fastify = Fastify({
	logger: true,
});

fastify.addHook("onRequest", onRequest);

for (const { prefix, routes } of getAllRoutes()) {
	fastify.register(routes, { prefix });
}

fastify.get("/health-check", async (request, reply) => {
	return { status: "ok" };
});

export default fastify;
