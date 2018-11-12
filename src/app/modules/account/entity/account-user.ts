import { AccountUserInfo } from "./account-user-info";

export class AccountUser {
    id:string;
    userId: string;
    principalId: string;
    displayName: string;
    emailAddress: string;
    accountUserInfo: AccountUserInfo;
    isInternal: boolean;
    isActive: boolean = true;
    roleId: number;
    lastAcceptedDate:string;
    state:string;
    isNew:boolean;
}
