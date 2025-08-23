import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencywords'
})
export class CurrencywordsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
