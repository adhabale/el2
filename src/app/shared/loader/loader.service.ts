import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LoaderService {

    showLoaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    public show() {
        this.showLoaderEvent.emit(true);
    }

    public hide() {
        this.showLoaderEvent.emit(false);
    }
}
