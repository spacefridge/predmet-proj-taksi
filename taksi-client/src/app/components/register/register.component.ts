import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserTypes } from "../../shared/models/enums/usertype.enum";
import { CommonModule } from "@angular/common";
import { UserService } from "../../shared/services/user.service";
import { first } from "rxjs";
import { Router, RouterModule } from "@angular/router";
import { UserType } from "../../shared/pipes/user-type.pipe";

@Component({
	selector: "app-register",
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, RouterModule],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.scss"
})
export class RegisterComponent implements OnInit {
	userTypes = Object.values(UserTypes);
	registerForm!: FormGroup;
	submitted = false;

	constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

	ngOnInit(): void {
		this.registerForm = this.formBuilder.group(
			{
				username: ["", Validators.required],
				email: ["", [Validators.required, Validators.email]],
				password: ["", [Validators.required, Validators.minLength(6)]],
				confirmPassword: ["", Validators.required],
				name: [""],
				surname: [""],
				dob: [""],
				address: [""],
				userType: ["", Validators.required]
			},
			{
				validator: this.mustMatch("password", "confirmPassword")
			}
		);
	}

	// Custom validator to check that passwords match
	mustMatch(controlName: string, matchingControlName: string) {
		return (formGroup: FormGroup) => {
			const control = formGroup.controls[controlName];
			const matchingControl = formGroup.controls[matchingControlName];

			if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
				return;
			}

			if (control.value !== matchingControl.value) {
				matchingControl.setErrors({ mustMatch: true });
			} else {
				matchingControl.setErrors(null);
			}
		};
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.registerForm.invalid) {
			console.log("here");
			return;
		}

		// this.registerForm[username].value username, email,password,name, surname,dob,address,userType
		// this.registerForm.get('')?.value

		this.userService
			.register(
				this.registerForm.get("username")?.value,
				this.registerForm.get("email")?.value,
				this.registerForm.get("password")?.value,
				this.registerForm.get("name")?.value,
				this.registerForm.get("surname")?.value,
				this.registerForm.get("dob")?.value,
				this.registerForm.get("address")?.value,
				this.registerForm.get("userType")?.value
			)
			.pipe(first())
			.subscribe({
				next: () => {
					this.router.navigate(["/login"]);
				},
				error: () => {}
			});

		// Process the form data here (e.g., send to server)
		console.log("Form submitted", this.registerForm.value);
	}
}
