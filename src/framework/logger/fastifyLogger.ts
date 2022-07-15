/* eslint-disable @typescript-eslint/require-await */
import { FastifyPluginAsync, FastifyRequest} from "fastify";
import fastifyPlugin from "fastify-plugin";
import chalk from "chalk";
import logadapter from "./pinoLoggerAdapter";

// const logger = getlogger("fastify");

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

  const ifExists = (prefix: string, value: string): string => {
    if(value.length >= 1) {
      if(prefix.length >= 1) {
        return prefix + " " + value;
      }
      return value;
    }
    return "";
  };

  fastify.addHook("onRequest", async (request) => {
    if (isIgnoredRequest(request)) {
      return;
    }
    const id = request.id;
    const method = request.method;
    const referrer = (request.headers["Referer"] ?? (request.headers["referer"]) ?? request.headers["Refferer"]) ?? request.headers["refferer"] ?? "none";
    const remoteAddr = request.ip;
    const remoteUser = "???";
    const url = request.url;
    const httpVersion =  request.raw.httpVersion;
    const userAgent = request.headers["User-Agents"];
    const contentLength = request.headers["content-length"] ?? "";

    console.log(JSON.stringify(request.headers));

    request.log.info(`${chalk.bold.yellow("→")} ${chalk.yellow(method)} ${chalk.green(url)} HTTP/${httpVersion} - ${chalk.blue(remoteAddr)} ${ifExists("", remoteUser)} - ${referrer} ${ifExists("-", contentLength+" bytes")} [${chalk.greenBright(id)}]`);
    request.log.trace(`${chalk.bold.yellow("→")} ${chalk.yellow(method)} ${chalk.green(url)} ${userAgent} [${chalk.greenBright(id)}]`);
    request.log.info(
      `${chalk.bold.yellow("← ")}${chalk.yellow(request.method)}:${chalk.green(
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

export const fastifyRequestLogger = fastifyPlugin(plugin, {
  fastify: "4.x",
  name: "fastify-request-logger",
});

export const fastifyLogger = logadapter;