import { Component, OnInit } from '@angular/core';
import { Subscription, timer} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeService } from '../service/time.service';
import { MatDialog } from '@angular/material/dialog';
import { TimeDialogComponent } from '../time-dialog/time-dialog.component';
import { Intent } from '../../intent.enum';
import { TimeSession } from '../time-session';
import { CategoryService } from '../../category/service/category.service';
import { Category } from '../../category/category';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  isLoaded = false;
  isTrackingTime = false;
  timeDisplay = 0;
  category: Category;
  totalDuration = 0;
  displayTimeLog = false;
  displayCategories = false;
  private timerSub: Subscription;

  constructor(
    private timeService: TimeService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchCurrent();
    this.initTotalDuration();
    this.loadCategory();
    this.displayMsgWhenEntrySaved();
  }

  private fetchCurrent() {
    this.timeService.getCurrent().subscribe(
      next => {
        if (next.length > 0) {
          this.category = next[0].category;
          const duration = this.timeService.dateToSecondsOfDay(new Date()) - next[0].startTime;
          this.timeDisplay = duration;
          this.totalDuration += duration;
          this.startCounter();
          this.isTrackingTime = true;
        }
        this.isLoaded = true;
      }
    );
  }

  private initTotalDuration() {
    this.timeService.getTotalFinishedDuration(new Date()).subscribe(
      next => {
        this.totalDuration += next;
      }
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
    this.displayCategories = !this.displayCategories;
  }

  startTimeTracking() {
    this.timeService.startTimeTracking(this.category);
    this.startCounter();
  }

  private startCounter() {
    this.timerSub = timer(1000, 1000).subscribe(it => {
      this.totalDuration += 1;
      this.timeDisplay += 1;
    });
  }

  stopTimeTracking() {
    this.timeService.stopTimeTracking();
    this.timeDisplay = 0;
    this.timerSub.unsubscribe();
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
    this.timeService.addFinished(entry).subscribe(
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
    if (this.isTrackingTime) {
      this.timeService.changeCategoryOfCurrent(category);
    }
    this.category = category;
  }

  private displayMsgWhenEntrySaved() {
    this.timeService.entrySavedEvent.subscribe(
      next => {
        if (next === Intent.add) {
          this.displayMessage('Entry saved');
        }
      }
    );
  }

  displayMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 2000} );
  }

}
