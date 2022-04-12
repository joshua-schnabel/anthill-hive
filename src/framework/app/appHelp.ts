/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-console */

import configuration from "#configuration";
import clc from "cli-color";
import ConfigurationDefinition from "#configuration/configurationDefinition";
import { AppCommand } from "#app";

/* The `AppHelp` class is responsible for printing out the help message */
export default class AppHelp {
  
  /**
 * Prints the help message
 * @param commands - A map of all the commands that the program can run.
 */
  public printHelp (commands: Map<string, AppCommand>): void {
    const programm = process.argv.slice(0, 2).join(" ");
    const underline = clc.underline;
    console.log(underline("Usage")+"\n");
    console.log("\t"+ programm + " [COMMAND] [OPTIONS]"+"\n");
    console.log(underline("Commands")+"\n");
    this.printCommands(commands);
    console.log();
    console.log(underline("Options"));
    console.log();
    this.printOptions((def) => def.getCommands().length >= 1);
    console.log();
    console.log(underline("Rules & Behavior"));
    console.log();
    this.printOptions((def) => def.getCommands().length == 0);
  }

  /**
 * Prints all commands and their descriptions
 * @param commands - Map<string, AppCommand>
 */
  private printCommands (commands: Map<string, AppCommand>): void {
    commands.forEach((v, k, _m) => {
      console.log("\t" + k + " - " + v.getDescriptions());
      const paramaters: string[] = [];
      // Find parameters for current command
      for (const def of this.getConfigurationDefinitions()) {
        if (def.getCommands().includes(k)) {
          paramaters.push(this.generateParameters(def));
        }
      }
      console.log("\t↳ " + k + " " + paramaters.join(" "));
    });
  }

  /**
 * Prints out all the options that are available to the user
 * @param condition - Select witch options are printed.
 */
  private printOptions (condition: (a: ConfigurationDefinition) => boolean): void {
    let maxLength = 0;
    /* Find longest String */
    for (const def of this.getConfigurationDefinitions()) {
      if (condition(def)) {
        const option = " -" + def.getArgName().sort((a, b) => a.length - b.length).join(" -");
        maxLength = Math.max(maxLength, option.length);
      }
    }
    for (const def of this.getConfigurationDefinitions()) {
      if (condition(def)) {
        const option = " -" + def.getArgName().sort((a, b) => a.length - b.length).join(" -");
        console.log("\t↳ " + (option.padEnd(maxLength, " ")) + " - " + def.getDescription());
      }
    }
  }

  /**
 * Generate the parameters for the command line help
 * @param {ConfigurationDefinition} def - ConfigurationDefinition
 * @returns The `generateParameters` function returns a string that represents the parameters that are
 * being passed to the `CommandLine` object.
 */
  private generateParameters (def: ConfigurationDefinition): string {
    const args: string[] = [];
    for (const argParam of def.getArgName()) {
      if (argParam.length === 1)
        args.push("-" + argParam + " <" + def.getName() + ">");
      else
        args.push("--" + argParam + " <" + def.getName() + ">");
    }
    let paramater = args.join(" | ");
    if (def.getArgName().length > 1)
      paramater = "(" + paramater + ")";
    if (!def.getRequired())
      paramater = "[" + paramater + "]";
    return paramater;
  }

  /**
 * Get the configuration definitions from the configuration object
 * @returns The configuration definitions are being returned.
 */
  private getConfigurationDefinitions (): ConfigurationDefinition[] {
    return configuration().getDefinitions().sort((a, b) => {
      if (a.getRequired() && !b.getRequired())
        return -1;
      else if (!a.getRequired() && b.getRequired())
        return 1;

      else
        return a.getName() < b.getName() ? -1 : 1;
    });
  }

}