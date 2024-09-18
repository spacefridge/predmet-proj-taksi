import { Component } from "@angular/core";
import { EditComponent } from "../edit/edit.component";
import { VerificationComponent } from "../verification/verification.component";

@Component({
	selector: "app-admin",
	standalone: true,
	imports: [EditComponent, VerificationComponent],
	templateUrl: "./admin.component.html",
	styleUrl: "./admin.component.scss"
})
export class AdminComponent {}
