import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, timer} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeService } from '../services/time.service';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  isTrackingTime: boolean;
  timeDisplay: number;
  category: string;
  chronometer: Observable<number>;
  todayTotal = 0;
  sub: Subscription;

  constructor(
    private timeService: TimeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isTrackingTime = false;
    this.timeDisplay = 0;
    this.category = 'programming';
  }

  onTimeClick() {
    if (this.isTrackingTime) {
      this.stopTime();
    } else {
      this.startTime();
    }
    this.isTrackingTime = !this.isTrackingTime;
  }

  onCategoryClick() {

  }

  startTime() {
    const session = this.timeService.getNewTimeSession();
    this.timeService.startTimeSession(session);
    this.chronometer = timer(0, 1000);
    this.sub = this.chronometer.subscribe(it => {
      session.endTime = new Date().getTime();
      this.timeDisplay = it;
      this.todayTotal = this.timeService.getTodayTotal();
    });
  }

  stopTime() {
    this.timeService.stopTimeSession();
    if (this.timeDisplay < 5) {
      this.displayMessage('Minimum length: 5s');
    } else {
      this.displayMessage('Session saved');
    }
    this.timeDisplay = 0;
    this.sub.unsubscribe();
  }

  displayMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 2000} );
  }

}
