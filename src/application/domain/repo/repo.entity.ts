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
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  private readonly _count = 1;

  private readonly _userAssignment: UserAssignment[] = [];

  public constructor (id: RepoId | undefined) {
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

  public addUserAssignment (ua: UserAssignment): UserAssignment[] {
    this._userAssignment.push(ua);
    return this._userAssignment;
  }
}

export interface IRepoBuider {
  name: string;
  id: RepoId;
  addUserAssignment: UserAssignment;
}

export class RepoIdGenerator implements IdentifierGenerator<RepoId> {
  public generate (): RepoId {
    return new RepoId(randomUUID());
  }
}

