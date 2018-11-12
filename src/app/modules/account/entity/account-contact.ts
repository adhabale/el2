export class AccountContact {
    accountContactId:string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;

    setDefaultValue() {
        this.accountContactId="";
        this.name = "";
        this.companyName = "";
        this.email = "";
        this.phone = "";
        this.address = "";
        this.city = "";
        this.country = "";
    }
}