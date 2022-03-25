import Fastify from "fastify";
import fastifySensible from "fastify-sensible";
import GracefulServer from "@gquittet/graceful-server";
import getlogger from "@logger";
import {fastifyLogger, fastifyRequestLogger} from "@logger/fastifyLogger"; 

const fastify = Fastify({
  logger: fastifyLogger,
  disableRequestLogging: true
});
await fastify.register(fastifyRequestLogger, {logBody: true});
await fastify.register(fastifySensible);

const gracefulServer = GracefulServer(fastify.server);

gracefulServer.on(GracefulServer.READY, () => {
  getlogger("server").info("Server is ready");
});

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  getlogger("server").info("Server is shutting down");
});

gracefulServer.on(GracefulServer.SHUTDOWN, (error: {message: string}) => {
  getlogger("server").info("Server is down because of", error.message);
  process.exit();
});

// Declare a route
fastify.get("/", function (request, reply) {
  void reply.send({ hello: "world" });
});

// Run the server!
const start = async (): Promise<void> => {
  try {
    const port = 3000;
    await fastify.listen(port);
    gracefulServer.setReady();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
await start();