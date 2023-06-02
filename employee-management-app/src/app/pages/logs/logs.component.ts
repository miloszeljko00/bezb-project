import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { LogEntry } from 'src/app/core/models/log-entry';
import { LogService } from 'src/app/core/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  logs$ = this.logService.getLogsObservable().pipe(
    map((logs: LogEntry[]) => {
      logs.forEach(log => {
        log.timestamp = new Date(log.timestamp)
      });
      return logs
    })
  )

  constructor(private logService: LogService) {}

  trackByTimestamp(index: number, log: LogEntry) {
    return log.timestamp
  }

  ngOnInit() {
    //run this.logService.fetch() every 5seconds 
    this.logService.fetch()
    setInterval(() => {
      this.logService.fetch()
    }, 10000)
  }
}
