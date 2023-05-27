import {Permission} from "../../../core/models/permission";
import {UserProfile} from "./userProfile";

export class Project {
  id: string;
  manager: UserProfile | undefined;
  name: string;
  duration: number;

  constructor(
    id: string,
    manager: UserProfile | undefined,
    name: string,
    duration: number
  ) {
    this.id = id;
    this.manager = manager;
    this.name = name;
    this.duration = duration;
  }
}
