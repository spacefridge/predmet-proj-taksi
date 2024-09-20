import { CommonModule } from "@angular/common";
import { Component, NgModule, OnInit } from "@angular/core";
import { RideNotificationService } from "../../shared/services/ride-notification.service";
import { PipesModule } from "../../pipes/pipes.module";
import { RideService } from "../../shared/services/ride.service";
import { skip, take } from "rxjs";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../shared/services/user.service";

@Component({
	selector: "app-ridetimer",
	standalone: true,
	imports: [CommonModule, PipesModule, FormsModule],
	templateUrl: "./ridetimer.component.html",
	styleUrl: "./ridetimer.component.scss"
})
export class RidetimerComponent implements OnInit {
	countdown: number = -1;
	rideCountdown: number = -1;
	rideId: number = -1;
	wait: number | null = -1;
	rideTime: number = -1;
	domSwitch: boolean = false;
	currentUser: number = -1;
	driverRating: number = -1;
	ratingMessage: string = "";
	driverId: number = -1;
	first: boolean = true;

	constructor(
		private rideNotificationService: RideNotificationService,
		private rideService: RideService,
		private router: Router,
		private userService: UserService
	) {
		const storedUser = sessionStorage.getItem("activeRideId");
		const storedWait = sessionStorage.getItem("waitTime");
		const storedRide = sessionStorage.getItem("rideDuration");
		const storeDriverId = sessionStorage.getItem("driverId");
		this.rideId = storedUser ? JSON.parse(storedUser) : null;
		this.driverId = storeDriverId ? JSON.parse(storeDriverId) : -22;
		console.log(this.rideId);
		this.rideNotificationService.joinRideGroup(this.rideId);
		//this.rideNotificationService.addStartCountdownListener();
		this.rideNotificationService.addStartCountdownUpdateListener();
		this.wait = storedWait ? JSON.parse(storedWait) : null;
		this.rideTime = storedRide ? JSON.parse(storedRide) : null;

		this.rideNotificationService.hubConnection
			.invoke("StartRideCountdown", this.rideId, this.wait, this.rideTime, 1)
			.then(() => {
				console.log("Should countdown.");
			})
			.catch(err => console.error(err));
	}

	ngOnInit(): void {
		const storedUser = sessionStorage.getItem("userData");
		this.currentUser = storedUser ? JSON.parse(storedUser).userType : null;
		this.rideNotificationService.countdown$.pipe(skip(1)).subscribe(time => {
			this.countdown = time;
			//ako ovo ode ispod nule opet instanciraj timer i promeni dom
			//
			console.log(this.countdown);
			if (this.countdown == 0 && this.currentUser == 2 && this.first == true) {
				this.first = false;
				const storedUser = sessionStorage.getItem("activeRideId");
				const pls = storedUser ? JSON.parse(storedUser) : null;
				this.rideService
					.UpdateRideStatus(pls, 2)
					.pipe(take(1))
					.subscribe({
						next: data => {
							console.log("ride updated" + data);
						},
						error: () => {}
					});
				this.domSwitch = true;
			}
			if (this.countdown == 0 && this.currentUser == 1) {
				this.router.navigate(["/history"]);
			}
		}); //unsub after routing
	}
	submitRating() {
		this.userService.ChangeRating(this.driverRating, this.driverId).subscribe({
			next: () => {
				console.log("updated");
			},
			error: () => {
				console.log("failed to rate");
			}
		});
		if (this.driverRating >= 1 && this.driverRating <= 5) {
			this.ratingMessage = `You rated the driver ${this.driverRating} stars.`;
			// You can send the rating to the backend here
		} else {
			this.ratingMessage = "Please enter a rating between 1 and 5.";
		}
	}
}
