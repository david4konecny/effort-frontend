import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeService } from '../service/time.service';
import { TimeSession } from '../time-session';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { TimeDialogComponent } from '../time-dialog/time-dialog.component';
import { Intent } from '../../intent.enum';
import { TimeUtil } from '../time-util';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit, OnDestroy {
  timeEntries: TimeSession[];
  date = new Date();
  private entryChangedSub: Subscription;

  constructor(
    private timeService: TimeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTimeEntries();
    this.reloadEntriesOnChange();
  }

  private loadTimeEntries() {
    this.timeService.getEntriesByDate(this.date).subscribe(
      next => this.timeEntries = next
    );
  }

  onOpenEditDialog(timeEntry: TimeSession) {
    const dialogRef = this.dialog.open(
      TimeDialogComponent,
      { height: '350', width: '400px', data: { action: Intent.edit , timeSession: timeEntry }});
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.editTimeEntry(result);
        }
      });
  }

  private editTimeEntry(entry: TimeSession) {
    this.timeService.editFinished(entry).subscribe(
      next => {
        entry.duration = next.duration;
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

  onDeleteEntry(entry: TimeSession) {
    this.timeService.deleteFinishedById(entry.id).subscribe(
      next => {
        this.loadTimeEntries();
      }
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
  }

}
