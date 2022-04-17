import Repo, { RepoId } from "#domain/repo/repo.entity";
import RepoRepository from "#domain/repo/repo.repo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class RepoFilePersistence implements RepoRepository {

  private readonly values: Map<RepoId, Repo> = new Map();

  public constructor () {
    const x = new RepoId("xxxx");
    // const y = Repo.builder().id(x).name("dddd").build();
    // this.values.set(x, y);
  }
  
  public deleteAggregate (aggregate: Repo): void {
    if(aggregate.id)
      this.values.delete(aggregate.id);
  }

  public deleteAggregateById (id: RepoId): void{
    this.values.delete(id);
  }

  public getAggregate (identitiy: RepoId): Repo {
    const v: Repo | undefined = this.values.get(identitiy);
    if(v !== undefined)
      return v;
    throw new Error();
  }

  public getAggregates (): Repo[] {
    return Array.from(this.values.values());
  }

  public storeAggregate (aggregate: Repo): Repo {
    let id = aggregate.id;
    if(id) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      id = new RepoId(Math.random().toString(16).substr(2, 8));
      // aggregate = Repo.builder().id(id).name(aggregate.name).build();
    }
    this.values.set(id as RepoId, aggregate);
    return aggregate;
  }

}