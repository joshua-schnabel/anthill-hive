/* eslint-disable @typescript-eslint/no-extraneous-class */

import {RepoRepository} from "#domain/repo/repo.repo";
import { Module } from "@nestjs/common";
import RepoFilePersistence from "./infrastructure/persistence/file/repo.persistence";

@Module({
  providers: [
    {
      useClass: RepoFilePersistence,
      provide: RepoRepository
    }
  ],
  exports: [RepoRepository]
})
export class PersistenceModule {}
