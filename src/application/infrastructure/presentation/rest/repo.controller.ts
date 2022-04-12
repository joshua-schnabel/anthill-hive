
import { Controller, Get } from "@nestjs/common";

@Controller("repo")
export class RepoController {
    
  @Get()
  public findAll (): string {
    return "This action returns all cats";
  }
}
