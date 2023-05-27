import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserProfile} from "../../models/userProfile";
import {Designation} from "../../../register/models/Designation";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegisterUserInfoService} from "../../../../core/services/register-user-info.service";
import {ToastrService} from "ngx-toastr";
import {SelectionModel} from "@angular/cdk/collections";
import {RoleService} from "../../../../core/services/role.service";
import {PermissionService} from "../../../../core/services/permission.service";
import {Role} from "../../../../core/models/role";
import {map, Observable} from "rxjs";
import {Permission} from "../../../../core/models/permission";
import {UserService} from "../../../../core/services/user.service";
import {Project} from "../../models/project";
import {UserProject} from "../../models/userProject";
import {SelectOption} from "../../../../shared/ui/input/components/select-field/select-field.component";
import {CreateProjectDto} from "../../models/dto/createProjectDto";
import {CreateUserProject} from "../../models/dto/createUserProject";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
/*Administrator može da pregleda sve zaposlene i sve projekte u okviru kompanije.
Takođe, može da kreira nove projekte i dodaje zaposlene za projekte. Administrator ima
pregled svih inženjera na određenom projektu. Administrator može da ažurira svoje
lične podatke i može da registruje druge administratore.


 Inicijalno postoji jedan
predefinisani administrator koji mora da promeni lozinku prilikom prve prijave na sistem*/

export class AdminProfileComponent  implements OnInit {

  //@ts-ignore
  updateForm: FormGroup;

  //@ts-ignore
  createProject: FormGroup;
  designationOptions = Object.values(Designation);
  passwordMatchError: boolean = false;
  projects: any;
  employees: any;
  userProjects:any;
  userProjectsData = new MatTableDataSource;
  projectsData = new MatTableDataSource;
  employeesData = new MatTableDataSource;
  displayedColumns = ['id', 'name', 'duration', 'manager','managerId'];
  displayedColumnsEmployees = ['id', 'firstName', 'lastName', 'country', 'city', 'street', 'email', 'phone'];
  displayedColumnsUserProjects = ['userId','user', 'project', 'startDate', 'endDate','description'];
  private User: UserProfile | undefined;
  manager: any;
  name: any;
  duration: any;
  selectManager: SelectOption[] = []
  selectProject:SelectOption[] = []
  project: any;
  selectEmployee:SelectOption[] = []
  employee: any;
  description: any;

  constructor(
    private formBuilder: FormBuilder,
    public registerUserInfoService: UserService,
    public toastrService: ToastrService, private roleService: RoleService,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.User = new UserProfile('1', 'a@email.com', 'password', 'admin', 'admin', 'admin', 'admin', 'novi sad', '00', Designation.HR)
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

  newProject() {

  }

  passwordValidator(password: FormControl) {
    const hasNumber = /[0-9]/.test(password.value);
    const hasSpecialChar = /[!*&$%]/.test(password.value);

    if (hasNumber && hasSpecialChar) {
      return null; // Password is valid
    } else {
      return {'invalidPassword': true}; // Password is invalid
    }
  }

  get f() {
    return this.updateForm!.controls;
  }

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
      this.updateForm.get('confirmPassword')!.setErrors({mismatch: true});
    } else {
      this.updateForm.get('confirmPassword')!.setErrors(null);
    }
  }

  Populate() {

    let User1 = new UserProfile('1', 'a@email.com', 'password', 'Manager', 'Managerski', 'admin', 'admin', 'novi sad', '00', Designation.ProjectManager)
    let User2 = new UserProfile('2', 'a@email.com', 'password', 'Engineer', 'Engineer', 'admin', 'admin', 'novi sad', '00', Designation.Engineer)
    let User3 = new UserProfile('3', 'a@email.com', 'password', 'Engineer2', 'Engineer2', 'admin', 'admin', 'novi sad', '00', Designation.Engineer)

    let projekat1 = new Project("1", User1, "prvi projekat", 200);
    let projekat2 = new Project("2", User1, "drugi projekat", 200)
    let Userproject1 = new UserProject("1", User2, projekat1,new Date(), new Date(), "tester")
    let Userproject3 = new UserProject("1", User3, projekat1,new Date(), new Date(), "team leader")
    let Userproject2 = new UserProject("2", User3, projekat2,new Date(), new Date(), "team leader")
    this.userProjects = [Userproject1, Userproject2, Userproject3]
    this.userProjectsData.data = this.userProjects;
    this.projects = [projekat1, projekat2];
    this.projectsData.data = this.projects;
    this.employees = [User1, User2];
    this.employeesData.data = this.employees;
    this.selectManager= [
      {
        value: User1,
        displayValue: User1.firstName,
      }];
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
    /*   this.registerUserInfoService.getProjects().subscribe({
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

  create() {
    let createProjectDto = new CreateProjectDto(this.manager, this.name, this.duration);
    console.log(createProjectDto);/*
    this.registerUserInfoService.createProject(createProjectDto).subscribe({
      next: (result:any) => {
        this.toastrService.success("Template created successfully")
      },
      error: (err:any) => {
        this.toastrService.error("Error creating template")
      }
    })*/
  }

  add() {
    //provera da l je vec na projektu ako jeste disable dugme
    let createUserProject = new CreateUserProject(this.employee, this.project, new Date(), new Date(), this.description);
    console.log(createUserProject);
    /*
    this.registerUserInfoService.createUserProject(createUserProject).subscribe({
      next: (result:any) => {
        this.toastrService.success("Template created successfully")
      },
      error: (err:any) => {
        this.toastrService.error("Error creating template")
      }
    })*/
  }
}
