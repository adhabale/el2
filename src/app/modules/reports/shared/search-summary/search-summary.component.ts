import { Component, Input } from '@angular/core';
import { SearchCriteria, SelectedSearchCriteria } from '../../../search/entities/search-criteria';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';

@Component({
    selector: 'search-summary',
    templateUrl: './search-summary.component.html',
    styleUrls: ['./search-summary.component.css']
})

export class SearchSummaryComponent {

    searchCriteria: SearchCriteria = new SearchCriteria();

    constructor(private localWebStorage: LocalWebStorageService) {
        this.getSearchSummary();
    }

    getSearchSummary() {

        let selectedSearchCriteria = this.localWebStorage.get<SelectedSearchCriteria>("searchCriteria");

        if (selectedSearchCriteria)
            this.searchCriteria.selectedSearchCriteria = selectedSearchCriteria;
    }
}