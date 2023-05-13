import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';

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
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.getUserSubscription.unsubscribe()
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.getUserSubscription = this.authService.getUserObservable().subscribe({
      next: (result) => {
        this.user = result
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
  
  goToAccountsPage() {
    this.router.navigate(['/accounts'])
  }
  goToTemplatesPage() {
    this.router.navigate(['/certificates/template'])
  }
  
  goToCertificatesPage() {
    this.router.navigate(['/certificates'])
  }
}
