import { User } from "./user";

export interface Information extends Pick<User, "fullName" | "email"> {
  id: string | number;
  avatar?: string;
  username?: string;
  about?: string;
  personalWebsite?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
}
