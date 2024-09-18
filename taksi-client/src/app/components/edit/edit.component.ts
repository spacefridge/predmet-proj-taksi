import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { first } from "rxjs";
import { UserService } from "../../shared/services/user.service";
import { Router, RouterModule } from "@angular/router";
import { UserTypes } from "../../shared/models/enums/usertype.enum";
import { CommonModule } from "@angular/common";
import { WholeUser } from "../../shared/models/whole-user.model";
import { EditUser } from "../../shared/models/edit-user.model";

@Component({
	selector: "app-edit",
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, RouterModule],
	templateUrl: "./edit.component.html",
	styleUrl: "./edit.component.scss"
})
export class EditComponent implements OnInit {
	userTypes = Object.values(UserTypes);
	registerForm!: FormGroup;
	submitted = false;
	id: string = "";
	wholeUser: WholeUser | null = null;
	render: boolean = false;
	currentUser: number = -1;

	constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

	ngOnInit(): void {
		const storedUser = localStorage.getItem("userData");
		this.currentUser = storedUser ? JSON.parse(storedUser).id : null;

		this.userService.getUserById(this.currentUser).subscribe({
			next: data => {
				this.wholeUser = data;
				console.log(data);
				this.registerForm = this.formBuilder.group({
					username: [this.wholeUser.username, Validators.required],
					email: [this.wholeUser.email, [Validators.required, Validators.email]],
					name: [this.wholeUser.firstName],
					surname: [this.wholeUser.lastName],
					dob: [this.wholeUser.birthdate],
					address: [this.wholeUser.address]
				});
				this.render = true;
			},
			error: () => {
				console.log("failed");
			}
		});
		console.log(this.currentUser);
		// this.registerForm = this.formBuilder.group({
		// 	//username: ["", Validators.required],
		// 	email: ["", [Validators.required, Validators.email]],
		// 	name: [""],
		// 	surname: [""],
		// 	dob: [""],
		// 	address: [""]
		// });
	}

	onSubmit(): void {
		this.submitted = true;

		if (this.registerForm.invalid) {
			return;
		}
		const user: EditUser = {
			username: this.registerForm.get("username")?.value,
			email: this.registerForm.get("email")?.value,
			firstName: this.registerForm.get("name")?.value,
			lastName: this.registerForm.get("surname")?.value,
			birthdate: this.registerForm.get("dob")?.value,
			address: this.registerForm.get("address")?.value
		};

		this.userService.editUser(this.currentUser, user).subscribe({
			next: () => {
				console.log("nice");
			},
			error: () => {
				console.log("not nice");
			}
		});

		// Process the form data here (e.g., send to server)
		console.log("Form submitted", this.registerForm.value);
	}
}
