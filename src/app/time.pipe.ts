import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number, includeSeconds?: boolean, withLetters?: boolean): string {
    let hours = withLetters ? `${Math.floor(value / 3600)}` : `${Math.floor(value / 3600)}`.padStart(2, '0');
    const min = `${Math.floor(value / 60) % 60}`.padStart(2, '0');
    if (includeSeconds) {
      const sec = `${Math.floor(value % 60)}`.padStart(2, '0');
      return withLetters ? `${hours}h ${min}m ${sec}s` : `${hours}:${min}:${sec}`;
    }
    return withLetters ? `${hours}h ${min}m` : `${hours}:${min}`;
  }

}
