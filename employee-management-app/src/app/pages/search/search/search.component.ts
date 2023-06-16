import {Component, Input, OnInit} from '@angular/core';
import {SearchDto} from "../searchDto";
import {EmployeeService} from "../../../core/services/employee.service";
import {MatTableDataSource} from "@angular/material/table";
import {Designation} from "../../register/models/Designation";
import {ToastrService} from "ngx-toastr";
import {MatInputModule} from "@angular/material/input";
import {UserProfile} from "../../profile/models/userProfile";
import {Observable} from "rxjs";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public searchRequestDto = new SearchDto();
  displayedColumns = ['id', 'firstName', 'lastName', 'country', 'city', 'street', 'email', 'phone'];

  public users : any;
  public dataSource = new MatTableDataSource<any>();
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  from: Date = new Date("2023-05-20");
  to: Date = new Date("2023-05-20");
  public employees: Observable<UserProfile[]> = new Observable<UserProfile[]>();

  constructor(
    public employeeService: EmployeeService,
    public userService: UserService) { }

  ngOnInit(): void {
    }

  search() {
    this.searchRequestDto.email = this.email;
    this.searchRequestDto.firstName = this.firstName;
    this.searchRequestDto.lastName = this.lastName;
  this.searchRequestDto.from = this.changeStartDate(this.from);
    this.searchRequestDto.to = this.changeStartDate(this.to);
    if(this.searchRequestDto.email=='')
    { this.searchWithoutEmail();
      return ;
    }
    if(this.searchRequestDto.firstName =="" && this.searchRequestDto.lastName =="")
    {
      this.SearchByEmail();
      return ;
    }
    if(this.searchRequestDto.firstName !="" && this.searchRequestDto.email !="" && this.searchRequestDto.lastName ==""
    || this.searchRequestDto.firstName =="" && this.searchRequestDto.email !="" && this.searchRequestDto.lastName !="")
    {
      this.searchWithEmailAndOneParameter();
      return ;
    }

    console.log(this.searchRequestDto);
    this.employeeService.searchEmployee(this.searchRequestDto).subscribe({
      next: (result: any) => {
        console.log(result);
        this.employees = result;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }


  private searchWithoutEmail() {
    this.searchRequestDto.firstName = this.firstName;
    this.searchRequestDto.lastName = this.lastName;
    if(this.searchRequestDto.firstName =="" && this.searchRequestDto.lastName ==""){
      this.SearchByPeriod();
    }
    if(this.searchRequestDto.firstName ==""){
      this.searchRequestDto.firstName = 'empty'
    }
    if(this.searchRequestDto.lastName ==""){
      this.searchRequestDto.lastName = 'empty'
    }

    console.log(this.searchRequestDto);
    this.searchRequestDto.from = this.changeStartDate(this.from);
    this.searchRequestDto.to = this.changeStartDate(this.to);
    this.employeeService.searchEmployeeWithoutEmail(this.searchRequestDto).subscribe({
      next: (result: any) => {
        console.log(result);
        this.employees = result;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  changeStartDate(element : any): string {
    const outputDate = new Date(
      element.getTime() -
      element.getTimezoneOffset() * 60 * 1000 +
      10 * 60 * 60 * 1000 +
      30 * 60 * 1000
    );
    const formattedDate = outputDate.toISOString().slice(0, 19);
    return formattedDate.toString();
  }

  private SearchByPeriod() {
    this.searchRequestDto.from = this.changeStartDate(this.from);
    this.searchRequestDto.to = this.changeStartDate(this.to);
    console.log(this.searchRequestDto);
    this.employeeService.searchEmployeeByPeriod(this.searchRequestDto).subscribe({
      next: (result: any) => {
        console.log(result);
        this.employees = result;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  private SearchByEmail() {
    this.searchRequestDto.email = this.email
    this.searchRequestDto.from = this.changeStartDate(this.from);
    this.searchRequestDto.to = this.changeStartDate(this.to);
    this.employeeService.searchEmployeeByEmail(this.searchRequestDto).subscribe({
      next: (result: any) => {
        console.log(result);
        this.employees = result;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
  private searchWithEmailAndOneParameter
  () {
    if(this.searchRequestDto.firstName ==""){
      this.searchRequestDto.firstName = 'empty'
    }
    if(this.searchRequestDto.lastName ==""){
      this.searchRequestDto.lastName = 'empty'
    }
    this.searchRequestDto.email = this.email
    this.searchRequestDto.from = this.changeStartDate(this.from);
    this.searchRequestDto.to = this.changeStartDate(this.to);
    this.employeeService.searchWithEmailAndOneParameter(this.searchRequestDto).subscribe({
      next: (result: any) => {
        console.log(result);
        this.employees = result;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
}
