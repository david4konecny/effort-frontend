import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const min = Math.floor(value / 60) % 60;
    const sec = Math.floor(value % 60);
    return `${hours}:${min}:${sec}`;
  }

}
