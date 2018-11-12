export class DepthCategory {
    id: number;
    depthCategoryDescription: string;
    displayName: string

    constructor(id, displayName) {
        this.id = id;
        this.displayName = displayName;
    }
}