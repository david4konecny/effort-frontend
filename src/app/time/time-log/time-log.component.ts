import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { TimeSession } from '../../model/time-session';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Intent } from '../../intent.enum';
import { TimeDialogComponent } from '../time-dialog/time-dialog.component';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit {
  timeEntries: TimeSession[];
  displayedColumns = ['time', 'duration', 'edit'];
  date = new Date();
  sub: Subscription;
  edit = Intent.edit;

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

  openDialog(action: Intent, timeEntry?: TimeSession) {
    if (!timeEntry) {
      timeEntry = this.timeService.getNewTimeSession();
    }
    const dialogRef = this.dialog.open(
      TimeDialogComponent,
      { height: '350', width: '400px', data: { action, timeSession: timeEntry }});
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          // TODO: edit entry
        }
      });
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

}
