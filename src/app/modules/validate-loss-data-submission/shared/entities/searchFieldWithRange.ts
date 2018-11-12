export class SearchFieldWithRange {
    id: any;
    displayName: string;
    ranges: string;

    constructor(id: number, displayName: string, ranges: string) {
        this.id = id;
        this.displayName = displayName;
        this.ranges = ranges;
    }
}
