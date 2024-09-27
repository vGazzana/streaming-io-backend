import Fastify from "fastify";

const fastify = Fastify({
	logger: true,
});

fastify.get("/health-check", async (request, reply) => {
	return { status: "ok" };
});

export default fastify;
