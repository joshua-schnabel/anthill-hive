import GracefulServer from "@gquittet/graceful-server";
import getlogger from "#logger";
import {fastifyRequestLogger, fastifyLogger} from "#logger/fastifyLogger";
import { Logger } from "winston";
import configuration from "#configuration";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "../../app.module";
import NestLogger from "#framework/logger/nestLogger";
import { EventEmitter } from "events";
import fastifySensible from "@fastify/sensible";

interface IGracefulServer {
  isReady: () => boolean;
  setReady: () => void;
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter;
}

export default class Server {
  private readonly logger: Logger;
  private gracefulServer: IGracefulServer | undefined;
  private nest: NestFastifyApplication | undefined;
  public constructor () {
    this.logger = getlogger("fastify");
  }

  public async start (): Promise<void> {
    const start = async (): Promise<void> => {
      try {
        const port = <number>configuration().getNumberValue("port");
        const host = <string>configuration().getStringValue("host");
        this.logger.info("Start server on port " + host + ":" + port);
        await this.nest?.listen(port, host);
        this.gracefulServer?.setReady();
      } catch (err) {
        this.logger.error(err);
        process.exit(1);
      }
    };
    await start();
  }
  
  public async setup (): Promise<void> {
    this.nest = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: fastifyLogger,
        disableRequestLogging: true
      }), 
      {
        logger: new NestLogger(),
      }
    );

    await this.nest.register(fastifySensible);
    await this.nest.register(fastifyRequestLogger);
    
    this.gracefulServer = GracefulServer(this.nest.getHttpServer());

    this.gracefulServer.on(GracefulServer.READY, () => {
      this.logger.info("Server is ready");
    });
    
    this.gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
      this.logger.info("Server is shutting down");
    });
    
    this.gracefulServer.on(GracefulServer.SHUTDOWN, () => {
      this.logger.info("Server is down");
      process.exit();
    });
  }
}

