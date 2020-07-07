import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeService } from '../service/time.service';
import { MatDialog } from '@angular/material/dialog';
import { TimeDialogComponent } from '../time-dialog/time-dialog.component';
import { Intent } from '../../intent.enum';
import { TimeEntry } from '../time-entry';
import { CategoryService } from '../../category/service/category.service';
import { Category } from '../../category/category';
import { TimeUtil } from '../time-util';
import { ConfirmationDialogComponent } from 'src/app/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit, OnDestroy {
  isLoaded = false;
  isTrackingTime = false;
  timeDisplay = 0;
  category: Category;
  totalDuration = 0;
  displayTimeLog = false;
  displayCategories = false;
  private timerSub: Subscription;
  private entryChangedSub: Subscription;
  private entryResetSub: Subscription;

  constructor(
    private timeService: TimeService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCurrentEntry();
    this.loadTotalDuration();
    this.loadCategory();
    this.showMessageWhenEntrySaved();
    this.resetTimerOnMidnight();
  }

  private loadCurrentEntry() {
    this.timeService.getCurrent().subscribe(
      next => {
        if (next.length) {
          const today = new Date();
          if (next[0].date === TimeUtil.toDateString(today)) {
            this.resumeCurrentEntry(next[0]);
          } else {
            const yesterday = TimeUtil.getPreviousDay(today);
            if (next[0].date !== TimeUtil.toDateString(yesterday)) {
              this.openCurrentEntryRecoveryDialog(next[0]);
            }
          }
        }
        this.isLoaded = true;
      }
    );
  }

  private resumeCurrentEntry(entry: TimeEntry) {
    this.category = entry.category;
    const now = TimeUtil.dateToSecondsOfDay(new Date());
    const duration = now - entry.startTime;
    this.timeDisplay = duration;
    this.totalDuration += duration;
    this.startCounter();
    this.isTrackingTime = true;
  }

  private startCounter() {
    this.timerSub = timer(1000, 1000).subscribe(it => {
      this.totalDuration += 1;
      this.timeDisplay += 1;
    });
  }

  private openCurrentEntryRecoveryDialog(entry: TimeEntry) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, this.getRecoveryDialogConfig(entry));
    dialog.afterClosed().subscribe(
      result => this.onCurrentDialogClosed(result, entry)
    );
  }

  private onCurrentDialogClosed(editEntry: boolean, entry: TimeEntry) {
    if (editEntry) {
      this.openEditDialog(entry);
    } else {
      this.timeService.deleteCurrentById(entry.id).subscribe();
    }
  }

  private loadTotalDuration() {
    this.timeService.getTotalFinishedDuration(new Date()).subscribe(
      next => this.totalDuration += next
    );
  }

  private loadCategory() {
    this.categoryService.getCategories().subscribe(
      next => this.category = next[0]
    );
  }

  onTimeButtonClick() {
    if (this.isTrackingTime) {
      this.stopTimeTracking();
    } else {
      this.startTimeTracking();
    }
    this.isTrackingTime = !this.isTrackingTime;
  }

  onDisplayCategories() {
    this.displayCategories = !this.displayCategories;
  }

  startTimeTracking() {
    this.timeService.startTimeTracking(this.category);
    this.startCounter();
  }

  stopTimeTracking() {
    this.timeService.stopTimeTracking();
    this.timeDisplay = 0;
    this.timerSub.unsubscribe();
  }

  openEditDialog(entry?: TimeEntry) {
    const intent = entry ? Intent.edit : Intent.add;
    if (!entry) {
      entry = this.timeService.getNewTimeEntry(this.category);
    }
    const dialog = this.dialog.open(TimeDialogComponent, this.getEditDialogConfig(entry, intent));
    dialog.afterClosed().subscribe(
      result => this.onEditDialogClosed(result, intent)
    );
  }

  private onEditDialogClosed(result: TimeEntry, intent: Intent) {
    if (result) {
      if (intent === Intent.add) {
        this.addNewTimeEntry(result);
      } else {
        this.endCurrent(result);
      }
    }
  }

  private addNewTimeEntry(entry: TimeEntry) {
    this.timeService.addFinished(entry).subscribe(
      next => {
        if (next.date === TimeUtil.toDateString(new Date())) {
          this.totalDuration += next.duration;
        }
      }
    );
  }

  private endCurrent(entry: TimeEntry) {
    this.timeService.deleteCurrentById(entry.id).subscribe(
      next => {
        entry.id = 0;
        this.timeService.addFinished(entry).subscribe(
          next => {
            if (next.date === TimeUtil.toDateString(new Date())) {
              this.totalDuration += next.duration;
            }
          }
        );
      }
    );
  }

  private resetTimerOnMidnight() {
    this.entryResetSub = this.timeService.resetCurrentEvent.subscribe(
      next => {
        if (this.timerSub) {
          this.timerSub.unsubscribe();
        }
        const now = TimeUtil.dateToSecondsOfDay(new Date());
        const duration = now - next.startTime;
        this.timeDisplay = duration;
        this.totalDuration = duration;
        this.loadTotalDuration();
        this.startCounter();
        this.isTrackingTime = true;
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

  onDurationChange(change: number) {
    if (-change > this.totalDuration) {
      this.totalDuration = 0;
    } else {
      this.totalDuration += change;
    }
  }

  private showMessageWhenEntrySaved() {
    this.entryChangedSub = this.timeService.entrySavedEvent.subscribe(
      next => {
        if (next === Intent.add) {
          this.displayMessage('Entry saved');
        }
      }
    );
  }

  private displayMessage(msg: string) {
    this.snackBar.open(msg, '', {duration: 2000} );
  }

  private getRecoveryDialogConfig(entry: TimeEntry) {
    return {
      height: '200px', width: '400px',
      data: {
        title: 'Recover old time entry?',
        content: `You have started tracking time on ${entry.date}, ${TimeUtil.secondsOfDayToString(entry.startTime)}`,
        action: 'Edit',
        discard: 'Discard'
      }
    };
  }

  private getEditDialogConfig(entry: TimeEntry, intent: Intent) {
    return { height: '350px', width: '400px', data: { action: intent, timeEntry: entry }};
  }

  ngOnDestroy() {
    this.entryChangedSub.unsubscribe();
    this.entryResetSub.unsubscribe();
  }

}
