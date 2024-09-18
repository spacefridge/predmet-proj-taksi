import { UserTypes } from "./enums/usertype.enum";

export interface UserData {
	Id: number;
	VerificationState: string;
	UserType: UserTypes;
}
