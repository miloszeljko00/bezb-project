import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { RegisterUserInfoService } from 'src/app/core/services/register-user-info.service';
import { environment } from 'src/environments/environment';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy{
  notifications$ = this.notificationService.getNotificationsObservable();
  getUserSubscription = new Subscription();
  user: User | null = null;
  dialogRef!: MatDialogRef<NotificationsDialogComponent>;
  dialogOpened = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private registerUserInfoService: RegisterUserInfoService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe()
  }
  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    if (this.dialogRef && !this.dialogRef._containerInstance['_elementRef'].nativeElement.contains(event.target)) {
      this.dialogRef.close();
    }
  }
  openNotificationsDialog() {
    if(this.dialogRef)this.dialogRef.close();
    this.dialogRef = this.dialog.open(NotificationsDialogComponent, {
      hasBackdrop: false,
      restoreFocus: false,
      autoFocus: false,
      position: {
        top: '62px',
        right: '165px'
      },
    });

    this.dialogRef.afterOpened().subscribe(() => {
      this.dialogOpened = true;
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogOpened = false;
    });
  }
  ngOnInit() {
    this.user = this.authService.getUser();
    if(this.user)this.user = new User(this.user.email, this.user.roles, this.user.permissions)
    if(this.user?.hasRole('Administrator')){
      setInterval(() => {
        this.user = this.authService.getUser()
        if(!this.dialogOpened && this.user) this.notificationService.fetchNotifications(this.user?.email!)
      }, 2000)
    }
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
  goToChangePasswordPage() {
    this.router.navigate(['/change-password', this.user?.email])
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
  goToEngineerAccount() {
    this.router.navigate(['/account/engineer'])
  }
  goToManagerAccount() {
    this.router.navigate(['/account/manager'])
  }
  goToCvs(){
    this.router.navigate(['/cvs'])
  }
  goToLogsPage() {
    this.router.navigate(['/logs'])
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
