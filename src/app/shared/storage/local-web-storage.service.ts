import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { ExpiredUnit } from 'angular-web-storage/src/util';

@Injectable()
export class LocalWebStorageService {
    TemplateName: string;
    flagModified :boolean;
    constructor(private localStorage: LocalStorageService) {
    }

    get<T>(key: string): T {
        return this.localStorage.get(key);
    }

    set(key: string, value: any, expired: number = 0, expiredUnit: ExpiredUnit = "s") {
        this.localStorage.set(key, value, expired, expiredUnit);
    }
    setTemplateName(value) {
        this.TemplateName = value;
    }
    getTemplateName() {
        return this.TemplateName;
    }
    setModifiedflag(value){
        this.flagModified = value;
    }
    getModifiedFlag(){
        return this.flagModified;
    }
    remove(key: string) {
        this.localStorage.remove(key);
    }

    clear() {
        this.localStorage.clear();
    }
}