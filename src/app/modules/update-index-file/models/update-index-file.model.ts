import { Observable } from "rxjs/Rx";
import { UpdateIndexFile, SaveComment } from "../entity/update-index-file";
import { UpdateIndexFileService } from "../services/update-index-file.service";

export class UpdateIndexFileModel {
    constructor(private updateIndexFileService: UpdateIndexFileService) {

    }

    getUpdateIndexFile(): Observable<UpdateIndexFile> {
        return this.updateIndexFileService.getUpdateIndexFile();
    }

    getComment(): Observable<SaveComment> {
        return this.updateIndexFileService.getComment();
    }

    saveIndex(body: UpdateIndexFile): any {
        return this.updateIndexFileService.saveIndex(body);

    }


    updateIndices(id: string, updateIndexFile: UpdateIndexFile): Observable<boolean> {
        return this.updateIndexFileService.updateIndices(id, updateIndexFile);

    }

    exportPDF(reportContent,reportTitle,reportText):Observable<any>{
        return this.updateIndexFileService.exportPDF(reportContent,reportTitle,reportText);

    }

    saveComment(body: SaveComment): any {
        return this.updateIndexFileService.saveComment(body);

    }
}