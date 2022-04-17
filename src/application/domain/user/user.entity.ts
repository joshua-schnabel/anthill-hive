import { Identifier, Aggregate} from "#ddd";
import { ITest } from "#framework/hello/test";

interface YYYY {
}

export class XXX implements ITest, YYYY {
  public xxx = "yyy";
  
}
  
export default class User extends Aggregate<UserId>  {
  private readonly _id: UserId | undefined;

  private readonly _name: string;

  private readonly _password: string;

  public constructor (id: UserId | undefined, name: string, password: string) {
    super();
    this._id = id;
    this._name = name;
    this._password = password;
  }

  public get id (): UserId | undefined {
    return this._id;
  }

  public get name (): string {
    return this._name;
  }

  public get password (): string {
    return this._password;
  }

  public xxx (): XXX {
    return new XXX();
  }

  // public static builder (): Test {  
  //  return (<unknown> Builder(User)) as Test;
  //  } 
}

export class UserId extends Identifier<string> {
  private readonly _value: string;

  public constructor (value: string) {
    super();
    this._value = value;
  }

  public get value (): string {
    return this.value;
  }
}

