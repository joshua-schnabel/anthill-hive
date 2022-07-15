
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */
import configuration, {initConfiguration} from "#configuration";
import ConfigurationDefinition from "#configuration/configurationDefinition";
import getLogger from "#logger";
import { Logger } from "winston";
import AppHelp from "./appHelp";

// TODO: move to App
const ENV_PREFIX = "ANT";

export abstract class AppCommand {
  public abstract getDescriptions (): string;
  public abstract getName (): string;
  public abstract run (): void;

}

export default abstract class App {

  private readonly appHelp: AppHelp;
  private readonly commands: Map<string, AppCommand> = new Map();
  private readonly logger: Logger;

  public constructor () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.appHelp = new AppHelp();
    this.logger = getLogger("app");
    this.addCommmand(new (class implements AppCommand {

      public getDescriptions (): string {
        return "Show help for this application.";
      }

      public getName (): string {
        return "help";
      }

      public run (): void {
        that.appHelp.printHelp(that.commands, ENV_PREFIX);
      }
    }));
  }
  
  public abstract commmands (setCommands: (...commands: AppCommand[]) => void): void;

  /**
 * It executes the commands and options.
 */
  public execute (): void {
    this.commmands((...definitions): void => {
      for (const definition of definitions) {
        this.addCommmand(definition);
      }
      console.log();
    });
    this.options((...defs): void => {
      initConfiguration(ENV_PREFIX, ...defs);
    });
    this.printBanner();
    configuration().validate();
    const name = configuration().getCommand();    
    const command = this.commands.get(name);    
    this.logger.info("Starting App with command '" + name + "'");
    if(command) {
      command.run();
    } else {
      throw new Error(name + " is not implemented");
    }
  }

  public abstract options (setDefinitions: (...definitions: ConfigurationDefinition[]) => void): void;
  
  public abstract printBanner (): void;

  private addCommmand (command: AppCommand): void {
    this.commands.set(command.getName(), command);
  }

}