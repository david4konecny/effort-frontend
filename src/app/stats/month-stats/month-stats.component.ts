import { Component, OnInit } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { StatsService } from '../../stats.service';
import {Subscription} from 'rxjs';
import {DateTotal} from '../../model/date-total';

@Component({
  selector: 'app-month-stats',
  templateUrl: './month-stats.component.html',
  styleUrls: ['./month-stats.component.css']
})
export class MonthStatsComponent implements OnInit {
  labels = new Array<string>();
  data = new Array<number>();
  year: number;
  month: number;
  date = new Date();
  sub: Subscription;

  constructor(
    private statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;
    this.reloadData();
  }

  private reloadData() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = this.statsService.getDurationsForDaysInMonth(this.year, this.month).subscribe(
      next => this.setDataset(next)
    );
  }

  private setDataset(data: DateTotal[]) {
    this.labels = [];
    this.data = [];
    data.forEach(item => {
      this.labels.push(item.date);
      this.data.push(item.total);
    });
  }

  setDate() {
    this.date = new Date();
    this.date.setMonth(this.month - 1);
    this.date.setFullYear(this.year);
  }

  onPreviousPeriodClick() {
    this.setPreviousMonth();
    this.setDate();
    this.reloadData();
  }

  onNextPeriodClick() {
    this.setNextMonth();
    this.setDate();
    this.reloadData();
  }

  onMonthSelected(change: Date, picker: MatDatepicker<Date>) {
    picker.close();
    this.year = change.getFullYear();
    this.month = change.getMonth() + 1;
    this.setDate();
    this.reloadData();
  }

  private setPreviousMonth() {
    if (this.month === 1) {
      this.year--;
      this.month = 12;
    } else {
      this.month--;
    }
  }

  private setNextMonth() {
    if (this.month === 12) {
      this.year++;
      this.month = 1;
    } else {
      this.month++;
    }
  }

}
