import User, { UserId } from "./user.entity";
import {Repository} from "#ddd";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export default interface UserRepository extends Repository<UserId, User> {}
