import {UserProfile} from "./userProfile";
import {Project} from "./project";

export class UserSkills {
  id: string;
  user: UserProfile | undefined;
  name: string;
  rating: number;

  constructor(
    id: string,
    user: UserProfile | undefined,
    name: string,
    rating: number
  ) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.rating = rating;
  }
}
