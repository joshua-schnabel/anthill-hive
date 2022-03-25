import Fastify from "fastify";
import fastifySensible from "fastify-sensible";
import GracefulServer from "@gquittet/graceful-server";
import getlogger from "@logger";
import configuration from "@configuration";

const serverLogger = getlogger("server");
console.log(configuration.getCommand());
serverLogger.warn("sss");

const fastify = Fastify({
  logger: fastifyLogger,
  disableRequestLogging: true
});
await fastify.register(fastifySensible);

const gracefulServer = GracefulServer(fastify.server);

gracefulServer.on(GracefulServer.READY, () => {
  serverLogger.info("Server is ready");
});

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  serverLogger.info("Server is shutting down");
});

gracefulServer.on(GracefulServer.SHUTDOWN, (error: { message: string; }) => {
  serverLogger.info("Server is down because of", error.message);
  process.exit();
});

// Declare a route
fastify.get("/", async function (request, reply) {
  await reply.send({ hello: "world" });
});

// Run the server!
const start = async (): Promise<void> => {
  try {
    await fastify.listen(<number>configuration.getNumberValue("port"));
    gracefulServer.setReady();
  } catch (err) {
    serverLogger.error(err);
    process.exit(1);
  }
};
await start();