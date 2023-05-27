import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Designation } from "../../../register/models/Designation";
import { RegisterUserInfoService } from "../../../../core/services/register-user-info.service";
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource } from "@angular/material/table";
import { UserProfile } from "../../models/userProfile";
import { UserService } from "../../../../core/services/user.service";
import { UserProject } from "../../models/userProject";
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Validators } from '@angular/forms';
import { UserSkills } from '../../models/userSkills';


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
  projects: UserProject[] = [];
  skills: any;
  dataSource = new MatTableDataSource;
  displayedColumns = ['id', 'name', 'startDate','endDate', 'caption', 'buttons'];

  dataSourceSkills = new MatTableDataSource;
  displayedColumnsSkills = ['name', 'rating', 'buttons'];
  private User: UserProfile | undefined;
  newCaption: string = ""
  skillName: string = ""
  rating: string =""

  registerUserInfo: any;
  constructor(
    private formBuilder: FormBuilder,
    public updateUserService: UserService,
    public toastrService: ToastrService,
    public registerUserInfoService : RegisterUserInfoService,
    public authService : AuthService) { }

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
    this.updateForm.get('email')!.disable();
    this.registerUserInfoService.getRegisterUserInfoByEmail(this.authService.getUser()!.email).subscribe({
      next: (result: any) => {
        if(!result) {
          this.toastrService.info("Server did not return response...")
          return
        }
        this.registerUserInfo = result;
        this.updateForm = this.formBuilder.group({
          email: [this.registerUserInfo.account.email, Validators.required],
          firstName: [this.registerUserInfo.firstName, Validators.required],
          lastName: [this.registerUserInfo.lastName, Validators.required],
          street: [this.registerUserInfo.address.street, Validators.required],
          city: [this.registerUserInfo.address.city, Validators.required],
          country: [this.registerUserInfo.address.country, Validators.required],
          phoneNumber: [this.registerUserInfo.phoneNumber, Validators.required]
        });
        this.updateForm.get('email')!.disable();

        this.getProjectsForUser(this.registerUserInfo.account.id);
        this.getUsersSkills(this.registerUserInfo.account.id);
      },
      error: (e:any) => {
        this.toastrService.error(e.response);
      }
    })
  }
  get f() { return this.updateForm!.controls; }

  onSubmit() {
    if (this.updateForm.valid) {
      this.updateUserService.updateEngineer(this.updateForm.value).subscribe({
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

  getProjectsForUser(id: any){
    // let manager =new UserProfile('1', 'a@email.com', 'password', 'manager', 'manager', 'kolubarska', 'serbia', 'novi sad', '00', Designation.ProjectManager);
    // let projekat1 = new Project("1", manager, "prvi projekat", 200);
    // let projekat2 = new Project("2", manager, "drugi projekat", 200)
    // let Userproject1 = new UserProject("1", this.User, projekat1,new Date(), new Date(), "tester")
    // let Userproject2 = new UserProject("2", this.User, projekat2,new Date(), new Date(), "team leader")
    this.updateUserService.getProjectsByUser(id).subscribe({
      next: (result:any) => {
        if(!result) {
          this.toastrService.info('Server did not return resource...')
        }
        this.projects = result;
        this.dataSource.data = this.projects;
      },
      error: (e: any) => {
        this.toastrService.error(e.message);
      }
    })
  }

  private getUsersSkills(userId: any) {
    // let firstSkill = new UserSkills("1", this.User, "java", 5);
    // let secondSkill = new UserSkills("2", this.User, "python", 5);
    this.updateUserService.getUserSkills(userId).subscribe({
      next: (result: any) => {
        if(!result) {
          this.toastrService.info("Server did not return response...");
        }
        this.skills = result;
        this.dataSourceSkills = this.skills;
      }
    });
  }
  changeCaption(element: any) {
    element.description = this.newCaption;
    this.updateUserService.updateUserProject(element).subscribe({
      next: (result: any) => {
        this.toastrService.success("Project description changed successfully");
        element=result;
      },
      error: (e: any) => {
        this.toastrService.error(e.message);
      }
    })
  }

  changeSkillName(element : UserSkills) {
    element.name = this.skillName;
    this.updateUserService.updateSkill(element, 'jedan').subscribe({
      next: (result: any) => {
        this.toastrService.success("User skill changed successfully");
        element=result;
      },
      error: (e: any) => {
        this.toastrService.error(e.message);
      }
    })
  }
  changeRating(element : any) {
    element.rating = this.rating;
    this.updateUserService.updateSkill(element, 'bilosta').subscribe({
      next: (result: any) => {
        this.toastrService.success("User skill changed successfully");
        element=result;
      },
      error: (e: any) => {
        this.toastrService.error(e.message);
      }
    })
  }
}
