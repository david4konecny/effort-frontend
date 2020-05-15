import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, timer} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  isTrackingTime: boolean;
  time: number;
  category: string;
  timer: Observable<number>;
  sub: Subscription;

  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isTrackingTime = false;
    this.time = 0;
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
    this.timer = timer(0, 1000);
    this.sub = this.timer.subscribe(it => this.time = it);
  }

  stopTime() {
    if (this.time < 60) {
      this.displayMessage('Minimum length: 1m');
    } else {
      this.displayMessage('Session saved');
    }
    this.time = 0;
    this.sub.unsubscribe();
  }

  displayMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 2000} );
  }

}
