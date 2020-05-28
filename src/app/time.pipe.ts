import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, includeSeconds?: boolean): string {
    const hours = `${Math.floor(value / 3600)}`.padStart(2, '0');
    const min = `${Math.floor(value / 60) % 60}`.padStart(2, '0');
    if (includeSeconds) {
      const sec = `${Math.floor(value % 60)}`.padStart(2, '0');
      return `${hours}:${min}:${sec}`;
    }
    return `${hours}:${min}`;
  }

}
