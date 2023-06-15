import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class NotificationService {
    
    notifications$ = new BehaviorSubject<any[]>([]);
    
    constructor(private http: HttpClient) { }

    fetchNotifications(userEmail: string): void {
        this.http.get(environment.apiUrl + `/api/notifications/${userEmail}`).subscribe({
            next: (result: any) => {
              result = result.filter((notification: any)=> notification.seen == false)
              this.notifications$.next(result);
            }
        })
    }
    markSeen(id: string){
      return this.http.put(environment.apiUrl + `/api/notifications/mark-seen/${id}`, {})
    }
    getNotificationsObservable() {
        return this.notifications$.asObservable();
    }
    getNotifications(): any[] {
        return this.notifications$.getValue();
    }

    removeNotification(notification: any): void {
        this.notifications$.next(this.notifications$.getValue().filter(n => n != notification));
    }
    
}