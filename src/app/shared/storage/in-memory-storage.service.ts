import { Injectable } from '@angular/core';

@Injectable()
export class InMemoryStorageService {

  private _keyVault: object;

  constructor() {
    this._keyVault = {};
  }

  getItem(key: string) {
    return this._keyVault[key];
  }

  setItem(key: string, value: any) {
    this._keyVault[key] = value;
  }

  clear() {
    this._keyVault = {};
  }

}
