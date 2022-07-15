import { FastifyLogFn, FastifyLoggerInstance } from "fastify";
import getlogger from "./logger";
import pino, { ChildLoggerOptions, LoggerOptions } from "pino";

const pinoLogger = pino();

const logger = getlogger("fastify");
const customLogger: FastifyLoggerInstance = pinoLogger;
customLogger.info = function (obj: unknown, msg?: string, ...args: unknown[]): void {
  if (typeof obj === "string") logger.info(obj, msg, ...args);
  else if (msg) logger.info(msg, obj, ...args);
} as FastifyLogFn;
customLogger.warn = function (obj: unknown, msg?: string, ...args: unknown[]): void {
  if (typeof obj === "string") logger.warning(obj, msg, ...args);
  else if (msg) logger.warning(msg, obj, ...args);
} as FastifyLogFn;
customLogger.error = function (obj: unknown, msg?: string, ...args: unknown[]): void {
  if (typeof obj === "string") logger.error(obj, msg, ...args);
  else if (msg) logger.error(msg, obj, ...args);
} as FastifyLogFn;
customLogger.fatal = function (obj: unknown, msg?: string, ...args: unknown[]): void {
  if (typeof obj === "string") logger.fatal(obj, msg, ...args);
  else if (msg) logger.fatal(msg, obj, ...args);
} as FastifyLogFn;
customLogger.trace = function (obj: unknown, msg?: string, ...args: unknown[]): void {
  if (typeof obj === "string") logger.trace(obj, msg, ...args);
  else if (msg) logger.trace(msg, obj, ...args);
} as FastifyLogFn;
customLogger.debug = function (obj: unknown, msg?: string, ...args: unknown[]): void {
  if (typeof obj === "string") logger.debug(obj, msg, ...args);
  else if (msg) logger.debug(msg, obj, ...args);
} as FastifyLogFn;
customLogger.child = function <ChildOptions extends pino.ChildLoggerOptions>(_bindings: pino.Bindings, _options?: ChildLoggerOptions): pino.Logger<LoggerOptions & ChildOptions> {
  return <pino.Logger<LoggerOptions & ChildOptions>>customLogger;
};

export default customLogger;
