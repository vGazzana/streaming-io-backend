import type { FastifyReply, FastifyRequest } from "fastify";
import fastify from "../fastify";
import { validateToken } from "../libs/jwt";
import { getAllPublicRoutes } from "../routes";

const publicRoutes = getAllPublicRoutes();
publicRoutes.push("/health-check");
export default async function onRequest(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { url, method } = request;
	const routeExists = fastify.hasRoute({
		url,
		//@ts-ignore
		method,
	});

	if (!routeExists) {
		return reply
			.status(404)
			.send({ error: true, message: `Cannot ${method}: ${url}!` });
	}

	if (!publicRoutes.includes(url)) {
		const authorization = request.headers.authorization;

		if (!authorization) {
			return reply
				.status(401)
				.send({ error: true, message: "Authorization header not found!" });
		}

		const [bearer, token] = authorization.split(" ");

		if (bearer !== "Bearer" || !token || token === "undefined") {
			return reply
				.status(401)
				.send({ error: true, message: "Token not found or malformed!" });
		}

		const jwt = await validateToken(token);

		if (!jwt.valid) {
			return reply.code(401).send({ error: true, message: "Invalid token!" });
		}

		request.user = jwt.payload;
	}
}
