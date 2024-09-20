import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../environment/environment ";
import { Observable, of } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class RoleService {
	private isAuthenticated = false;

	userType: number = -1;
	token: string = "";
	verificationStatee: number = -1;

	test$: Observable<any>;

	constructor(private router: Router, private http: HttpClient) {
		this.test$ = of(sessionStorage.getItem("userData"));
		//this.apiBaseUrl = environment.config.ApiBaseUrl;
		let storedUser = sessionStorage.getItem("userData");
		this.userType = storedUser ? JSON.parse(storedUser).userType : null;
		this.token = storedUser ? JSON.parse(storedUser).token : null;
		this.verificationStatee = storedUser ? JSON.parse(storedUser).verificationStatee : null;
	}

	checkAdmin(): boolean {
		let storedUser = sessionStorage.getItem("userData");
		this.userType = storedUser ? JSON.parse(storedUser).userType : null;
		return this.userType == 0 ? true : false;
	}
	checkUser(): boolean {
		let storedUser = sessionStorage.getItem("userData");
		this.userType = storedUser ? JSON.parse(storedUser).userType : null;
		return this.userType == 2 ? true : false;
	}
	checkDriver(): boolean {
		let storedUser = sessionStorage.getItem("userData");
		this.userType = storedUser ? JSON.parse(storedUser).userType : null;
		return this.userType == 1 ? true : false;
	}
	isLogged(): boolean {
		let storedUser = sessionStorage.getItem("userData");
		this.token = storedUser ? JSON.parse(storedUser).token : null;
		return this.token != null ? true : false;
	}
	isVerified(): boolean {
		let storedUser = sessionStorage.getItem("userData");
		this.verificationStatee = storedUser ? JSON.parse(storedUser).verificationStatee : null;
		return this.verificationStatee !== 0 && this.verificationStatee !== 1 ? true : false;
	}
}
