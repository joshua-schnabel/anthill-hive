/* eslint-disable @typescript-eslint/no-extraneous-class */

import {RepoRepository} from "#domain/repo/repo.repo";
import {UserRepositoryToken} from "#domain/user/user.repo";
import { Module } from "@nestjs/common";
import RepoFilePersistence from "./infrastructure/persistence/file/repo.persistence";
import UserFilePersistence from "./infrastructure/persistence/file/user.persistence";

@Module({
  providers: [
    {
      useClass: RepoFilePersistence,
      provide: RepoRepository
    },
    {
      useClass: UserFilePersistence,
      provide: UserRepositoryToken
    }
  ],
  exports: [RepoRepository]
})
export class PersistenceModule {}
