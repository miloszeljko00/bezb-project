import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Designation} from "../../../register/models/Designation";
import {RegisterUserInfoService} from "../../../../core/services/register-user-info.service";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {UserProfile} from "../../models/userProfile";


@Component({
  selector: 'app-engineer-profile',
  templateUrl: './engineer-profile.component.html',
  styleUrls: ['./engineer-profile.component.scss']
})
/*korisnik ima mogućnost da ažurira svoje veštine i postavi svoj CV dokument
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
  dataSource = new MatTableDataSource;
  displayedColumns = ['id', 'name', 'duration', 'caption', 'buttons'];

  newCaption: string = ""
  private User: UserProfile | undefined;
  constructor(
    private formBuilder: FormBuilder,
    public registerUserInfoService: RegisterUserInfoService,
    public toastrService: ToastrService) { }

  ngOnInit() {
    this.User = new UserProfile('1','a@email.com','password','admin','admin','admin','admin','novi sad','00', Designation.Engineer)
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
    this.getProjects();
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


  getProjects(){
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
  changeCaption(element: any) {
    element.caption = this.newCaption;

    /*
    this.registerUserInfoService.changeCaption(element.id, this.newCaption ).subscribe({
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
