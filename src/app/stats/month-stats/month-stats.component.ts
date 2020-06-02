import { Component, OnInit } from '@angular/core';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-month-stats',
  templateUrl: './month-stats.component.html',
  styleUrls: ['./month-stats.component.css']
})
export class MonthStatsComponent implements OnInit {
  year: number;
  month: number;
  date = new Date();

  constructor() { }

  ngOnInit(): void {
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;
  }

  setDate() {
    this.date = new Date();
    this.date.setMonth(this.month - 1);
    this.date.setFullYear(this.year);
  }

  onPreviousPeriodClick() {
    this.setPreviousMonth();
    this.setDate();
  }

  onNextPeriodClick() {
    this.setNextMonth();
    this.setDate();
  }

  onMonthSelected(change: Date, picker: MatDatepicker<Date>) {
    this.year = change.getFullYear();
    this.month = change.getMonth() + 1;
    this.setDate();
    picker.close();
  }

  setPreviousMonth() {
    if (this.month === 1) {
      this.year--;
      this.month = 12;
    } else {
      this.month--;
    }
  }

  setNextMonth() {
    if (this.month === 12) {
      this.year++;
      this.month = 1;
    } else {
      this.month++;
    }
  }

}
