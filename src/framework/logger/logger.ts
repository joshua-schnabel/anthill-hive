import winston, { format, transports, transport as Transport, Logger } from "winston";
import { Format } from "logform";

const { combine, timestamp, label, printf, errors, splat } = format;

// Custom logging format
const customFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label || "-"}] ${level}: ${message} ${stack || ""}`;
});

// Custom combined logging format:
const customCombinedFormat = (module: string): Format =>
  combine(
    errors({ stack: true }),
    format.colorize({ level: true }),
    label({ label: module }),
    timestamp(),
    splat(),
    customFormat
  );

// Custom transports:
const customTransports = (): Transport[] => [new transports.Console()];

// Container to provide different pre-configured loggers
const logContainer = new winston.Container();

// Default logger for modules:
const getLogger = (module: string): Logger => {
  if (!logContainer.has(module)) {
    logContainer.add(module, {
      format: customCombinedFormat(module),
      transports: customTransports()
    });
  }
  return logContainer.get(module);
};

export default getLogger;
export const defaultLogger =  getLogger("default");