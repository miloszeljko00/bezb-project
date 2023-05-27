import {UserProfile} from "../userProfile";


export class CreateUserSkills {
  user: UserProfile | undefined;
  name: string;
  rating: number;

  constructor(
    user: UserProfile | undefined,
    name: string,
    rating: number
  ) {
    this.user = user;
    this.name = name;
    this.rating = rating;
  }
}
