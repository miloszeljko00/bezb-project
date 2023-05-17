import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Designation } from './models/Designation';
import { RegisterUserInfoService } from 'src/app/core/services/register-user-info.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterPage implements OnInit {

  //@ts-ignore
  registrationForm: FormGroup;
  designationOptions = Object.values(Designation);
  passwordMatchError: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public registerUserInfoService: RegisterUserInfoService,
    public toastrService: ToastrService) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      designation: ['', Validators.required]
    });
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
  get f() { return this.registrationForm!.controls; }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.registerUserInfoService.createRegistration(this.registrationForm.value).subscribe({
        next: (result: any) => {
          console.log(result);
          this.toastrService.success("Registration Sent!");
        },
        error: (error: any) => {
          this.toastrService.error(error.error);
        }
      })
    }
  }
  validatePasswordMatch() {
    const password = this.registrationForm.get('password')!.value;
    const confirmPassword = this.registrationForm.get('confirmPassword')!.value;

    if (password !== confirmPassword) {
      this.registrationForm.get('confirmPassword')!.setErrors({ mismatch: true });
    } else {
      this.registrationForm.get('confirmPassword')!.setErrors(null);
    }
  }
}
