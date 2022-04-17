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
  private _name = "";

  private readonly _userAssignment: UserAssignment[] = [];
  
  public constructor (id: RepoId| undefined) {
    super();
    this._id = id;
  }

  public get id (): RepoId | undefined {
    return this._id;
  }

  public get name (): string {
    return this._name;
  }

  public set name (name: string) {
    this._name = name;
  }

  public get path (): string {
    return "/" + this._name;
  }
 
  public get userAssignment (): UserAssignment[] {
    return this._userAssignment;
  }

  // public static builder (): IBuilder<Repo> {  
  //  return (<unknown> Builder(Repo)) as IBuilder<Repo>;
  // }  
}

export type RepoBuilder = {
  [k in keyof Repo]-?: (arg: Repo[k]) => RepoBuilder
}
& {
  build(): Repo;
};

export class RepoIdGenerator implements IdentifierGenerator<RepoId> {
  public generate (): RepoId {
    return new RepoId(randomUUID());
  }
}

