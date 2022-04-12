/* eslint-disable @typescript-eslint/no-explicit-any */

import { LoggerService } from "@nestjs/common";
import getlogger from "./logger";

const logger = getlogger("nest");
export default class NestLogger implements LoggerService {

  public log (message: any, ...optionalParams: any[]): void {
    logger.info(message, optionalParams);
  }

  public error (message: any, ...optionalParams: any[]): void {
    logger.error(message, optionalParams);
  }

  public warn (message: any, ...optionalParams: any[]): void {
    logger.warning(message, optionalParams);
  }

  public debug (message: any, ...optionalParams: any[]): void {
    logger.debug(message, optionalParams);
  }

  public verbose (message: any, ...optionalParams: any[]): void {
    logger.verbose(message, optionalParams);
  }
}
