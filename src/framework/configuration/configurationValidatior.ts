export abstract class DefinitionValidator {
  public abstract validate (value: string): boolean;
  public abstract description (): string;
}

const definitionValidators = {
  validateBoolean (): DefinitionValidator {
    return new (class implements DefinitionValidator {
      public description (): string {
        return "Parameter must be a boolean value.";
      }

      public validate (value: string): boolean {
        return (value === "true" || value === "1" || value === "y" || value === "false" || value === "0" || value === "n");
      }
    }); 
  },
  validateNumber (): DefinitionValidator {
    return new (class implements DefinitionValidator {
      public description (): string {
        return "Parameter must be a numeric value.";
      }

      public validate (value: string): boolean {
        return /^[+-]?([0-9]*[.])?[0-9]+$/.exec(value) !== null;
      }
    }); 
  },
  validatePort (): DefinitionValidator {
    return new (class implements DefinitionValidator {
      public description (): string {
        return "Parameter must be valid port (1-65535).";
      }

      public validate (value: string): boolean {
        const maxPort = 65535;
        return (/^[0-9]*$/.exec(value) !== null) && parseInt(value) >= 1 && parseInt(value) <= maxPort;
      }
    }); 
  },
  validateHost (): DefinitionValidator {
    return new (class implements DefinitionValidator {
      public description (): string {
        return "Hostname musst be a IP-Adress or a valid Hostname.";
      }

      public validate (value: string): boolean {
        const regexIPv6 = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;
        const regexIPv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const regexHost = /^(([a-zA-Z0-9]*)|([a-zA-Z0-9]*\.)*([a-zA-Z]+))$/;
        return (regexHost.exec(value) !== null) ||  (regexIPv4.exec(value) !== null) ||  (regexIPv6.exec(value) !== null);
      }
    }); 
  }
};
export default definitionValidators;