import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { StatsService } from '../service/stats.service';
import {Subscription} from 'rxjs';
import {DateTotal} from '../../time/date-total';
import { Chart } from 'chart.js';
import { TimeService } from '../../time/service/time.service';
import { TimeUtil } from 'src/app/time/time-util';

@Component({
  selector: 'app-month-stats',
  templateUrl: './month-stats.component.html',
  styleUrls: ['./month-stats.component.css']
})
export class MonthStatsComponent implements OnInit, OnDestroy {
  labels = new Array<string>();
  data = new Array<number>();
  year: number;
  month: number;
  date = new Date();
  startDate: Date;
  endDate: Date;
  totalTime = 0;
  finishedTasks = 0;
  totalTasks = 0;
  averageRating = 0.0;
  @ViewChild('chart')
  canvas: ElementRef;
  chart: Chart;
  private dataChangedSub: Subscription;

  constructor(
    private statsService: StatsService,
    private timeService: TimeService
  ) { }

  ngOnInit(): void {
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1;
    this.startDate = new Date(this.year, this.month - 1, 1);
    this.endDate = new Date(this.year, this.month, 0);
    this.loadData();
    this.reloadDataOnChange();
  }

  private loadData() {
    this.loadChartData();
    this.loadStatsData();
  }

  private loadChartData() {
    this.statsService.getDurationsForDaysInMonth(this.year, this.month).subscribe(
      next => {
        this.setDataset(next);
        this.drawChart();
      }
    );
  }

  private loadStatsData() {
    this.statsService.getStatsForPeriod(
      TimeUtil.toDateString(this.startDate), TimeUtil.toDateString(this.endDate)
    ).subscribe(
    next => {
      this.totalTime = next.totalTime;
      this.finishedTasks = next.tasks.finished;
      this.totalTasks = next.tasks.count;
      this.averageRating = next.averageRating ? next.averageRating.toFixed(2) : null;
    }
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
    this.startDate = new Date(this.year, this.month - 1, 1);
    this.endDate = new Date(this.year, this.month, 0);
  }

  onPreviousPeriodClick() {
    this.setPreviousMonth();
    this.setDate();
    this.loadData();
  }

  onNextPeriodClick() {
    this.setNextMonth();
    this.setDate();
    this.loadData();
  }

  onMonthSelected(change: Date, picker: MatDatepicker<Date>) {
    picker.close();
    this.year = change.getFullYear();
    this.month = change.getMonth() + 1;
    this.setDate();
    this.loadData();
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

  private reloadDataOnChange() {
    this.dataChangedSub = this.timeService.entrySavedEvent.subscribe(
      _ => this.loadData()
    )
  }

  private drawChart() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          borderWidth: 1,
          backgroundColor: '#80CBC4',
          borderColor: '#009688',
          hoverBackgroundColor: '#009688'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'total time'
            },
            ticks: {
              callback: (value) => TimeUtil.secondsOfDayToString(value),
              min: 0
            },
            gridLines: {
              drawOnChartArea: false
            }
          }],
          xAxes: [{
            ticks: {
              callback: (value, index) => index + 1
            },
            gridLines: {
              drawOnChartArea: false
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem) => TimeUtil.secondsOfDayToStringWithLetters(tooltipItem.yLabel)
          },
          displayColors: false
        },
        legend: {
          display: false
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.dataChangedSub) {
      this.dataChangedSub.unsubscribe();
    }
  }

}
