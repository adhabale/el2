import { Observable } from 'rxjs/Rx';
import { ReferenceDocumentService } from '../services/reference-document.service';
import { ReferenceDocument } from '../entities/reference-document';
import { setMaxListeners } from 'cluster';

export class ReferenceDocumentModel {

    constructor(private referenceDocumentService: ReferenceDocumentService) {

    }

    getAllDocuments(): Observable<ReferenceDocument[]> {
        return this.referenceDocumentService.getAllDocuments();
    }

    addDocument(document: ReferenceDocument): Observable<ReferenceDocument> {
        return this.referenceDocumentService.addDocument(document)
    }

    updateDocument(document: ReferenceDocument): Observable<boolean> {
        return this.referenceDocumentService.updateDocument(document);
    }

    deleteDocument(id: string, fileName: string): Observable<boolean> {
        return this.referenceDocumentService.deleteDocument(id, fileName);
    }

    logDeleteDocument(fileName: string, extension: string): Observable<any> {
        return this.referenceDocumentService.logDeleteDocument(fileName, extension);
    }

    getDocumentContent(filename: string): Observable<ReferenceDocument> {
        return this.referenceDocumentService.getDocumentContent(filename);
    }



}

