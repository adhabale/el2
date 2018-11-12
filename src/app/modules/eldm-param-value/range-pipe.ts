import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'range'
})
export class RangePipe implements PipeTransform {
    transform(item: string, param: any, type: any): string {
        var val = "";
        switch (param) {
            case 1:
                if (type == 'category')
                    val = (item.substr(0, item.indexOf('.')))
                else
                    val = (item.substr(item.indexOf('.') + 1, item.length))
                break;
            case 2:
                break;
            case 3:
                if (type == 'category')
                    val = (item.substr(0, item.indexOf('<') > -1 ? item.indexOf('<') : item.indexOf('>')));
                else
                    val = (item.substr(item.indexOf('<') > -1 ? item.indexOf('<') : item.indexOf('>'), item.length));
                break;
            default:
                break;
        }
        return val;
    }
}