import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  date: Date;

  constructor() { }

  ngOnInit(): void {
    this.date = new Date();
  }

}
