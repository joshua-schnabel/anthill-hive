
import { BasicStrategy as Strategy } from "passport-http";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { FastifyRequest } from "fastify";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  public constructor () {
    super({
      passReqToCallback: true,
      realm: "XXXXX"
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async validate (req: FastifyRequest, username: string, password: string): Promise<boolean> {
    if (username === "test" && password === "abc") {
      return true;
    }
    throw new UnauthorizedException();
  }
}