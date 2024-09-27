import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import prisma from "../libs/prisma";

const authenticationRoutes = {
  prefix: "/auth",
  _public: ["/login", "/register"],
  get public() {
    return this._public;
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

        return {
          status: "success",
          data: {
            user: {
              id: userExists.id,
              name: userExists.name,
              email: userExists.email,
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
