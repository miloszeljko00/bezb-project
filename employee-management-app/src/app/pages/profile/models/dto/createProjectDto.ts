import {UserProfile} from "../userProfile";

export class CreateProjectDto {
  manager: UserProfile | undefined;
  name: string;
  duration: number;

  constructor(
    manager: UserProfile | undefined,
    name: string,
    duration: number
  ) {
    this.manager = manager;
    this.name = name;
    this.duration = duration;
  }
}
