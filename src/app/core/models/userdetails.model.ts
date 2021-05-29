import { IPhoto } from '../../shared/models/photo.model';

export class UserDetails {
    _id?: string;
    userId: string;
    permissions: string[];
    email: string;
    fullName: string;
    preferences: any;
    lastLoggedOn: Date;
    isLoggedIn: boolean;
    agreeTerms: boolean;
    password?: string;
    photo?: IPhoto;
}
