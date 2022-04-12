import { Module } from "@nestjs/common";
import { BasicStrategy } from "./auth/auth-basic.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [PassportModule],
  providers: [BasicStrategy],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FrameworkModule {}