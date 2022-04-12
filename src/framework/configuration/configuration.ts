import ConfigurationDefinition, {DefinitionType} from "./configurationDefinition";
import {parser, ArgCollection} from "args-command-parser";

class Configuration {

  private readonly definitions: Map<string, ConfigurationDefinition> = new Map();
  private readonly values: Map<string, string[] | undefined> = new Map();
  private readonly defaultCommand: string;
  private readonly envPrefix: string;
  private readonly arguments: ArgCollection;
  public constructor (defaultCommand: string, envPrefix: string, ...definitions: ConfigurationDefinition[]) {
    this.arguments = parser();
    for (const definition of definitions) {
      this.definitions.set(definition.getName(), definition);
      this.values.set(definition.getName(), this.getInternalValue(definition));
    }
    this.defaultCommand = defaultCommand;
    this.envPrefix = envPrefix;
  }

  public validate (): void {
    this.definitions.forEach((v, _k, _m) => {
      const def = v;
      const values = this.values.get(def.getName()) ?? [];
      if(!def.getMultiple() && values.length > 1) 
        throw new Error("No more than one value may be assigned to parameter '" + def.getName() + "'.");
      if(def.getRequired() && (def.getCommands().length === 0 || def.getCommands().includes(this.getCommand())) && values.length === 0) 
        throw new Error("Parameter '" + def.getName() + "' is required.");
      for (const value of values) {
        if(!def.getValidator().validate(value)) 
          throw new Error("Parameter '" + def.getName() + "' does not meet the requirements: " + def.getValidator().description());
      }
    });
  }

  public getDefinitions (): ConfigurationDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
 * Get the command from the arguments
 * @returns The command that was passed in the arguments.
 */
  public getCommand (): string {
    if(this.arguments.data.commands.length >= 1)
      return this.arguments.data.commands[0];
    else
      return this.defaultCommand;
  }

  /**
 * Get the value of a parameter
 * @param {string} name - The name of the parameter.
 * @returns The value of the parameter.
 */
  public getValue (name: string): string | string[] | boolean | boolean[] | number | number[] | undefined {
    const def = this.definitions.get(name);
    const value = this.values.get(name) ?? [];
    switch ( def?.getType() ) {
      case DefinitionType.Boolean: {
        const result = this.toBoolean(value);
        if(def.getMultiple()) {
          return result;
        }
        return result[0];
      }
      case DefinitionType.Number: {
        const result: number[] = this.toInteger(value);
        if(def.getMultiple()) {
          return result;
        }
        return result[0];
      }
      case DefinitionType.String: {
        if(def.getMultiple()) {
          return value;
        }
        return value[0];
      }
    }
  }

  /**
 * Get the value of a boolean parameter
 * @param {string} name - The name of the parameter.
 * @returns The value of the parameter.
 */
  public getBooleanValue (name: string): boolean | boolean[] | undefined {
    const def = this.definitions.get(name);
    if(def?.getType() == DefinitionType.Boolean) {
      const value = this.values.get(name) ?? [];
      const result: boolean[] = this.toBoolean(value);
      if(def.getMultiple()) {
        return result;
      }
      return result[0];
    }
    return undefined;
  }

  public getNumberValue (name: string): number | number[] | undefined {
    const def = this.definitions.get(name);
    if(def?.getType() == DefinitionType.Number) {
      const value = this.values.get(name) ?? [];
      const result: number[] = this.toInteger(value);
      if(def.getMultiple()) {
        return result;
      }
      return result[0];
    }
    return undefined;
  }

  public getStringValue (name: string): string | string[] | undefined {
    const def = this.definitions.get(name);
    if(def?.getType() == DefinitionType.String) {
      const value = this.values.get(name) ?? [];
      if(def.getMultiple()) {
        return value;
      }
      return value[0];
    }
    return undefined;
  }
  /**
 * Convert a string array to a boolean array
 * @param {string[]} value - The value of the parameter.
 * @returns The `toBoolean` function returns an array of booleans.
 */

  private toBoolean (value: string[]): boolean[] {
    const result: boolean[] = [];
    for (const v of value) {
      result.push(v === "true" || v === "1" || v === "y");
    }
    return result;
  }
  
  /**
 * It takes an array of strings and returns an array of numbers.
 * @param {string[]} value - The value of the parameter.
 * @returns The `toInteger` function returns an array of numbers.
 */
  private toInteger (value: string[]): number[] {
    const result: number[] = [];
    for (const v of value) {
      const f = parseFloat(v); const i = parseInt(v);
      result.push((f == i) ? i : f);
    }
    return result;
  }

  private getInternalValue (def: ConfigurationDefinition): string[] | undefined {
    let value = this.getArgValue(def);
    value = (value === undefined)?this.getEnvValue(def):value;
    value = (value === undefined)?def.getDefaultValue():value;
    if(value !== undefined) {
      return value;
    }
    return undefined;
  }

  private getEnvValue (def: ConfigurationDefinition): string[] | undefined {
    const value = process.env[this.envPrefix + "_" + def.getEnvName().toUpperCase()];
    if(value !== undefined)
      return [value];
    else
      return undefined;
  }

  private getArgValue (def: ConfigurationDefinition): string[] | undefined{
    for (const arg of def.getArgName()) {
      if(arg.length >= 2 && this.arguments.hasLongSwitch(arg)) {
        return this.arguments.getLongSwitch(arg).values;
      } else if (this.arguments.hasShortSwitch(arg)) {
        return this.arguments.getShortSwitch(arg).values;
      }
    }
    return undefined;
  }
}

let configInstance: Configuration;

export function initConfiguration (envPrefix: string, ...definitions: ConfigurationDefinition[]): void {
  configInstance  = new Configuration("help", envPrefix, ...definitions);
}
export default function config (): Configuration {
  return configInstance;
}