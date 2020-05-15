import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  isTrackingTime: boolean;
  time: string;
  timer: Observable<number>;
  sub: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.isTrackingTime = false;
    this.updateCurrentTime(0);
  }

  onButtonClick() {
    if (this.isTrackingTime) {
      this.stopTime();
    } else {
      this.startTime();
    }
    this.isTrackingTime = !this.isTrackingTime;
  }

  startTime() {
    this.timer = timer(0, 1000);
    this.sub = this.timer.subscribe(it => this.updateCurrentTime(it));
  }

  stopTime() {
    this.sub.unsubscribe();
  }

  updateCurrentTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const min = Math.floor(seconds / 60) % 60;
    const sec = Math.floor(seconds % 60);
    this.time = `${hours}:${min}:${sec}`;
  }

}
