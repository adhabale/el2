import { Observable } from 'rxjs/Rx';
import { BatchJob } from '../entity/batch-job';
import { BatchJobService } from '../services/batch-job.services';

export class BatchJobModel{

    constructor(private batchJobService: BatchJobService){}

    uploadFile(batchJob:BatchJob): Observable<boolean> {
        return this.batchJobService.postFile(batchJob);
   }
}