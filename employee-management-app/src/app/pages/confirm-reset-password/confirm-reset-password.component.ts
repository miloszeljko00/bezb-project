import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.scss']
})
export class ConfirmResetPasswordComponent {

  token: string|undefined;
  form: FormGroup|undefined;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private auth: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params.token;
      this.form = this.formBuilder.group({
        email: [params.userEmail, Validators.required],
        password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
        confirmPassword: ['', Validators.required],
      });
    })
  }

  onSubmit(event: Event) {
    event.preventDefault()
    if(!this.token) return
    if (!this.form!.valid) return
    
    this.auth.confirmResetPassword(this.form!.value, this.token).subscribe({
      next: () => this.handleConfirmResetPasswordSuccess(),
      error: () => this.handleConfirmResetPasswordError()
    })
  }
  handleConfirmResetPasswordError(): void {
    this.toastr.error('Something went wrong. Please try again later.')
  }
  handleConfirmResetPasswordSuccess(): void {
    this.toastr.success('Password changed successfully.')
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
