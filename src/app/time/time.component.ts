import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, timer} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeService } from '../services/time.service';
import { MatDialog } from '@angular/material/dialog';
import {TimeDialogComponent} from './time-dialog/time-dialog.component';
import {Intent} from '../intent.enum';
import {TimeSession} from '../model/time-session';
import {CategoryService} from '../category/category.service';
import {Category} from '../model/category';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  isTrackingTime: boolean;
  timeDisplay: number;
  category: Category;
  chronometer: Observable<number>;
  totalDuration = 0;
  displayTimeLog = false;
  displayCategories = false;
  sub: Subscription;

  constructor(
    private timeService: TimeService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initTotalDuration();
    this.isTrackingTime = false;
    this.timeDisplay = 0;
    this.loadCategory();
  }

  private initTotalDuration() {
    this.timeService.getTotalDuration(new Date()).subscribe(
      next => this.totalDuration = next
    );
  }

  private loadCategory() {
    this.categoryService.getCategories().subscribe(
      next => {
        this.category = next[0];
      }
    );
  }

  onTimeClick() {
    if (this.isTrackingTime) {
      this.stopTimeTracking();
    } else {
      this.startTimeTracking();
    }
    this.isTrackingTime = !this.isTrackingTime;
  }

  onCategoryClick() {
    if (this.isTrackingTime) {
      this.displayMessage('Cannot change category during time tracking');
    } else {
      this.displayCategories = !this.displayCategories;
    }
  }

  startTimeTracking() {
    const session = this.timeService.getNewTimeSession(this.category);
    this.timeService.startTimeTracking(session);
    this.chronometer = timer(1000, 1000);
    this.sub = this.chronometer.subscribe(it => {
      session.endTime += 1;
      this.totalDuration += 1;
      this.timeDisplay = it + 1;
    });
  }

  stopTimeTracking() {
    this.timeService.saveTrackedTime().subscribe(
      next => {
        this.displayMessage('Entry saved');
      }
    );
    this.timeDisplay = 0;
    this.sub.unsubscribe();
  }

  onOpenDialog() {
    const timeSession = this.timeService.getNewTimeSession(this.category);
    const dialog = this.dialog.open(
      TimeDialogComponent,
      { height: '350px', width: '400px', data: { action: Intent.add, timeSession }}
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

  onCategoryChanged(category: Category) {
    if (!this.isTrackingTime) {
      this.category = category;
    }
  }

  displayMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 2000} );
  }

}
