export class Country {
    id: number;
    alpha2Code: string;
    alpha3Code: string;
    numericCode: string;
    displayName: string;
    lastUpdateTime: string;

    constructor(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }
}