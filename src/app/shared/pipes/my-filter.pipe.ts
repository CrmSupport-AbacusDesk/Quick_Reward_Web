import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})

export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {

        if (!items || !filter.search) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out

        if (filter.src === 'schemeState') {
            return items.filter(item => item.state_name.toUpperCase().indexOf(filter.search.toUpperCase()) !== -1);
        }

    }
}
