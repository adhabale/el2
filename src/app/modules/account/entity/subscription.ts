import { Party } from "./party";

export class Subscription {    
    subscriptionId: string;
    displayName: string;    
    primaryParty: Party;
    primaryRegion: string;
    defaultCurrency: string;
    description: string;
    ownerEmail: string;
    ownerUsername: string;
    associatedParties: Party[];
    allowDataShare: boolean;
}