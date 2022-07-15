import User, { UserId } from "#domain/user/user.entity";
import { UserRepository } from "#domain/user/user.repo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class UserFilePersistence implements UserRepository {
  public xxx = "";
    
  private readonly values: Map<UserId, User> = new Map();

  public deleteAggregate (aggregate: User): void {
    if(aggregate.id)
      this.values.delete(aggregate.id);
  }

  public deleteAggregateById (identitiy: UserId): void {
    this.values.delete(identitiy);
  }

  public getAggregate (identitiy: UserId): User {
    const v: User | undefined = this.values.get(identitiy);
    if(v !== undefined)
      return v;
    throw new Error();
  }

  public getAggregates (): User[] {
    return Array.from(this.values.values());
  }
  
  public storeAggregate (aggregate: User): User {
    let id = aggregate.id;
    if(id) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      id = new UserId(Math.random().toString(16).substr(2, 8));
      // aggregate = User.builder().id(id).name(aggregate.name).password(aggregate.password).build();
    }
    this.values.set(id as UserId, aggregate);
    return aggregate;
  }

}