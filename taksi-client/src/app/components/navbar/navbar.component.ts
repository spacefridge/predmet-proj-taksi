import { Component, OnInit } from "@angular/core";
import { RoleService } from "../../shared/services/role.service";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { RideNotificationService } from "../../shared/services/ride-notification.service";
import { take } from "rxjs";

@Component({
	selector: "app-navbar",
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.scss"
})
export class NavbarComponent implements OnInit {
	countdown: number = -1;
	constructor(
		public roleService: RoleService,
		private router: Router,
		private rideNotificationService: RideNotificationService
	) {}

	ngOnInit(): void {
		this.roleService.test$.subscribe(() => {
			this.roleService.checkAdmin();
			this.roleService.checkDriver();
			this.roleService.checkUser();
			this.roleService.isLogged();
			this.roleService.isVerified();
		});
		this.rideNotificationService.countdown$.subscribe(time => {
			this.countdown = time;
		});
		// this.rideNotificationService.countdown$.pipe(take(1)).subscribe(userData => {
	}
}
