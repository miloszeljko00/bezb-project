import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Designation} from "../../../register/models/Designation";
import {MatTableDataSource} from "@angular/material/table";
import {UserProfile} from "../../models/userProfile";
import {RegisterUserInfoService} from "../../../../core/services/register-user-info.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../../../core/services/user.service";
import {Project} from "../../models/project";
import {UserProject} from "../../models/userProject";
import {SelectOption} from "../../../../shared/ui/input/components/select-field/select-field.component";

@Component({
  selector: 'app-manager-profile',
  templateUrl: './manager-profile.component.html',
  styleUrls: ['./manager-profile.component.scss']
})
/*Menadžer projekta može da ažurira lične podatke. Pored toga, menadžeru projekta
treba omogućiti prikaz svih projekata na kojima trenutno radi ili na kojima je radio, kao i
prikaz zaposlenih inženjera koji su radili na tim projektima. Menadžer projekta ima
mogućnost ažuriranja zaposlenih na projektima. Za svakog zaposlenog potrebno je
evidentirati datum početka i završetka rada na projektu.*/

export class ManagerProfileComponent implements OnInit{

  //@ts-ignore
  updateForm: FormGroup;
  designationOptions = Object.values(Designation);
  passwordMatchError: boolean = false;
  projects: any;
  userProjects:any;
  projectsData = new MatTableDataSource;
  displayedColumns = ['id', 'name', 'duration', 'manager','managerId'];
  newCaption: string = ""
  private User: UserProfile | undefined;
  userProjectsData= new MatTableDataSource;
  displayedColumnsUserProjects = ['userId','user', 'project', 'startDate','buttonStart', 'endDate','buttonEnd','description','delete'];
  selectProject:SelectOption[] = []
  project: any;
  selectEmployee:SelectOption[] = []
  employee: any;
  description: any;
  newDate: any;

  constructor(
    private formBuilder: FormBuilder,
    public registerUserInfoService: UserService,
    public toastrService: ToastrService) { }

  ngOnInit() {
    this.User = new UserProfile('1','a@email.com','password','managger','manager','admin','admin','novi sad','00', Designation.ProjectManager)
    this.updateForm = this.formBuilder.group({
      id: new FormControl({value: this.User.id, disabled: true}),
      email: [this.User.email, Validators.required],
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
    this.Populate();
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


  Populate(){
   let projekat1 = new Project("1", this.User, "prvi projekat", 200);
    let projekat2 = new Project("2", this.User, "drugi projekat", 200)
    this.projects = [projekat1, projekat2]
    this.projectsData.data = this.projects;

   let User2 = new UserProfile('2', 'a@email.com', 'password', 'Engineer', 'Engineer', 'admin', 'admin', 'novi sad', '00', Designation.Engineer)
    let User3 = new UserProfile('3', 'a@email.com', 'password', 'Engineer2', 'Engineer2', 'admin', 'admin', 'novi sad', '00', Designation.Engineer)
    let Userproject1 = new UserProject("1", User2, projekat1,new Date(), new Date(), "tester")
    let Userproject3 = new UserProject("1", User3, projekat1,new Date(), new Date(), "team leader")
    let Userproject2 = new UserProject("2", User3, projekat2,new Date(), new Date(), "team leader")
    this.userProjects = [Userproject1, Userproject2, Userproject3]
    this.userProjectsData.data = this.userProjects;
    this.selectEmployee= [
      {
        value: User2,
        displayValue: User2.firstName,
      },
      {
        value: User3,
        displayValue: User3.firstName,
      }
    ];
    this.selectProject= [
      {
        value: projekat2,
        displayValue: projekat2.name,
      },
      {
        value: projekat1,
        displayValue: projekat1.name,
      }
    ];
    //get userProjects za projekte na kojima je ovaj bio manager
    /*   this.registerUserInfoService.getProjectsForManager().subscribe({
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

  delete(element:UserProject) {

  }

  add() {

  }
  changeStartDate(element : any) {
    element.startDate = this.newDate;}
  changeEndDate(element : any) {
    element.endDate = this.newDate;}
}
