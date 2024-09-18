import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../env/env";
import { map, Observable } from "rxjs";
import { LoginResponse } from "../models/http/auth/login-response.model";
import { LoginParams } from "../models/http/auth/login-request.model";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	private isAuthenticated = false;
	private userType: string | null = null;
	private apiBaseUrl: string;

	constructor(private router: Router, private http: HttpClient) {
		this.apiBaseUrl = environment.config.ApiBaseUrl;
	}
	//JUMP: promeni kako gledam da li sam ulogovan lmao
	login(email: string, password: string): Observable<LoginResponse> {
		const url = "https://localhost:7172/api/users/login";

		const params: LoginParams = {
			Email: email,
			Password: password
		};

		// return this.http.post<LoginResponse>(url, params).pipe(
		// 	map((data: LoginResponse) => {
		// 		const userData: LoginResponse = {
		// 			Id: data.Id,
		// 			Token: data.Token,
		// 			UserType: data.UserType,
		// 			VerificationState: data.VerificationState
		// 		};
		// 		localStorage.setItem("userData", JSON.stringify(userData));
		// 		this.isAuthenticated = true;
		// 		return userData;
		// 	})
		// );
		this.isAuthenticated = true;
		return this.http.post<LoginResponse>(url, params);
	}

	getUserType(): string | null {
		return this.userType;
	}

	isLoggedIn(): boolean {
		return this.isAuthenticated;
	}

	logout(): void {
		this.isAuthenticated = false;
		this.userType = null;
		this.router.navigate(["/login"]);
	}
}
