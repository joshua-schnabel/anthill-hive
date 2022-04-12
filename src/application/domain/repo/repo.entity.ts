import { Aggregate, Identifier, IdentifierGenerator } from "#ddd";
import { randomUUID } from "crypto";
import { UserAssignment } from "./userAssignment.entity";

export class RepoId extends Identifier<string> {
  private readonly _value: string;

  public constructor (value: string) {
    super();
    this._value = value;
  }

  public get value (): string {
    return this._value;
  }
}
export default class Repo extends Aggregate<RepoId>{
  
  private readonly _id?: RepoId;
  private readonly _name: string;

  private readonly _userAssignment: UserAssignment[] = [];
  
  public constructor (id: RepoId| undefined, name: string, userAssignment: UserAssignment[]) {
    super();
    this._id = id;
    this._name = name;
    this._userAssignment = userAssignment;
  }

  public get id (): RepoId | undefined {
    return this._id;
  }

  public get name (): string {
    return this._name;
  }

  public get path (): string {
    return "/" + this._name;
  }
 
  public get userAssignment (): UserAssignment[] {
    return this._userAssignment;
  }

  public addUserAssignment (userAssignment: UserAssignment): void {
    this._userAssignment.push(userAssignment);
  }

  public removeUserAssignment (userAssignment: UserAssignment): void {
    this._userAssignment.filter(item => item !== userAssignment);
  }
    
  // public static builder (): IBuilder<Repo> {
  //  return <IBuilder<Repo>> <unknown>Builder(Repo);
  // }
}

export class RepoIdGenerator implements IdentifierGenerator<RepoId> {
  public generate (): RepoId {
    return new RepoId(randomUUID());
  }
}

