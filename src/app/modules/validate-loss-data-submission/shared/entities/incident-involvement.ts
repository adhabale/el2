import { Exposure } from "./exposure";
import { PartyRole } from "./party-role";

export class IncidentInvolvement {
    incidentInvolvementId: number;
    incidentId: number;
    exposure: Exposure;
    adjuster: string;
    adjusterInd: PartyRole;
    source: string;
    adjusterFileRef: string;
    operationTypeId?: number;
    assuredCoVenture: string;
    productInformation?: number;
    subscriptionName: string;
    createdBy?: string;
    createdOn?: string;
}