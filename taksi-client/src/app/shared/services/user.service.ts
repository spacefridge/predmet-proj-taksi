import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../env/env";
import { map, Observable } from "rxjs";
import { LoginResponse } from "../models/http/auth/login-response.model";
import { LoginParams } from "../models/http/auth/login-request.model";
import { UserTypes } from "../models/enums/usertype.enum";
import { RegisterParams } from "../models/http/registration/registration.model";
import { RegisterResponseParams } from "../models/http/registration/registration-response.model";
import { UserData } from "../models/user.model";
import { WholeUser } from "../models/whole-user.model";
import { EditUser } from "../models/edit-user.model";
import { VerificationResponse } from "../models/verification-response.model";

@Injectable({
	providedIn: "root"
})
export class UserService {
	private isAuthenticated = false;
	private userType: string | null = null;
	private apiBaseUrl: string;

	constructor(private router: Router, private http: HttpClient) {
		this.apiBaseUrl = environment.config.ApiBaseUrl;
	}

	// Username: string;
	// Email: string;
	// Password: string;
	// FirstName: string;
	// LastName: string;
	// Birthdate: string;
	// Address: string;
	// UserType: UserTypes;

	register(
		username: string,
		email: string,
		password: string,
		firstname: string,
		lastname: string,
		birthdate: string,
		address: string,
		usertype: UserTypes
	): Observable<RegisterResponseParams> {
		const url = "https://localhost:7172/api/users";

		const params: RegisterParams = {
			Username: username,
			Email: email,
			Password: password,
			FirstName: firstname,
			LastName: lastname,
			Birthdate: birthdate,
			Address: address,
			UserType: this.idFromValue(usertype)
		};

		return this.http.post<RegisterResponseParams>(url, params).pipe(
			map((data: RegisterResponseParams) => {
				const userData: UserData = {
					Id: data.Id,
					UserType: data.UserType,
					VerificationState: data.VerificationState
				};
				// localStorage.setItem("userData", JSON.stringify(userData));
				// this.isAuthenticated = true;
				return data;
			})
		);
	}

	idFromValue(value: string): number {
		if (value == "Admin") return 0;
		else if (value == "Driver") return 1;
		else return 2;
	}

	//getUserById()
	//editUser
	getUserById(id: number): Observable<WholeUser> {
		const url = `https://localhost:7172/api/users/${id}`;
		return this.http.get<WholeUser>(url, {});
	}
	editUser(id: number, params: EditUser): Observable<WholeUser> {
		const url = `https://localhost:7172/api/users/${id}`;
		return this.http.put<WholeUser>(url, params);
	}
	getUsers(): Observable<WholeUser[]> {
		const url = `https://localhost:7172/api/users`;
		return this.http.get<WholeUser[]>(url, {});
	}

	verification(id: number, verificationState: number): Observable<VerificationResponse> {
		const url = `https://localhost:7172/api/users/verify/${id}`;
		return this.http.post<VerificationResponse>(url, { verificationState });
	}
}
