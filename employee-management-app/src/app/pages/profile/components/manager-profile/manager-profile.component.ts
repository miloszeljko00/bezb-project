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
import {ProjectService} from "../../../../core/services/project.service";
import {CreateUserProject} from "../../models/dto/createUserProject";
import {C} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-manager-profile',
  templateUrl: './manager-profile.component.html',
  styleUrls: ['./manager-profile.component.scss']
})

export class ManagerProfileComponent implements OnInit{

  //@ts-ignore
  updateForm: FormGroup;
  designationOptions = Object.values(Designation);
  passwordMatchError: boolean = false;

  projects: any;
  userProjects:any;
  allEmployees: any;
  newCaption: string = ""
  newDate: any;
  private User: UserProfile | undefined;

  projectsData = new MatTableDataSource;
  userProjectsData= new MatTableDataSource;

  displayedColumns = ['id', 'name', 'duration','managerId'];
  displayedColumnsUserProjects = ['userId','user', 'project', 'startDate','buttonStart', 'endDate','buttonEnd','description','delete'];
  selectProject:SelectOption[] = []
  selectEmployee:SelectOption[] = []
  project: any;
  employee: any;
  description: any;

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    public projectService:ProjectService,
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
      this.userService.updateEngineer(this.updateForm.value).subscribe({
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
    this.userService.getProjectsByManager("d46fb741-5d9a-44dc-bc70-73ebea53dc25").subscribe({
      next: (result:any) => {
        this.projects = result;
        console.log(this.projects);
        this.projectsData.data = result;
      },
      error: (error:any) => {
        this.toastrService.error(error.message);
      }
    })

    this.userService.getEmployeesByManager("d46fb741-5d9a-44dc-bc70-73ebea53dc25").subscribe({
      next: (result:any) => {
        this.userProjects = result;
        console.log(this.userProjects);
        this.userProjectsData.data = result;
      },
      error: (error:any) => {
        this.toastrService.error(error.message);
      }
    })
    this.userService.getAccounts().subscribe({
      next: (result:any) => {
        this.allEmployees = result;
        console.log(this.allEmployees);
      },
      error: (error:any) => {
        this.toastrService.error(error.message);
      }
    })

  }

  delete(element:UserProject) {
      this.userService.deleteUserProject(element.id).subscribe(res => {
      this.userService.getEmployeesByManager("d46fb741-5d9a-44dc-bc70-73ebea53dc25").subscribe({
          next: (result:any) => {
            this.userProjects = result;
            console.log(this.userProjects);
            this.userProjectsData.data = result;
          },
          error: (error:any) => {
            this.toastrService.error(error.message);
          }
      })
    })
  }

  add() {
      let newUserProject = new CreateUserProject(this.employee.id, this.project.id, new Date("2023-05-27T10:30:00"),new Date("2023-05-27T10:30:00"), this.description)
      this.userService.createUserProject(newUserProject).subscribe(res => {
      this.userService.getEmployeesByManager("d46fb741-5d9a-44dc-bc70-73ebea53dc25").subscribe({
          next: (result:any) => {
            this.userProjects = result;
            console.log(this.userProjects);
            this.userProjectsData.data = result;
          },
          error: (error:any) => {
            this.toastrService.error(error.message);
          }
        })
      })
  }
  changeStartDate(element : any) {
    const outputDate = new Date(
      this.newDate.getTime() -
      this.newDate.getTimezoneOffset() * 60 * 1000 +
      10 * 60 * 60 * 1000 +
      30 * 60 * 1000
    );
    const formattedDate = outputDate.toISOString().slice(0, 19);
    element.startDate = formattedDate;

    this.userService.updateUserProject(element).subscribe(res => {
      this.userService.getEmployeesByManager("d46fb741-5d9a-44dc-bc70-73ebea53dc25").subscribe({
          next: (result:any) => {
            this.userProjects = result;
            console.log(this.userProjects);
            this.userProjectsData.data = result;
          },
          error: (error:any) => {
            this.toastrService.error(error.message);
          }
       })
    })}



  changeEndDate(element : any) {
    const outputDate = new Date(
    this.newDate.getTime() -
    this.newDate.getTimezoneOffset() * 60 * 1000 +
    10 * 60 * 60 * 1000 +
    30 * 60 * 1000
  );
    const formattedDate = outputDate.toISOString().slice(0, 19);
    element.endDate = formattedDate;

    this.userService.updateUserProject(element).subscribe(res => {
      this.userService.getEmployeesByManager("d46fb741-5d9a-44dc-bc70-73ebea53dc25").subscribe({
          next: (result:any) => {
            this.userProjects = result;
            console.log(this.userProjects);
            this.userProjectsData.data = result;
          },
          error: (error:any) => {
            this.toastrService.error(error.message);
          }
      })
    })}
}
