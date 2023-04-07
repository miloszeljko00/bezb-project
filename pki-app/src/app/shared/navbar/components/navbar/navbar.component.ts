import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/auth/models/user';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
    ) {
    this.user = this.authService.getUser();
  }

  login() {
   this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }

  goToHomePage() {
    this.router.navigate(['']);
  }
  
  goToAccountsPage() {
    this.router.navigate(['/accounts']);
  }
  
}
