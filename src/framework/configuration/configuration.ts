import ConfigurationDefinition, {DefinitionType} from "./ConfigurationDefinition";
import {parser, ArgCollection} from "args-command-parser";

const portDefinition = new ConfigurationDefinition()
  .withName("port")
  .withType(DefinitionType.Number)
  .withArgName("port")
  .withEnvName("port")
  .withDescription("Port of the server.")
  .isRequired()
  .withValidator("");

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

  public getCommand (): string {
    return this.arguments.data.commands.join(" ");
  }

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
        break;
      }
      case DefinitionType.Number: {
        const result: number[] = this.toInteger(value);
        if(def.getMultiple()) {
          return result;
        }
        return result[0];
        break;
      }
      case DefinitionType.String: {
        if(def.getMultiple()) {
          return value;
        }
        return value[0];
        break;
      }
    }
  }

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

  private toBoolean (value: string[]): boolean[] {
    const result: boolean[] = [];
    for (const v of value) {
      result.push(v === "true" || v === "1" || v === "y");
    }
    return result;
  }
  
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

export default new Configuration("startServer", "ant", portDefinition);
