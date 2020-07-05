import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TimeService } from 'src/app/time/service/time.service';
import { StatsService } from '../service/stats.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { TimeUtil } from 'src/app/time/time-util';

@Component({
  selector: 'app-week-stats',
  templateUrl: './week-stats.component.html',
  styleUrls: ['./week-stats.component.css']
})
export class WeekStatsComponent implements OnInit, OnDestroy {
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  dayTotals = new Array<number>();
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
    this.setDates(new Date());
    this.loadData();
    this.reloadDataOnChange();
  }

  private setDates(newDate: Date) {
    this.date = newDate;
    let dayOfWeek: number;
    if (this.date.getDay() === 0) {
      dayOfWeek = 6;
    } else {
      dayOfWeek = this.date.getDay() - 1;
    }
    this.startDate = TimeUtil.subtractDays(this.date, dayOfWeek);
    this.endDate = TimeUtil.addDays(this.date, 6 - dayOfWeek);
  }

  onDateChanged(change: MatDatepickerInputEvent<Date>) {
    this.setDates(change.value);
    this.loadData();
  }

  onPreviousPeriodClick() {
    this.setDates(TimeUtil.subtractDays(this.date, 7));
    this.loadData();
  }

  onNextPeriodClick() {
    this.setDates(TimeUtil.addDays(this.date, 7));
    this.loadData();
  }

  private loadData() {
    const start = TimeUtil.toDateString(this.startDate);
    const end = TimeUtil.toDateString(this.endDate);
    this.loadChartData(start, end);
    this.loadStatsData(start, end);
  }

  private loadChartData(startDate: string, endDate: string) {
    this.statsService.getDurationsForDaysInPeriod(startDate, endDate).subscribe(
      next => {
        this.dayTotals = next.map(it => it.total);
        this.drawChart();
      }
    )
  }

  private loadStatsData(startDate: string, endDate: string) {
    this.statsService.getStatsForPeriod(startDate, endDate).subscribe(
      next => {
        this.totalTime = next.totalTime;
        this.finishedTasks = next.tasks.finished;
        this.totalTasks = next.tasks.count;
        this.averageRating = next.averageRating ? next.averageRating.toFixed(2) : null;
      }
    );
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
          data: this.dayTotals,
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
