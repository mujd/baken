import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {
  /* transform(value: any, args?: any): any {
    return null;
  } */
  // adding a default format in case you don't want to pass the format
  // then 'yyyy-MM-dd' will be used
  /* transform(
    date: Date | string,
    fecha: number,
    format: string = 'yyyy-MM-dd'
  ): string {
    fecha: moment.isMoment = moment(date);
    this.fechaCreacion = fecha.toISOString().split('T')[0];
  } */
  transform(date: Date, fecha: moment.Moment): any {
    fecha = moment(date);
    return fecha.toISOString().split('T')[0];
  }
}
