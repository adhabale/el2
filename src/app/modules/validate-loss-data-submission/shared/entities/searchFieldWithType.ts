export class SearchFieldWithType {
    id: number;
    displayName: string;
    type: string;
    typeId: number;

    constructor(id: number, displayName: string, type: string, typeId: number) {
        this.id = id;
        this.displayName = displayName;
        this.type = type;
        this.typeId = typeId;
    }
}