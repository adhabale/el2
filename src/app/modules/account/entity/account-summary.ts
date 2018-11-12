import { Party } from "./party";

export class AccountSummary {
    accountId:string;    
    subscriptionId:string;
    subscriptionName:string;
    primaryParty: Party;
    associatedParties: Party[];
}