import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, isInMilliseconds?: boolean): string {
    if (isInMilliseconds) {
      value = value / 1000;
    }
    const hours = `${Math.floor(value / 3600)}`.padStart(2, '0');
    const min = `${Math.floor(value / 60) % 60}`.padStart(2, '0');
    const sec = `${Math.floor(value % 60)}`.padStart(2, '0');
    return `${hours}:${min}:${sec}`;
  }

}
