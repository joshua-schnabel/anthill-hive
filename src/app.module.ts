import { FrameworkModule } from "#framework/framework.module";
import { Module } from "@nestjs/common";
import { PersistenceModule } from "./application/persistance.module";
import { RestModule } from "./application/rest.module";

@Module({
  imports: [RestModule, FrameworkModule, PersistenceModule]
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}