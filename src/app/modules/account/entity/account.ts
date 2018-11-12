import { AccountContact } from "./account-contact";

export class Account {

    accountId: string;
    customerName: string;
    accountBillingId:string;
    startDate: string;
    endDate: string;
    invoiceStatus: string;
    isNotificationSuppressed: boolean;
    subscriptionStatus: boolean;
    accountContact: AccountContact;
    subscriptionName: string;

    setDefaultValue() {

        this.accountId = "";
        this.customerName = "";
        this.subscriptionName = "";
        this.startDate = "";
        this.endDate = "";
        this.invoiceStatus = "";
        this.isNotificationSuppressed = true;
        this.subscriptionStatus = true;
        this.accountContact = new AccountContact();
        this.accountContact.setDefaultValue();
    }
}