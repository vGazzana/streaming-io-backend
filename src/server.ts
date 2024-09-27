import fastify from "./fastify";

export default async function bootstrapServer() {
  try {
    console.log("## bootstrapServer started ##");
    await fastify.listen({
      port: 3000,
    });

    console.log("Server is running on http://localhost:3000");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
