export class SearchFieldWithType {
    id: number;
    displayName: string;
    type: string;

    constructor(id: number, displayName: string, type: string) {
        this.id = id;
        this.displayName = displayName;
        this.type = type;
    }
}