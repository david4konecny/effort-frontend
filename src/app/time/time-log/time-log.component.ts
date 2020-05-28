import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { TimeSession } from '../../model/time-session';
import {Subscription} from 'rxjs';

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

  constructor(
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.loadTimeEntries();
  }

  private loadTimeEntries() {
    this.sub = this.timeService.getEntriesByDate(this.date).subscribe(
      next => this.timeEntries = next
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

}
