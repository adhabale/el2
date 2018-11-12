export class UpdateIndexFile{
    id:string;
    year:number;
    index:number; 
    factor:number;
    isUpdated:boolean;
    constructor(year,index) {
        this.year=year;
        this.index=index;
        this.factor=0;
        this.isUpdated=false;
    }
}


export class SaveComment{
Disclaimer:string;

constructor(disc){
this.Disclaimer=disc
}
}
