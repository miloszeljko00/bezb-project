import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RegisterUserInfoService } from 'src/app/core/services/register-user-info.service';

@Component({
  selector: 'app-PreviewRegistrationRequests',
  templateUrl: './PreviewRegistrationRequests.component.html',
  styleUrls: ['./PreviewRegistrationRequests.component.css']
})
export class PreviewRegistrationRequestsComponent implements OnInit {
  accountsWithStatusPending: any;
  dataSource = new MatTableDataSource;

  // Define the columns to be displayed
  displayedColumns = ['email', 'firstName', 'lastName', 'roles', 'buttons'];

  constructor(
    private registerUserInfoService: RegisterUserInfoService,
    private toastr : ToastrService
  ) { }

  ngOnInit() {
    this.getAllWithAccountStatusPending();
  }
  getAllWithAccountStatusPending(){
    this.registerUserInfoService.getAllWithAccountStatusPending().subscribe({
      next: (result:any) => {
        this.accountsWithStatusPending = result;
        console.log(this.accountsWithStatusPending);
        this.dataSource.data = result;
      },
      error: (error:any) => {
        this.toastr.error(error.message);
      }
    })
  }
  acceptRegistration(element: any) {
    this.registerUserInfoService.acceptRegistration(element.id).subscribe({
      next: (result:any) => {
        this.getAllWithAccountStatusPending();
        this.toastr.show("Email sent to user for confirmation.")
      },
      error: (error:any) => {
        console.log(error.message);
      }
    })
  }
  declineRegistration(element: any) {
    this.registerUserInfoService.declineRegistration(element.id).subscribe({
      next: (result:any) => {
        this.getAllWithAccountStatusPending();
      },
      error: (error:any) => {
        console.log(error.message);
      }
    })
  }
}
