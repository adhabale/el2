import { Component } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})

export class LoaderComponent {

    showLoading: boolean;

    constructor(private loaderService: LoaderService) {
        loaderService.showLoaderEvent.subscribe(value => this.showLoader(value));
    }

    showLoader(value: boolean) {
        this.showLoading = value;
    }
}