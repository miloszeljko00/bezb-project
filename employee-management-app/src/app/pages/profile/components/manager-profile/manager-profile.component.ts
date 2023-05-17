import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Designation} from "../../../register/models/Designation";
import {MatTableDataSource} from "@angular/material/table";
import {UserProfile} from "../../models/userProfile";
import {RegisterUserInfoService} from "../../../../core/services/register-user-info.service";
import {ToastrService} from "ngx-toastr";

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
  dataSource = new MatTableDataSource;
  displayedColumns = ['id', 'name', 'duration', 'caption', 'buttons'];
  newCaption: string = ""
  private User: UserProfile | undefined;
  constructor(
    private formBuilder: FormBuilder,
    public registerUserInfoService: RegisterUserInfoService,
    public toastrService: ToastrService) { }

  ngOnInit() {
    this.User = new UserProfile('1','a@email.com','password','admin','admin','admin','admin','novi sad','00', Designation.ProjectManager)
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
    this.getProjectsForManager();
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


  getProjectsForManager(){
    this.dataSource.data = [
      {id: '1', name: 'Hydrogen', duration: 1.0079, caption: 'H'},
      {id: '2', name: 'Hydrogen', duration: 1.0079, caption: 'H'},
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

}
