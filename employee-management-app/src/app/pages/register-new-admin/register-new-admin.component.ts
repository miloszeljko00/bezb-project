import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterUserInfoService } from 'src/app/core/services/register-user-info.service';
import { Designation } from '../register/models/Designation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-new-admin',
  templateUrl: './register-new-admin.component.html',
  styleUrls: ['./register-new-admin.component.scss']
})
export class RegisterNewAdminComponent {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private registerUserInfoService: RegisterUserInfoService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required],
      designation: [Designation.Admin, Validators.required]
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.registerUserInfoService.createRegistration(this.form.value).subscribe({
        next: (result: any) => {
          console.log(result);
          this.toastr.success("New admin created!");
        },
        error: (error: any) => {
          this.toastr.error(error.error);
        }
      })
    }
  }
  get f() {
    return this.form!.controls;
  }
  validatePasswordMatch() {
    const password = this.form.get('password')!.value;
    const confirmPassword = this.form.get('confirmPassword')!.value;

    if (password !== confirmPassword) {
      this.form.get('confirmPassword')!.setErrors({mismatch: true});
    } else {
      this.form.get('confirmPassword')!.setErrors(null);
    }
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
}
