
import Repo from "#domain/repo/repo.entity";
import Repository, { RepoRepository } from "#domain/repo/repo.repo";
import { mapper } from "#framework/mapper/mapper";
import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RepoDto } from "./dtos/repo.dto";

@Controller("api/management")
export class ManagementController {
  @Inject(RepoRepository)
  private readonly repos!: Repository;
  
  @Post()
  @UseGuards(AuthGuard("basic"))
  public create (@Body() repo: RepoDto): RepoDto {
    console.log(repo);
    console.log(mapper.map(repo, RepoDto, Repo));
    return new RepoDto();
  }
    
  @Get()
  @UseGuards(AuthGuard("basic"))
  public findAll (): RepoDto[] {
    console.log(this.repos.getAggregates());
    console.log(mapper.mapArray<Repo, RepoDto>(this.repos.getAggregates(), Repo, RepoDto));
    return mapper.mapArray<Repo, RepoDto>(this.repos.getAggregates(), Repo, RepoDto);
  }

}
