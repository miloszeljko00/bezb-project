import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserProfile} from "../../models/userProfile";
import {Designation} from "../../../register/models/Designation";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegisterUserInfoService} from "../../../../core/services/register-user-info.service";
import {ToastrService} from "ngx-toastr";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
/*Administrator može da pregleda sve zaposlene i sve projekte u okviru kompanije.
Takođe, može da kreira nove projekte i dodaje zaposlene za projekte. Administrator ima
pregled svih inženjera na određenom projektu. Administrator može da ažurira svoje
lične podatke i može da registruje druge administratore. Inicijalno postoji jedan
predefinisani administrator koji mora da promeni lozinku prilikom prve prijave na sistem.*/

export class AdminProfileComponent  implements OnInit {

  //@ts-ignore
  updateForm: FormGroup;
  designationOptions = Object.values(Designation);
  passwordMatchError: boolean = false;
  employees: any;
  projectsData = new MatTableDataSource;
  employeesData = new MatTableDataSource;
  displayedColumns = ['id', 'name', 'duration', 'caption', 'buttons'];
  //mozda dodati kolona koliko ima prjekata pa checkirana da bude ona na kojoj zaposleni radi
  displayedColumnsEmployees = ['id', 'firstName', 'lastName','country', 'city','street','email','phone', 'buttons'];
  private User: UserProfile | undefined;
  constructor(
    private formBuilder: FormBuilder,
    public registerUserInfoService: RegisterUserInfoService,
    public toastrService: ToastrService) { }

  ngOnInit() {
    this.User = new UserProfile('1','a@email.com','password','admin','admin','admin','admin','novi sad','00', Designation.HR)
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
    this.projectsData.data = [
      {id: '1', name: 'Hydrogen', duration: 1.0079, caption: 'H'},
      {id: '2', name: 'Hydrogen', duration: 1.0079, caption: 'H'},
      {id: '3', name: 'Hydrogen', duration: 1.0079, caption: 'H'},

    ];
    let User1 = new UserProfile('1','a@email.com', 'password', 'admin', 'admin', 'admin', 'admin', 'novi sad', '00', Designation.Engineer)
    let User2 = new UserProfile('2','a@email.com','password','admin','admin','admin','admin','novi sad','00', Designation.Engineer)
    this.employeesData.data = [User1, User2];
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
  AddEmployee(element: any) {

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.projectsData.filter = filterValue;
  }

}
