import User, { UserId } from "./user.entity";
import {Repository} from "#ddd";

export const UserRepositoryToken = "UserRepository";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserRepository extends Repository<UserId, User> {}
