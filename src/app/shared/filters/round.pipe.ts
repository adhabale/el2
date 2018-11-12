import { Pipe, PipeTransform } from "@angular/core";
import { isNumeric } from "rxjs/util/isNumeric";

@Pipe({ name: 'round' })

export class RoundPipe implements PipeTransform {
    transform(value: any): any {

        if (isNumeric(value))
            return Math.round(value);

        return value;
    }
}