import {FormControl, Validators} from "@angular/forms";
import {Designation} from "../../register/models/Designation";
import {UserProfile} from "./userProfile";
import {Project} from "./project";

export class UserProject {
  id: string;
  user: UserProfile | undefined;
  project: Project;
  startDate: Date;
  endDate: Date;
  description: string;

  constructor(id: string,
              user: UserProfile | undefined,
              project: Project,
              startDate: Date,
              endDate: Date,
              description: string
  ) {
    this.id = id;
    this.user = user;
    this.project = project;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
  }
}
