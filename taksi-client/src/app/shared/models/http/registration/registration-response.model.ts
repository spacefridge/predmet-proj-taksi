import { UserTypes } from "../../enums/usertype.enum";

export interface RegisterResponseParams {
	Id: number;
	Username: string;
	Email: string;
	Password: string;
	FirstName: string;
	LastName: string;
	Birthdate: string;
	Address: string;
	UserType: UserTypes;
	VerificationState: string;
}
