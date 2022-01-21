import Fastify from "fastify";
import fastifySensible from "fastify-sensible";
import GracefulServer from "@gquittet/graceful-server";
import getlogger, {defaultLogger} from "@logger";

const fastify = Fastify({
  logger: true
});
fastify.register(fastifySensible);

const gracefulServer = GracefulServer(fastify.server);

gracefulServer.on(GracefulServer.READY, () => {
  console.log("Server is ready");
});

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  console.log("Server is shutting down");
});

gracefulServer.on(GracefulServer.SHUTDOWN, error => {
  console.log("Server is down because of", error.message);
  process.exit();
});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    gracefulServer.setReady();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

const c = function (): void {
  const v = function (): void {
    throw new Error("Oh no!");
  };
  return v();
};

const abc = getlogger("abc");
abc.info("Ich bin ein Test!");
abc.warn("Ich bin ein Test!");
try {
  c();
}
catch (e) {
  abc.warn(e);
}
const xyz = getlogger("xyz");
xyz.error("Ich bin ein Test!");
xyz.error("Ich bin ein '%s' Test!", "test");

defaultLogger.error("Ich bin ein Test!");