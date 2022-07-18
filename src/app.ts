/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */
import "reflect-metadata";
import clc from "cli-color";
import App, { AppCommand } from "#app";
import ConfigurationDefinition, { DefinitionType } from "#configuration/configurationDefinition";
import definitionValidators from "#configuration/configurationValidatior";
import Server from "#framework/server/server";
import getlogger, { defaultLogger } from "#logger";
import {Builder} from "#framework/builder/builder";

const x = Builder<App>(Server);

const app: App = new (class extends App {
  public options (setDefinitions: (...definitions: ConfigurationDefinition[]) => void): void {
    setDefinitions(new ConfigurationDefinition()
      .withName("port")
      .withType(DefinitionType.Number)
      .withArgName("port", "p")
      .withEnvName("port")
      .withDescription("Port of the server.")
      .isRequired()
      .relevantToCommands("start")
      .withValidator(definitionValidators.validatePort()),
    new ConfigurationDefinition()
      .withName("host")
      .withType(DefinitionType.String)
      .withArgName("host", "h")
      .withEnvName("host")
      .withDefault("127.0.0.1")
      .withDescription("Host name under which the server should listen for requests.")
      .relevantToCommands("start")
      .withValidator(definitionValidators.validateHost()));
  }

  public commmands (setCommands: (...commands: AppCommand[]) => void): void {
    setCommands(new (class implements AppCommand {
      public getName (): string {
        return "start";
      }

      public getDescriptions (): string {
        return "Start the server.";
      }

      public run (): void {
        const server = new Server();
        const logger = getlogger("server");
        server.setup().then(() => {
          return server.start();
        }).catch((err) => logger.error(err));
      }
    }
    ));
  }

  public printBanner (): void {
    const crot = clc.xterm(9);
    const cyellow = clc.xterm(11);
    const cwhite = clc.xterm(15);
    const cpurple = clc.xterm(13);
    console.log(crot("                     ") + cwhite("_          _   _     _ _ _ ") + cpurple("  ____             _                "));
    console.log(crot(" \\  \\         ") + cwhite("      / \\   _ __ | |_| |__ (_) | | ") + cpurple("| __ )  __ _  ___| | ___   _ _ __  "));
    console.log(crot(" |__/ _   .-.   ") + cwhite("   / _ \\ | '_ \\| __| '_ \\| | | | ") + cpurple("|  _ \\ / _` |/ __| |/ / | | | '_ \\ "));
    console.log(crot("(") + cyellow("o_o") + crot(")(_`>(   )  ") + cwhite("  / ___ \\| | | | |_| | | | | | |") + cpurple(" | |_) | (_| | (__|   <| |_| | |_) |"));
    console.log(crot(" { }//||\\\\`-' ") + cwhite("   /_/   \\_\\_| |_|\\__|_| |_|_|_|_| ") + cpurple("|____/ \\__,_|\\___|_|\\_\\\\__,_| .__/ "));
    console.log(cpurple("                                                                             |_|    "));
  }
});

try {
  app.execute();
} catch (error: unknown) {
  if (error instanceof Error) {
    defaultLogger.error(error.message);
  } else {
    defaultLogger.error("ssss" + error);
  }
}

