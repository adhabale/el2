//Pipe used to group dropdown
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'optgroup'
})
export class OptgroupPipe implements PipeTransform {
    transform(items: any[], type: string): any[] {
        if (!items) return [];
        return items.filter(it => {
            return it.type.toLowerCase() == type.toLowerCase();
        });
    }
}