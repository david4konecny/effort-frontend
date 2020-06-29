import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TimeService } from 'src/app/time/service/time.service';
import { StatsService } from '../service/stats.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-week-stats',
  templateUrl: './week-stats.component.html',
  styleUrls: ['./week-stats.component.css']
})
export class WeekStatsComponent implements OnInit {
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
    this.loadGraphData(start, end);
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

  private loadGraphData(startDate: string, endDate: string) {
    this.statsService.getDurationsForDaysInPeriod(startDate, endDate).subscribe(
      next => {
        this.dayTotals = next.map(it => it.total);
        this.drawChart();
      }
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
              callback: (value) => this.timeService.secondsOfDayToString(value),
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
            label: (tooltipItem) => this.timeService.secondsOfDayToString(tooltipItem.yLabel)
          }
        },
        legend: {
          display: false
        }
      }
    });
  }

}
