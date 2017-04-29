import { Pipe, PipeTransform } from '@angular/core';
import { toHealthStatusValue } from './models/health-status';

@Pipe({
  name: 'healthStatus'
})
export class HealthStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return toHealthStatusValue(value);
  }
}
