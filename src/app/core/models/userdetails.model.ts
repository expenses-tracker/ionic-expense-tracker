export class UserDetails {
    _id?: string;
    permissions: string[];
    email: string;
    fullName: string;
    preferences: any;
    lastLoggedOn: Date;
    isLoggedIn: boolean;
    agreeTerms: boolean;
    password?: string;
}
