import { ValueObject } from "#ddd";
import { UserId } from "../user/user.entity";
// import { Builder, IBuilder } from "builder-pattern";

enum UserRight {
  Read = "read",
  AppendOnly = "append",
  Write = "write"
}

export class UserAssignment extends ValueObject {
  private readonly _right: UserRight;

  private readonly _userId: UserId;

  private constructor (userId: UserId, right: UserRight) {
    super();
    this._userId = userId;
    this._right = right;
  }

  public get id (): UserId {
    return this._userId;
  }

  public get right (): UserRight {
    return this._right;
  }

}
