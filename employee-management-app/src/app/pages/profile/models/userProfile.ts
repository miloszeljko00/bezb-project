import {FormControl, Validators} from "@angular/forms";
import {Designation} from "../../register/models/Designation";

export class UserProfile {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  designation: Designation;

  constructor(
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    street: string,
    country: string,
    city: string,
    phone: string,
    designation: Designation
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.street = street;
    this.lastName = lastName;
    this.country = country;
    this.city = city;
    this.phone = phone;
    this.designation = designation;
  }
}
