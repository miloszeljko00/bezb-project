import {UserProfile} from "../userProfile";
import {Project} from "../project";

export class CreateUserProject {
  user: UserProfile | undefined;
  project: Project;
  startDate: Date;
  endDate: Date;
  description: string;

  constructor(
              user: UserProfile | undefined,
              project: Project,
              startDate: Date,
              endDate: Date,
              description: string
  ) {
    this.user = user;
    this.project = project;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
  }
}
