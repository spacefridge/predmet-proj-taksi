import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../shared/services/authorization.service";
import { CommonModule } from "@angular/common";
import { first, skip } from "rxjs";
import { LoginResponse } from "../../shared/models/http/auth/login-response.model";

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

	constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

	ngOnInit(): void {
		this.loginForm = this.formBuilder.group({
			username: ["", Validators.required],
			password: ["", Validators.required]
		});
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
					localStorage.setItem("userData", JSON.stringify(this.user));
					console.log(this.user.userType);
					switch (this.user.userType) {
						case 0:
							this.router.navigate(["/admin"]);
							break;
						case 1:
							this.router.navigate(["/driver"]);
							break;
						case 2:
							this.router.navigate(["/user"]);
							break;
						default:
							console.log("washere");
							this.router.navigate(["/login"]);
							break;
					}
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
