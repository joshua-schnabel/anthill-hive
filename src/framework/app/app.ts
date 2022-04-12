
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */
import configuration, {initConfiguration} from "#configuration";
import ConfigurationDefinition from "#configuration/configurationDefinition";
import getLogger from "#logger";
import { Logger } from "winston";
import AppHelp from "./appHelp";

export abstract class AppCommand {
  public abstract getDescriptions (): string;
  public abstract run (): void;

  public abstract getName (): string;
}

export default abstract class App {

  private readonly commands: Map<string, AppCommand> = new Map();
  private readonly appHelp: AppHelp;
  private readonly logger: Logger;

  public constructor () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.appHelp = new AppHelp();
    this.logger = getLogger("app");
    this.addCommmand(new (class implements AppCommand {
      public getName (): string {
        return "help";
      }

      public getDescriptions (): string {
        return "Show help for this application.";
      }

      public run (): void {
        that.appHelp.printHelp(that.commands);
      }
    }));
  }

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
      initConfiguration("XXX", ...defs);
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

  private addCommmand (command: AppCommand): void {
    this.commands.set(command.getName(), command);
  }

  public abstract options (setDefinitions: (...definitions: ConfigurationDefinition[]) => void): void;
  
  public abstract commmands (setCommands: (...commands: AppCommand[]) => void): void;
  public abstract printBanner (): void;

}