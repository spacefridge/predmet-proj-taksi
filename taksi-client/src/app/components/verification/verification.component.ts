import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { UserService } from "../../shared/services/user.service";
import { WholeUser } from "../../shared/models/whole-user.model";
import { VerificationStatus } from "../../shared/pipes/verification-status.pipe";
import { PipesModule } from "../../pipes/pipes.module";

@Component({
	selector: "app-verification",
	standalone: true,
	imports: [PipesModule, ReactiveFormsModule, CommonModule, RouterModule],
	templateUrl: "./verification.component.html",
	styleUrl: "./verification.component.scss"
})

//JUMP: page reload or data change after succes
export class VerificationComponent implements OnInit {
	users: WholeUser[] = [];
	constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

	ngOnInit(): void {
		this.userService.getUsers().subscribe({
			next: data => {
				this.users = data;
			},
			error: () => {
				console.log("failed to fetch users");
			}
		});
	}
	accept(id: number): void {
		this.userService.verification(id, 2).subscribe({
			next: data => {
				console.log(data);
			},
			error: () => {
				console.log("failed to accept");
			}
		});
	}
	deny(id: number): void {
		this.userService.verification(id, 1).subscribe({
			next: data => {
				console.log(data);
			},
			error: () => {
				console.log("failed to deny");
			}
		});
	}
}
