import {UserProfile} from "../userProfile";
import {Project} from "../project";

export class CreateUserProject {
  engineerId: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  description: string;

  constructor(
              user: string,
              project: string,
              startDate: Date,
              endDate: Date,
              description: string
  ) {
    this.engineerId = user;
    this.projectId = project;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
  }
}
