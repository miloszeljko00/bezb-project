import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { RegisterUserInfoService } from 'src/app/core/services/register-user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy{

  getUserSubscription = new Subscription();

  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private registerUserInfoService: RegisterUserInfoService
  ) {}

  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe()
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    if(this.user)this.user = new User(this.user.email, this.user.roles, this.user.permissions)

    this.getUserSubscription = this.authService.getUserObservable().subscribe({
      next: (result) => {
        this.user = result
        if(this.user)this.user = new User(this.user.email, this.user.roles, this.user.permissions)
        console.log(this.user);
      }
    })
  }

  login() {
   this.router.navigate(['/login'])
  }

  logout() {
    this.authService.logout()
  }

  goToHomePage() {
    this.router.navigate([''])
  }
  goToRegisterPage() {
    this.router.navigate(['/register'])
  }
  goToEmployees() {
    this.router.navigate(['/employees'])
  }
  goToRegisterNewAdminPage() {
    this.router.navigate(['/register-new-admin'])
  }
  goToProjects() {
    this.router.navigate(['/projects'])
  }
  goToAdminProfile() {
    this.router.navigate(['/account/admin'])
  }
  goToManageRoles() {
    this.router.navigate(['/manage-roles'])
  }
  test() {
    this.http.get(environment.apiUrl + '/api/test').subscribe({
      next: () =>{
        this.toastr.success("Working!")
      },
      error: (err: HttpErrorResponse) =>{
        this.toastr.error("Error: " + err.message)
      }
    })
  }
  goToPreviewRegistrationRequest() {
    this.router.navigate(['/previewRegistrationRequests'])
  }
}
