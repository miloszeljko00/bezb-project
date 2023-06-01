import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { RegisterUserInfoService } from 'src/app/core/services/register-user-info.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup|undefined;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private auth: AuthService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.form = this.formBuilder.group({
        email: [params.email, Validators.required],
        oldPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
        newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
        confirmNewPassword: ['', Validators.required],
      });
    })
  }
  
  onSubmit(event: Event) {
    event.preventDefault()
    if (this.form!.valid) {
      this.auth.changePassword(this.form!.value)
    }
  }
  get f() {
    return this.form!.controls;
  }
  validatePasswordMatch() {
    const password = this.form!.get('newPassword')!.value;
    const confirmPassword = this.form!.get('confirmNewPassword')!.value;

    if (password !== confirmPassword) {
      this.form!.get('confirmNewPassword')!.setErrors({mismatch: true});
    } else {
      this.form!.get('confirmNewPassword')!.setErrors(null);
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
