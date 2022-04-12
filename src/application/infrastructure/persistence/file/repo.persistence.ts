import Repo, { RepoId } from "#domain/repo/repo.entity";
import RepoRepository from "#domain/repo/repo.repo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class RepoFilePersistence implements RepoRepository {

  private readonly values: Map<RepoId, Repo> = new Map();

  public constructor () {
    const x = new RepoId("xxxx");
    const y = Repo.instantiate(x, "/xxx");
    this.values.set(x, y);
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
      id = new RepoId("");
      aggregate = Repo.instantiate(id, aggregate.path);
    }
    this.values.set(id as RepoId, aggregate);
    return aggregate;
  }

}