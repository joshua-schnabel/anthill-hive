/* eslint-disable @typescript-eslint/require-await */
import { FastifyLogFn, FastifyLoggerInstance, FastifyPluginAsync, FastifyRequest} from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Bindings } from "fastify/types/logger";
import getlogger from "./logger";
import chalk from "chalk";

const logger = getlogger("fastify");
const customLogger: FastifyLoggerInstance = {
  info: function (obj: unknown, msg?: string, ...args: unknown[]): void {
    if(typeof obj === "string")
      logger.info(obj, msg, ...args);
    else if(msg)
      logger.info(msg, obj, ...args);
  } as FastifyLogFn,
  warn: function (obj: unknown, msg?: string, ...args: unknown[]): void {
    if(typeof obj === "string")
      logger.warning(obj, msg, ...args);
    else if(msg)
      logger.warning(msg, obj, ...args);
  } as FastifyLogFn,
  error: function (obj: unknown, msg?: string, ...args: unknown[]): void {
    if(typeof obj === "string")
      logger.error(obj, msg, ...args);
    else if(msg)
      logger.error(msg, obj, ...args);
  } as FastifyLogFn,
  fatal: function (obj: unknown, msg?: string, ...args: unknown[]): void {
    if(typeof obj === "string")
      logger.fatal(obj, msg, ...args);
    else if(msg)
      logger.fatal(msg, obj, ...args);
  } as FastifyLogFn,
  trace: function (obj: unknown, msg?: string, ...args: unknown[]): void {
    if(typeof obj === "string")
      logger.trace(obj, msg, ...args);
    else if(msg)
      logger.trace(msg, obj, ...args);
  } as FastifyLogFn,
  debug: function (obj: unknown, msg?: string, ...args: unknown[]): void {
    if(typeof obj === "string")
      logger.debug(obj, msg, ...args);
    else if(msg)
      logger.debug(msg, obj, ...args);
  } as FastifyLogFn,
  child: function (_bindings: Bindings): FastifyLoggerInstance {
    return customLogger;
  },
  setBindings: function (_bindings: Bindings): void {
    // OK
  }
};

export type FastifyRequestLoggerOptions = {
  logBody?: boolean;
  ignoredPaths?: Array<string>;
};

export const plugin: FastifyPluginAsync<FastifyRequestLoggerOptions> = async (fastify, options = {}): Promise<void> => {
  const {
    logBody = true,
    ignoredPaths = [],
  } = options;

  const isIgnoredRequest = (request: FastifyRequest): boolean => {
    const { routerPath } = request;
    if (ignoredPaths.includes(routerPath)) {
      return true;
    }
    return false;
  };

  fastify.addHook("onRequest", async (request) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    const id = request.id;
    const method = request.method;
    const referrer = (request.headers["Referer"] ?? (request.headers["referer"]) ?? request.headers["Refferer"]) ?? request.headers["refferer"];
    const remoteAddr = request.ip;
    const remoteUser = "???";
    const url = request.url;
    const httpVersion =  request.raw.httpVersion;
    const userAgent = request.headers["User-Agents"];
    const contentLength = request.headers["content-length"];

    request.log.info(`${chalk.bold.yellow("→")} ${chalk.yellow(method)} ${chalk.green(url)} HTTP/${httpVersion} - ${chalk.blue(remoteAddr)} ${remoteUser} - ${referrer} - ${contentLength} bytes [${id}]`);
    request.log.trace(`${chalk.bold.yellow("→")} ${chalk.yellow(method)} ${chalk.green(url)} ${userAgent} [${id}]`);
    request.log.info(
      `${chalk.bold.yellow("←")}${chalk.yellow(request.method)}:${chalk.green(
        request.url
      )} request from ip ${chalk.blue(request.ip)}${
        contentLength ? ` with a ${chalk.yellow(contentLength)}-length body` : ""
      }`
    );
    request.log.trace("Request trace %s", JSON.stringify({header: request.headers, body: request.body}));
  });

  fastify.addHook("preHandler", async (request) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    const id = request.id;
    const method = request.method;
    // const referrer = (request.headers["Referer"] ?? (request.headers["referer"]) ?? request.headers["Refferer"]) ?? request.headers["refferer"];
    const remoteAddr = request.ip;
    const remoteUser = "???";
    const url = request.url;
    const httpVersion =  request.raw.httpVersion;
    const userAgent = request.headers["User-Agents"];
    if (request.body && logBody) {
      request.log.debug("Request body: %s", {body: request.body });
    }
  });

  fastify.addHook("onResponse", async (request, reply) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    const id = request.id;
    const method = request.method;
    const remoteAddr = request.ip;
    const remoteUser = "???";
    const responseTime = Math.ceil(reply.getResponseTime());
    const status = reply.statusCode + "";
    const url = request.url;
    const httpVersion =  request.raw.httpVersion;
    const contentLength = reply.getHeaders()["content-length"] ?? -1;
    const statusColor = function (status: string): string {
      if(status.startsWith("2"))
        return chalk.green(status);
      if(status.startsWith("3"))
        return chalk.blue(status);
      if(status.startsWith("4"))
        return chalk.yellow(status);
      if(status.startsWith("5"))
        return chalk.red(status);
      return status;
    };
    request.log.info(`${chalk.bold.yellow("→")} ${chalk.yellow(method)} ${chalk.green(url)} ${statusColor(status)} HTTP/${httpVersion} - ${chalk.blue(remoteAddr)} ${remoteUser} - ${contentLength} bytes ${responseTime} ms [${id}]`);
  });
};

declare module "fastify" {
  interface FastifyLoggerInstance {
    setBindings(bindings: Bindings): void;
  }
}

export const fastifyRequestLogger = fastifyPlugin(plugin, {
  fastify: "3.x",
  name: "fastify-request-logger",
});

export const fastifyLogger = customLogger;
