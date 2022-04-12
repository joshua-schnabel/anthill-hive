/* eslint-disable @typescript-eslint/no-extraneous-class */

import { Module } from "@nestjs/common";
import { ManagementController } from "./infrastructure/presentation/rest/management.controller";
import { RepoController } from "./infrastructure/presentation/rest/repo.controller";
import { PersistenceModule } from "./persistance.module";

@Module({
  controllers: [ManagementController, RepoController],
  imports: [PersistenceModule]
})
export class RestModule {}
