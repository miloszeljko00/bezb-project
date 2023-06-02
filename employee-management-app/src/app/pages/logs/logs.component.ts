import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { LogService } from 'src/app/core/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  logs$ = this.logService.getLogsObservable().pipe(
    tap((logs) => {
      console.log(logs);
    })
  )

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.logService.fetch()
  }
}
