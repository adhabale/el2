export class LossAmountRange {
    id: number;
    displayName: string;
    minValue: number;
    maxValue: number;

    constructor(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }
}