import { Pipe } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { isNumeric } from "rxjs/util/isNumeric";

@Pipe({ name: 'number' })

export class NumberPipe extends DecimalPipe {

    transform(value: any): any {

        if (isNumeric(value))
            return super.transform(value);

        return value;
    }
}