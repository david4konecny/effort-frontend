import { Component, OnInit } from '@angular/core';
import { TimeService } from '../service/time.service';
import { TimeSession } from '../time-session';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { TimeDialogComponent } from '../time-dialog/time-dialog.component';
import { Intent } from '../../intent.enum';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit {
  timeEntries: TimeSession[];
  date = new Date();
  sub: Subscription;

  constructor(
    private timeService: TimeService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTimeEntries();
  }

  private loadTimeEntries() {
    this.sub = this.timeService.getEntriesByDate(this.date).subscribe(
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

  private reloadTimeEntries() {
    this.sub.unsubscribe();
    this.loadTimeEntries();
  }

  onNextDay() {
    this.date = this.timeService.getNextDay(this.date);
    this.reloadTimeEntries();
  }

  onPreviousDay() {
    this.date = this.timeService.getPreviousDay(this.date);
    this.reloadTimeEntries();
  }

  onDatePicked(change: MatDatepickerInputEvent<any>) {
    this.date = change.value;
    this.reloadTimeEntries();
  }

  onDeleteEntry(entry: TimeSession) {
    this.timeService.deleteFinishedById(entry.id).subscribe(
      next => {
        this.reloadTimeEntries();
      }
    );
  }

}
