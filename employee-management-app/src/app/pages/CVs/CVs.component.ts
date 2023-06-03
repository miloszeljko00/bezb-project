import { Component, OnInit } from '@angular/core';
import { CV } from './models/cv';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-CVs',
  templateUrl: './CVs.component.html',
  styleUrls: ['./CVs.component.css']
})
export class CVsComponent implements OnInit {

  cvs: CV[] = [];
  constructor(
    public userService : UserService,
    public toastr : ToastrService
  ) { }

  ngOnInit() {
    this.userService.getAllCvs().subscribe({
      next: (result : any) => {
        this.cvs = result;
      },
      error: (error: any) => {
        this.toastr.error(error.message)
      }
    })
  }
  downloadCv(cv: CV) {
    var base64CvData = '';
    this.userService.getCvByFileName(cv.fileNameOnFileSystem).subscribe({
      next: (result: any) => {
        base64CvData = result.base64CvData;
        // Convert base64 to byte array
        const byteCharacters = atob(base64CvData);
        // Convert byte array to ArrayBuffer
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        // Create Blob from ArrayBuffer
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        const url = URL.createObjectURL(blob);
        // Create a link element dynamically
        const link = document.createElement('a');

        // Set the link attributes
        link.href = url;
        link.download = "test.docx";

        link.dispatchEvent(new MouseEvent('click'));

        // Clean up the temporary URL
        URL.revokeObjectURL(url);
      },
      error: (e: any) => {
        this.toastr.error("Something went wrong while downloading cv :/");
        console.log(e);
      }
    })

  }

}
