import { Injectable } from '@angular/core';
import { ConfigurationService } from '../shared/configuration/configuration.service';

@Injectable()
export class StartupService {

    constructor(private _configurationService: ConfigurationService) {
    }

    load() {
        return this._configurationService.getConfigurations();
    }
}
