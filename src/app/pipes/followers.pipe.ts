import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'followers'
})
export class FollowersPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value >= 1000000) {
      const millionValue = (value / 1000000).toFixed(1);
      return `${millionValue}M`;
    } else if (value >= 1000) {
      const thousandValue = (value / 1000).toFixed(1);
      return `${thousandValue}k`;
    } else {
      return value.toString();
    }
  }

}
