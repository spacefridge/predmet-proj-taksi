import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RideService } from "../../shared/services/ride.service";
import { RideRequest } from "../../shared/models/rides/ride-request.model";
import { RideNotificationService } from "../../shared/services/ride-notification.service";
import { Router, RouterModule } from "@angular/router";

@Component({
	selector: "app-newrideuser",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: "./newrideuser.component.html",
	styleUrl: "./newrideuser.component.scss"
})
export class NewrideuserComponent implements OnInit {
	rideForm: FormGroup;
	waitTime: number | null = null;
	price: number | null = null;
	rideConfirmed: boolean = false;
	currentUser: number = -1;

	currentUserType: number = -1;

	constructor(
		private fb: FormBuilder,
		private rideService: RideService,
		private rideNotificationService: RideNotificationService,
		private router: Router
	) {
		this.rideForm = this.fb.group({
			startAddress: ["", Validators.required],
			endAddress: ["", Validators.required]
		});
	}
	ngOnInit(): void {
		const storedUser = sessionStorage.getItem("userData");
		this.currentUserType = storedUser ? JSON.parse(storedUser).userType : null;
		if (this.currentUserType == 2) {
			this.rideNotificationService.startConnection();

			this.rideNotificationService.onRideAccepted(ride => {
				console.log("Your ride has been accepted:", ride);
				sessionStorage.setItem("activeRideId", JSON.stringify(ride.id));
				sessionStorage.setItem("waitTime", JSON.stringify(ride.waitTime));
				sessionStorage.setItem("rideDuration", JSON.stringify(ride.rideDuration));
				sessionStorage.setItem("driverId", JSON.stringify(ride.driverId));
				this.router.navigate(["/ridetimer"]);
			});
		}
	}

	calculateRide() {
		if (this.rideForm.valid) {
			// Randomly calculate wait time (between 5 to 15 minutes) and price (between 20 to 100 currency units)
			this.waitTime = Math.floor(Math.random() * 1) + 1; // 5 to 15 min
			this.price = Math.floor(Math.random() * 100) + 320; // 20 to 100 currency units
			this.rideConfirmed = false; // Reset the confirmation state
		}
	}

	confirmRide() {
		const storedUser = sessionStorage.getItem("userData");
		const connectionId = sessionStorage.getItem("connectionId");
		this.currentUser = storedUser ? JSON.parse(storedUser).id : null;

		const params: RideRequest = {
			startAddress: this.rideForm.get("startAddress")?.value,
			endAddress: this.rideForm.get("endAddress")?.value,
			userId: this.currentUser,
			price: this.price,
			waitTime: this.waitTime,
			connectionId: connectionId
		};
		console.log(params);
		this.rideService.request(params).subscribe({
			next: data => {
				console.log(data);
			},
			error: () => {
				console.log("req failed");
			}
		});
		this.rideConfirmed = true;
		console.log("Ride confirmed!");
		// Call the backend service here if needed to book the ride
	}
}
