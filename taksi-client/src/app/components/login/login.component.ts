import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../shared/services/authorization.service";
import { CommonModule } from "@angular/common";
import { first, skip } from "rxjs";
import { LoginResponse } from "../../shared/models/http/auth/login-response.model";
import { RoleService } from "../../shared/services/role.service";
import { RideService } from "../../shared/services/ride.service";
import { RideWithId } from "../../shared/models/rides/ride-with-id.model";
import { RideNotificationService } from "../../shared/services/ride-notification.service";

@Component({
	selector: "app-login",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.scss"
})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	loading = false;
	errorMessage: string | null = null;
	submitted: boolean = false;
	user: LoginResponse | null = null;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private role: RoleService,
		private rideService: RideService,
		private rideNotificationService: RideNotificationService
	) {
		sessionStorage.removeItem("userData");
	}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			username: ["", Validators.required],
			password: ["", Validators.required]
		});
		//JUMP:
		//this.rideNotificationService.startConnection();
	}

	// Getter for form controls
	get f() {
		return this.loginForm.controls;
	}

	onLogin() {
		// Stop if the form is invalid
		if (this.loginForm.invalid) {
			return;
		}
		this.submitted = true;
		this.loading = true;

		const username = this.f["username"].value;
		const password = this.f["password"].value;

		this.authService
			.login(username, password)
			.pipe(first())
			.subscribe({
				next: data => {
					this.user = data;
					sessionStorage.setItem("userData", JSON.stringify(this.user));
					//proveri kosam, onda pokupi njegove voznje i pregledaj da li neki ima status da jos traje.
					//ako ima odma tamo i vidi what happens
					if (this.user.userType == 1) {
						this.rideService.getAllRidesDriver(this.user.id).subscribe({
							next: data => {
								if (data.find(x => x.rideState == 1)) {
									let temp = data.find(x => x.rideState == 1);

									if (temp) {
										sessionStorage.setItem("activeRideId", JSON.stringify(temp.id));
										this.router.navigate(["/ridetimer"]);
									}
								} else {
									this.router.navigate(["/dashboard"]);
								}
								this.loading = false;
							},
							error: () => {
								this.loading = false;
								console.log("error fetching data");
							}
						});
					} else if (this.user.userType == 2) {
						this.rideService.getAllRidesUser(this.user.id).subscribe({
							next: data => {
								if (data.find(x => x.rideState == 1)) {
									let temp = data.find(x => x.rideState == 1);
									if (temp) {
										sessionStorage.setItem("activeRideId", JSON.stringify(temp.id));
										this.router.navigate(["/ridetimer"]);
									}
								} else {
									this.router.navigate(["/dashboard"]);
								}
								this.loading = false;
							},
							error: () => {
								this.loading = false;
								console.log("error fetching data");
							}
						});
					} else {
						this.loading = false;
						this.router.navigate(["/dashboard"]);
					}

					console.log(this.user.userType);
					this.loading = false;
				},
				error: () => {
					this.loading = false;
				}
			});

		// console.log(username, password);
		// if (isAuthenticated) {
		// 	// Redirect based on user role (handled inside AuthService)
		// 	const userType = this.authService.getUserType();
		// 	if (userType === "admin") {
		// 		this.router.navigate(["/admin"]);
		// 	} else {
		// 		this.router.navigate(["/dashboard"]);
		// 	}
		// } else {
		// 	this.errorMessage = "Invalid username or password";
		// 	this.loading = false;
		// }
	}
}
