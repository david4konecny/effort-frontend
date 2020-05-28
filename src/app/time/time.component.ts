import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, timer} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeService } from '../services/time.service';
import { MatDialog } from '@angular/material/dialog';
import {TimeDialogComponent} from './time-dialog/time-dialog.component';
import {Intent} from '../intent.enum';
import {TimeSession} from '../model/time-session';

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
  totalDuration = 0;
  displayTimeLog = false;
  sub: Subscription;
  add = Intent.add;
  edit = Intent.edit;

  constructor(
    private timeService: TimeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initTotalDuration();
    this.isTrackingTime = false;
    this.timeDisplay = 0;
    this.category = 'programming';
  }

  private initTotalDuration() {
    this.timeService.getTotalDuration(new Date()).subscribe(
      next => this.totalDuration = next
    );
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

  openDialog(action: Intent) {
    const timeSession = this.timeService.getNewTimeSession();
    const dialog = this.dialog.open(
      TimeDialogComponent,
      { height: '350px', width: '400px', data: { action, timeSession }}
    );
    dialog.afterClosed().subscribe(
      result => {
        if (result) {
          this.addNewTimeEntry(result);
        }
      }
    );
  }

  private addNewTimeEntry(entry: TimeSession) {
    this.timeService.addNewTimeEntry(entry).subscribe(
      next => {
        if (next.date === this.timeService.toDateString(new Date())) {
          this.totalDuration += next.duration;
        }
      }
    );
  }

  onDisplayTimeLog() {
    this.displayTimeLog = !this.displayTimeLog;
  }

  displayMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 2000} );
  }

}
