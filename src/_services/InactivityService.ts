import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private activityTimeout: number = 30000; // 5 minutes (in milliseconds)
  private userActivity: Subject<any> = new Subject<any>();
  private activityTimer: Observable<number>;

  constructor() {
    this.activityTimer = timer(this.activityTimeout);
    this.initListener();
  }

  private initListener(): void {
    // Listen to user activity events
    document.addEventListener('mousemove', () => this.resetTimer());
    document.addEventListener('keypress', () => this.resetTimer());
    document.addEventListener('click', () => this.resetTimer());
  }

  private resetTimer(): void {
    // Reset the timer on user activity
    this.userActivity.next();
    this.activityTimer = timer(this.activityTimeout);
  }

  public initializeLogout(): Observable<any> {
    return this.activityTimer.pipe(
      takeUntil(this.userActivity)
    );
  }
}
