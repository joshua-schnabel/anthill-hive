import { DefinitionValidator } from "./configurationValidatior";

export enum DefinitionType {
  String = "string",
  Boolean = "boolean",
  File = "file",
  Number = "number"
}

class ConfigurationDefinition implements ConfigurationDefinition {
  private name!: string;
  private envName!: string;
  private argName!: string[];
  private validator!: DefinitionValidator;
  private description!: string;
  private type!: DefinitionType;
  private multiple = false;
  private required = false;
  private commands: string[] = [];
  private defaultValue: string | undefined = undefined;

  public getName (): string {
    return this.name;
  }

  public getEnvName (): string {
    return this.envName;
  }

  public getArgName (): string[] {
    return this.argName;
  }

  public getValidator (): DefinitionValidator {
    return this.validator;
  }

  public getDescription (): string {
    return this.description;
  }

  public getType (): DefinitionType {
    return this.type;
  }

  public getRequired (): boolean {
    return this.required;
  }

  public getMultiple (): boolean {
    return this.multiple;
  }

  public getCommands (): string[] {
    return this.commands;
  }

  public getDefaultValue (): string[] | undefined {
    if(this.defaultValue) {
      return [this.defaultValue];
    }
    return undefined;
  }

  public withName (name: string): ConfigurationDefinition {
    this.name = name;
    return this;
  }

  public withEnvName (envName: string): ConfigurationDefinition {
    this.envName = envName;
    return this;
  }

  public withArgName (...argName: string[]): ConfigurationDefinition {
    this.argName = argName;
    return this;
  }

  public withValidator (validator: DefinitionValidator): ConfigurationDefinition {
    this.validator = validator;
    return this;
  }
  
  public withDescription (description: string): ConfigurationDefinition {
    this.description = description;
    return this;
  }

  public withDefault (defaultValue: string): ConfigurationDefinition {
    this.defaultValue = defaultValue;
    return this;
  }

  public withType (type: DefinitionType): ConfigurationDefinition {
    this.type = type;
    return this;
  }

  public relevantToCommands (...commands: string[]): ConfigurationDefinition {
    this.commands = commands;
    return this;
  }

  public isRequired (): ConfigurationDefinition {
    this.required = true;
    return this;
  }

  public isMultiple (): ConfigurationDefinition {
    this.multiple = true;
    return this;
  }
}

export default ConfigurationDefinition;