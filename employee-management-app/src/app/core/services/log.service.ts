import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LogEntry } from '../models/log-entry';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService implements OnDestroy{


  private logs$ = new BehaviorSubject<LogEntry[]>([]);

  private fetchSubscription = new Subscription();

  constructor(private http: HttpClient) { }

  ngOnDestroy(): void {
    this.fetchSubscription.unsubscribe()
  }

  fetch(){
    this.fetchSubscription.unsubscribe()
    this.fetchSubscription = this.http.get<LogEntry[]>(environment.apiUrl + `/api/logs`).subscribe({
      next: (result) => {
        this.logs$.next(result)
      }
    })
  }

  getLogsObservable() {
    return this.logs$.asObservable()
  }
}
