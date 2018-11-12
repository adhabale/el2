import {Loss} from './loss';
import { LocationDetails } from './location';
import {IncidentInvolvement} from './incident-involvement';
export class LossData
{
location:LocationDetails; 
causeId:number;
eventId:number;
loss:Loss;
incidentInvolvement:IncidentInvolvement;
}