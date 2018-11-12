export class Summarylevel {

    columnName: string;
    displayName: string;
    groupName: string;

    constructor(groupName, columnName, displayName) {
        this.groupName = groupName;
        this.columnName = columnName;
        this.displayName = displayName;
    }
}