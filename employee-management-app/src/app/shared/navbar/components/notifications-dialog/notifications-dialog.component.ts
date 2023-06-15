import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject } from '@angular/core';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './notifications-dialog.component.html',
  styleUrls: ['./notifications-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsDialogComponent {
  notifications$ = this.notificationService.getNotificationsObservable();
  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}
  
  handleNotificationClick(notification: any): void {
    notification.animate = true;
    setTimeout(() => {
      this.notificationService.markSeen(notification.id).subscribe({
        next: (result: any) => {
          this.notificationService.removeNotification(notification);
        }
    })
      this.cdr.detectChanges();
    }, 500);
  }
}
