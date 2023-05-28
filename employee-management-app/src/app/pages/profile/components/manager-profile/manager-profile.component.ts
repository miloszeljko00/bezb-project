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
import {AuthService} from "../../../../core/auth/services/auth.service";
import {combineLatest, map, Observable} from "rxjs";

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
  newName: any;
  projectsData = new MatTableDataSource;
  userProjectsData= new MatTableDataSource;

  displayedColumns = ['id', 'name', 'duration','managerId'];
  displayedColumnsUserProjects = ['userId','user', 'project', 'startDate','buttonStart', 'endDate','buttonEnd','description','delete'];
  selectProject:SelectOption[] = []
  selectEmployee:SelectOption[] = []
  project: any;
  employee: any;
  description: any;
  userId: any;
  accountId: any;
  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    public projectService:ProjectService,
    public toastrService: ToastrService,
    private authService: AuthService,
    public registerUserInfoService: RegisterUserInfoService) { }

  ngOnInit() {
    const user = this.authService.getUser()
    if(!user) return
    this.registerUserInfoService.getRegisterUserInfoByEmail(user?.email).subscribe({
      next: (result: any) => {
        let infoArray = [result];
        this.accountId = infoArray[0].account.id ;
        this.userId = result.id;
        console.log('%cMyProject%cline:79%cresult', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px', result)

        this.Populate( this.accountId );
        this.updateForm = this.formBuilder.group({
          id: new FormControl({value: result.id, disabled: true}),
          email: [result.account.username, Validators.required],
          password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
          confirmPassword: ['', Validators.required],
          firstName: [result.firstName, Validators.required],
          lastName: [result.lastName, Validators.required],
          street: [result.address.street, Validators.required],
          city: [result.address.city, Validators.required],
          country: [result.address.country, Validators.required],
          phone: [result.phoneNumber, Validators.required]
        });}

    })

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
      const request = {
        id: this.userId,
        account: {
          username: this.updateForm.value.email,
          password: this.updateForm.value.password
        },
        firstName: this.updateForm.value.firstName,
        lastName: this.updateForm.value.lastName,
        address: {
          street: this.updateForm.value.street,
          city: this.updateForm.value.city,
          country: this.updateForm.value.country
        },
        phoneNumber: this.updateForm.value.phone,
        revisionDate: new Date(),
      }
      this.userService.updateProfile(request).subscribe({
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


  Populate(id:string){
    this.userService.getProjectsByManager(id).subscribe({
      next: (result:any) => {
        this.projects = result;
        console.log(this.projects);
        this.projectsData.data = result;
      },
      error: (error:any) => {
        this.toastrService.error(error.message);
      }
    })
    this.userService.getEmployeesByManager(this.accountId).subscribe({
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
  delete(element: UserProject) {
   /*   this.userService.deleteUserProject(element.id).subscribe(res => {
  
    })*/
      this.projectService.removeUserFromProjects(element.project.id, element.user?.id).subscribe({
        next: (result) => {
          if (result) {
            this.toastrService.success("User removed from project successfully!")
            this.Populate( this.accountId );
          } else this.toastrService.error("Error has occurred while removing user from project!")
        }
      });
  }

  add() {
      let newUserProject = new CreateUserProject(this.employee.id, this.project.id, new Date("2023-05-27T10:30:00"),new Date("2023-05-27T10:30:00"), this.description)
      this.userService.createUserProject(newUserProject).subscribe(res => {
      this.userService.getEmployeesByManager(this.accountId).subscribe({
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
      this.userService.getEmployeesByManager(this.accountId).subscribe({
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
      this.userService.getEmployeesByManager(this.accountId).subscribe({
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
