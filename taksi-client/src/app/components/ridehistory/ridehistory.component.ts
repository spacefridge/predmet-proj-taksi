import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Ride } from "../../shared/models/rides/ride.model";
import { RideService } from "../../shared/services/ride.service";
import { RideWithId } from "../../shared/models/rides/ride-with-id.model";

@Component({
	selector: "app-ridehistory",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./ridehistory.component.html",
	styleUrl: "./ridehistory.component.scss"
})
export class RidehistoryComponent implements OnInit {
	rides: RideWithId[] = [];
	currentUserType: number = -1;
	currentUserId: number = -1;
	constructor(private rideService: RideService) {
		const storedUser = sessionStorage.getItem("userData");
		this.currentUserType = storedUser ? JSON.parse(storedUser).userType : null;
		this.currentUserId = storedUser ? JSON.parse(storedUser).id : null;
	}

	ngOnInit(): void {
		// this.rideService.UpdateRideStatus(5, 2).subscribe({
		// 	next: () => {
		// 		console.log("ride updated");
		// 	},
		// 	error: () => {}
		// });
		if (this.currentUserType == 0) {
			this.rideService.getAllRides().subscribe({
				next: data => {
					this.rides = data;
				},
				error: () => {
					console.log("error fetching data");
				}
			});
		} else if (this.currentUserType == 1) {
			this.rideService.getAllRidesDriver(this.currentUserId).subscribe({
				next: data => {
					this.rides = data;
				},
				error: () => {
					console.log("error fetching data");
				}
			});
		} else {
			this.rideService.getAllRidesUser(this.currentUserId).subscribe({
				next: data => {
					this.rides = data;
					console.log(data);
					console.log(this.rides);
				},
				error: () => {
					console.log("error fetching data");
				}
			});
		}
	}
}
