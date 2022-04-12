import { constructUsing, createMap, forMember, mapFrom } from "@automapper/core";
import Repo, { RepoId } from "#domain/repo/repo.entity";
import { mapper } from "#framework/mapper/mapper";

export class RepoDto {
  public id!: string;
  public path!: string;
}

createMap(mapper, Repo, RepoDto, forMember(
  (destination: RepoDto) => destination.id, mapFrom(s => s.id?.value)
));

createMap(mapper, RepoDto, Repo,
  constructUsing((sourceObject, _destinationIdentifier): Repo => {
    return new Repo(new RepoId(sourceObject.id), sourceObject.path);
  })
);