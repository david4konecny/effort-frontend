import { Component, OnInit } from '@angular/core';
import { TimeService } from 'src/app/time/service/time.service';
import { StatsService } from '../service/stats.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-week-stats',
  templateUrl: './week-stats.component.html',
  styleUrls: ['./week-stats.component.css']
})
export class WeekStatsComponent implements OnInit {
  date = new Date();
  startDate: Date;
  endDate: Date;
  totalTime = 0;
  finishedTasks = 0;
  totalTasks = 0;
  averageRating = 0.0;

  constructor(
    private statsService: StatsService,
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.setDates(new Date());
    this.updateData();
  }

  private setDates(newDate: Date) {
    this.date = newDate;
    let dayOfWeek: number;
    if (this.date.getDay() === 0) {
      dayOfWeek = 6;
    } else {
      dayOfWeek = this.date.getDay() - 1;
    }
    this.startDate = this.timeService.subtractDays(this.date, dayOfWeek);
    this.endDate = this.timeService.addDays(this.date, 6 - dayOfWeek);
  }

  onDateChanged(change: MatDatepickerInputEvent<Date>) {
    this.setDates(change.value);
    this.updateData();
  }

  onPreviousPeriodClick() {
    this.setDates(this.timeService.subtractDays(this.date, 7));
    this.updateData();
  }

  onNextPeriodClick() {
    this.setDates(this.timeService.addDays(this.date, 7));
    this.updateData();
  }

  private updateData() {
    const start = this.timeService.toDateString(this.startDate);
    const end = this.timeService.toDateString(this.endDate);
    this.statsService.getStatsForPeriod(start, end).subscribe(
      next => {
        this.totalTime = next.totalTime;
        this.finishedTasks = next.tasks.finished;
        this.totalTasks = next.tasks.count;
        if (next.averageRating) {
          this.averageRating = next.averageRating.toFixed(2);
        } else {
          this.averageRating = null;
        }
      }
    );
  }

}
