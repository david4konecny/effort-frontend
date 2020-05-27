import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../services/time.service';
import { TimeSession } from '../../model/time-session';

@Component({
  selector: 'app-time-log',
  templateUrl: './time-log.component.html',
  styleUrls: ['./time-log.component.css']
})
export class TimeLogComponent implements OnInit {
  timeEntries: TimeSession[];
  displayedColumns = ['time', 'duration', 'edit'];
  date = new Date();

  constructor(
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.loadTimeEntries();
  }

  private loadTimeEntries() {
    this.timeService.getEntriesByDate(this.date).subscribe(
      next => this.timeEntries = next
    );
  }

}
