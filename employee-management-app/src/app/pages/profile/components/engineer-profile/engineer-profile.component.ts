import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Designation} from "../../../register/models/Designation";
import {RegisterUserInfoService} from "../../../../core/services/register-user-info.service";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {UserProfile} from "../../models/userProfile";
import {UserService} from "../../../../core/services/user.service";
import {Project} from "../../models/project";
import {UserSkills} from "../../models/userSkills";
import {UserProject} from "../../models/userProject";


@Component({
  selector: 'app-engineer-profile',
  templateUrl: './engineer-profile.component.html',
  styleUrls: ['./engineer-profile.component.scss']
})
/*Registrovani korisnik u mogućnosti je da ažurira svoje lične podatke na stranici za
prikaz svog profila. Zaposleni ne sme da menja svoju email adresu. Pored osnovnih
podataka, korisnik ima mogućnost da ažurira svoje veštine i postavi svoj CV dokument
(za veštinu se definiše naziv i brojčana procena u nekom opsegu, npr. Java 5, Python
4).
Pored toga, zaposlenom treba omogućiti prikaz projekata na kojima je radio u okviru IT
kompanije. Za svaki projekat se evidentira naziv, trajanje i opis šta je konkretan inženjer
radio na projektu. Inženjer ima pravo da pregleda projekte i menja opis sopstvenih
zaduženja, ali nema pravo da menja naziv i trajanje projekta. Takođe, inženjer može da
vidi samo opis svog posla na projektu, ne i opise drugih inženjera na istom projektu.*/

export class EngineerProfileComponent implements OnInit{

  //@ts-ignore
  updateForm: FormGroup;
  designationOptions = Object.values(Designation);
  passwordMatchError: boolean = false;
  projects: any;
  skills: any;
  dataSource = new MatTableDataSource;
  displayedColumns = ['id', 'name', 'startDate','endDate', 'caption', 'buttons'];

  dataSourceSkills = new MatTableDataSource;
  displayedColumnsSkills = ['name', 'rating', 'buttons'];
  private User: UserProfile | undefined;
  newCaption: string = ""
  rating: string =""

  constructor(
    private formBuilder: FormBuilder,
    public registerUserInfoService: UserService,
    public toastrService: ToastrService) { }

  ngOnInit() {
    this.User = new UserProfile('1','a@email.com','password','engineer','engineer','kolubarska','serbia','novi sad','00', Designation.Engineer)
    this.updateForm = this.formBuilder.group({
      id: new FormControl({value: this.User.id, disabled: true}),
      email: new FormControl({value: this.User.email, disabled: true}),
      password: [this.User.password, [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      firstName: [this.User.firstName, Validators.required],
      lastName: [this.User.lastName, Validators.required],
      street: [this.User.street, Validators.required],
      city: [this.User.city, Validators.required],
      country: [this.User.country, Validators.required],
      phone: [this.User.phone, Validators.required],
      designation: [this.User.designation, Validators.required]
    });
    this.getProjectsForUser();
    this.getUsersSkills();
  }
  passwordValidator(password: FormControl) {
    const hasNumber = /[0-9]/.test(password.value);
    const hasSpecialChar = /[!*&$%]/.test(password.value);

    if (hasNumber && hasSpecialChar) {
      return null; // Password is valid
    } else {
      return { 'invalidPassword': true }; // Password is invalid
    }
  }
  get f() { return this.updateForm!.controls; }

  onSubmit() {
    if (this.updateForm.valid) {
      this.registerUserInfoService.updateEngineer(this.updateForm.value).subscribe({
        next: (result: any) => {
          console.log(result);
          this.toastrService.success("Profile updated!");
        },
        error: (error: any) => {
          this.toastrService.error(error.error);
        }
      })
    }
  }
  validatePasswordMatch() {
    const password = this.updateForm.get('password')!.value;
    const confirmPassword = this.updateForm.get('confirmPassword')!.value;

    if (password !== confirmPassword) {
      this.updateForm.get('confirmPassword')!.setErrors({ mismatch: true });
    } else {
      this.updateForm.get('confirmPassword')!.setErrors(null);
    }
  }


  getProjectsForUser(){

    let manager =new UserProfile('1', 'a@email.com', 'password', 'manager', 'manager', 'kolubarska', 'serbia', 'novi sad', '00', Designation.ProjectManager);
    let projekat1 = new Project("1", manager, "prvi projekat", 200);
    let projekat2 = new Project("2", manager, "drugi projekat", 200)
    let Userproject1 = new UserProject("1", this.User, projekat1,new Date(), new Date(), "tester")
    let Userproject2 = new UserProject("2", this.User, projekat2,new Date(), new Date(), "team leader")
    this.projects = [Userproject1, Userproject2]
    this.dataSource.data = this.projects;

  /*   this.registerUserInfoService.getProjectsForUser().subscribe({
         next: (result:any) => {
           this.projects = result;
           console.log(this.projects);
           this.dataSource.data = result;
         },
         error: (error:any) => {
           this.toastrService.error(error.message);
         }
       }) */
  }
  changeCaption(element: any) {
    element.description = this.newCaption;

    /*
    this.registerUserInfoService.changeCaption(element).subscribe({
      next: (result:any) => {
        this.getProjects();
        this.toastrService.show("Caption changed.")
      },
      error: (error:any) => {
        console.log(error.message);
      }
    })*/
  }

  private getUsersSkills() {
    let firstSkill = new UserSkills("1", this.User, "java", 5);
    let secondSkill = new UserSkills("2", this.User, "python", 5);
    this.skills = [firstSkill, secondSkill];
    this.dataSourceSkills = this.skills;
  }

  changeRating(element : any) {
    element.rating = this.rating;
    /*
      this.registerUserInfoService.changeRating(element).subscribe({
        next: (result:any) => {
          this.getProjects();
          this.toastrService.show("Caption changed.")
        },
        error: (error:any) => {
          console.log(error.message);
        }
      })*/
  }
}
