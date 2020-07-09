import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TimeService } from '../service/time.service';
import { TimeEntry } from '../time-entry';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { TimeDialogComponent } from '../time-dialog/time-dialog.component';
import { Intent } from '../../intent.enum';
import { TimeUtil } from '../time-util';
import { CategoryService } from 'src/app/category/service/category.service';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit, OnDestroy {
  timeEntries: TimeEntry[];
  date = new Date();
  @Output()
  durationChangeEvent = new EventEmitter<number>();
  private entryChangedSub: Subscription;
  private categoryChangedSub: Subscription;

  constructor(
    private categoryService: CategoryService,
    private timeService: TimeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTimeEntries();
    this.reloadEntriesOnChange();
    this.reloadOnCategoryChange();
  }

  private loadTimeEntries() {
    this.timeService.getEntriesByDate(this.date).subscribe(
      next => this.timeEntries = next
    );
  }

  onOpenEditDialog(entry: TimeEntry) {
    const oldDuration = entry.duration;
    const dialogRef = this.dialog.open(
      TimeDialogComponent,
      { height: '350', width: '400px', data: { action: Intent.edit , timeEntry: entry }});
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.editTimeEntry(result, oldDuration);
        }
      });
  }

  private editTimeEntry(entry: TimeEntry, oldDuration: number) {
    this.timeService.editFinished(entry).subscribe(
      next => {
        entry.duration = entry.endTime - entry.startTime;
        if (entry.date === TimeUtil.toDateString(new Date())) {
          this.durationChangeEvent.emit(entry.duration - oldDuration);
        }
      }
    );
  }

  private reloadEntriesOnChange() {
    this.entryChangedSub = this.timeService.entrySavedEvent.subscribe(_ => this.loadTimeEntries());
  }

  onNextDay() {
    this.date = TimeUtil.getNextDay(this.date);
    this.loadTimeEntries();
  }

  onPreviousDay() {
    this.date = TimeUtil.getPreviousDay(this.date);
    this.loadTimeEntries();
  }

  onDatePicked(change: MatDatepickerInputEvent<any>) {
    this.date = change.value;
    this.loadTimeEntries();
  }

  onDeleteEntry(entry: TimeEntry) {
    this.timeService.deleteFinishedById(entry.id).subscribe(
      next => {
        this.loadTimeEntries();
        if (entry.date === TimeUtil.toDateString(new Date())) {
          this.durationChangeEvent.emit(-entry.duration);
        }
      }
    );
  }

  private reloadOnCategoryChange() {
    this.categoryChangedSub = this.categoryService.categoryChanged.subscribe(
      _ => this.loadTimeEntries()
    );
  }

  getStyleObject(color: string) {
    return {
      'border-color': color,
      'background-color': this.getColorTransparant(color)
    }
  }

  private getColorTransparant(hex: string): string {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }

  ngOnDestroy() {
    if (this.entryChangedSub) {
      this.entryChangedSub.unsubscribe();
    }
    if (this.categoryChangedSub) {
      this.categoryChangedSub.unsubscribe();
    }
  }

}
