import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { ExpiredUnit } from 'angular-web-storage/src/util';

@Injectable()
export class SessionWebStorageService {

    constructor(private sessionStorage: SessionStorageService) {
    }

    get(key: string): any {
        return this.sessionStorage.get(key);
    }

    set(key: string, value: any, expired: number = 0, expiredUnit: ExpiredUnit = "s") {
        this.sessionStorage.set(key, value, expired, expiredUnit);
    }

    remove(key: string) {
        this.sessionStorage.remove(key);
    }

    clear() {
        this.sessionStorage.clear();
    }
}