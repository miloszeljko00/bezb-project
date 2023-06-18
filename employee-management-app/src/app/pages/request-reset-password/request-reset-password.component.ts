import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.scss']
})
export class RequestResetPasswordComponent {
  loginForm = {
    email: ''
  }

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  resetPassword($event: Event) {
    $event.preventDefault()
    this.authService.requestResetPassword(this.loginForm.email).subscribe({
      next: () => this.handleRequestResetPasswordSuccess(),
      error: () => this.handleRequestResetPasswordError()
    })
  }
  handleRequestResetPasswordError(): void {
    this.toastr.error('Something went wrong. Please try again later.')
  }
  handleRequestResetPasswordSuccess(): void {
    this.toastr.success('Please check your email for the reset password link.')
  }

}
