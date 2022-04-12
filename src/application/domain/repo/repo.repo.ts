import {Repository} from "#ddd";
import Repo, { RepoId } from "./repo.entity";

export const RepoRepository = "RepoRepository";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface RepoRepository extends Repository<RepoId, Repo> {}
