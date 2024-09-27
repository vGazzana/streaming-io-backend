import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { signInPayload } from "../libs/jwt";
import prisma from "../libs/prisma";

const authenticationRoutes = {
	prefix: "/auth",
	_public: ["/login", "/register"],
	get public() {
		return this._public.map((route) => `${this.prefix}${route}`);
	},
	routes: async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
		fastify.post("/login", async (request, reply) => {
			try {
				//gonna be a schema later
				const { data } = request.body as {
					data: {
						[key: string]: string;
					};
				};

				const { email, password } = data;

				const userExists = await prisma.users.findUnique({ where: { email } });

				if (!userExists) {
					return reply.status(404).send({
						status: "warning",
						message: "User not found!",
						data: null,
					});
				}

				if (userExists.status !== "ACTIVE") {
					return reply.status(403).send({
						status: "warning",
						message: "User is not active!",
						data: null,
					});
				}

				const isPasswordMatch = password === userExists.password;

				if (!isPasswordMatch) {
					return reply.status(401).send({
						status: "warning",
						message: "Invalid password!",
						data: null,
					});
				}

				const jwt = signInPayload({
					id: userExists.id,
					name: userExists.name,
					email: userExists.email,
				});

				return {
					status: "success",
					data: {
						jwt,
					},
				};
			} catch (error) {
				if (error instanceof Error)
					return {
						status: "error",
						error: true,
						message: error.message,
						errorObj: { ...error },
						data: null,
					};
				return {
					status: "error",
					error: true,
					message: "An unexpected error occurred",
					errorObj: error,
					data: null,
				};
			}
		});
		fastify.post("/register", async (request, reply) => {
			try {
				//gonna be a schema later
				const { data } = request.body as {
					data: {
						[key: string]: string;
					};
				};

				const { email, name, password } = data;

				const emailAlreadyExists = await prisma.users.findFirst({
					where: { email },
				});

				if (emailAlreadyExists) {
					return reply.status(409).send({
						status: "warning",
						message: "Email already exists!",
						data: null,
					});
				}

				// gonna have SHA256 hash in password
				const insertedUser = await prisma.users.create({
					data: {
						email,
						name,
						password,
					},
				});

				if (!insertedUser) {
					throw new Error("An error has occurred, please try again");
				}

				return {
					status: "success",
					data: {
						user: {
							id: insertedUser.id,
							name: insertedUser.name,
							email: insertedUser.email,
						},
					},
				};
			} catch (error) {
				if (error instanceof Error)
					return {
						status: "error",
						error: true,
						message: error.message,
						errorObj: { ...error },
						data: null,
					};
				return {
					status: "error",
					error: true,
					message: "An unexpected error occurred",
					errorObj: error,
					data: null,
				};
			}
		});
	},
};

export default authenticationRoutes;
