import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-magic-login-callback',
  templateUrl: './magic-login-callback.component.html',
  styleUrls: ['./magic-login-callback.component.css']
})
export class MagicLoginCallbackComponent implements OnInit {

  token: any;
  userEmail: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams.token;
    this.userEmail = this.route.snapshot.queryParams.userEmail;
    setTimeout(()=>{
      this.activateMagicLogin()
    }, 2000)
  }
activateMagicLogin() {
  if(this.token && this.userEmail) {
    this.http.get(environment.apiUrl+"/api/auth/actions/magic-login-activation?token="+ this.token + "&userEmail=" + this.userEmail).subscribe({
      next: (response:any) => {
        this.authService.setAuth(response)
        this.toastr.success('Magic Login successful.', "Magic Login Success")
        setTimeout(()=>{
          this.router.navigate(['']);
        }, 2000)
      }
    })
  }
  else{
    this.toastr.error("Query params are not defined :/")
  }
}

}
