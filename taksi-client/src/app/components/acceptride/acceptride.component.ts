import { Component, OnInit } from "@angular/core";
import { RideNotificationService } from "../../shared/services/ride-notification.service";
import { CommonModule } from "@angular/common";
import { RideRequest } from "../../shared/models/rides/ride-request.model";
import { RideService } from "../../shared/services/ride.service";
import { Ride } from "../../shared/models/rides/ride.model";
import { Router, RouterModule } from "@angular/router";

@Component({
	selector: "app-acceptride",
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: "./acceptride.component.html",
	styleUrl: "./acceptride.component.scss"
})
export class AcceptrideComponent implements OnInit {
	currentUserType: number = -1;
	currentUserId: number = -1;
	//customerId: string | null = null;
	ridereqList: RideRequest[] = [];
	constructor(
		private rideNotificationService: RideNotificationService,
		private rideService: RideService,
		private router: Router
	) {}

	//USE SESSION STORAGE FOR TEMP DATA

	//rebroadcast ride id to remove from list (later)

	ngOnInit(): void {
		const storedUser = sessionStorage.getItem("userData");
		this.currentUserType = storedUser ? JSON.parse(storedUser).userType : null;
		this.currentUserId = storedUser ? JSON.parse(storedUser).id : null;

		if (this.currentUserType == 1) {
			this.rideNotificationService.startConnectionAsDriver();
			this.rideNotificationService.onRideRequest((rideRequest: RideRequest) => {
				this.ridereqList.push(rideRequest);
				console.log("New ride request from customer:", rideRequest);
			});
		}
	}

	acceptRide(rideRequest: RideRequest) {
		const ride: Ride = {
			startAddress: rideRequest.startAddress,
			endAddress: rideRequest.endAddress,
			userId: rideRequest.userId,
			driverId: this.currentUserId,
			price: rideRequest.price,
			waitTime: rideRequest.waitTime,
			rideDuration: Math.floor(Math.random() * 1) + 1, // 5 to 15 min //JUMP: time logic
			rideState: 0
		};

		this.rideService.createRide(ride).subscribe({
			next: data => {
				//vraca ride
				//edituj state u in progress i zablokiraj oboje dok traje voznja
				//ako postoji ride u listi koji ima in progress presaltaj na stanicu sa timerom i pocni da odbrojavas dotle im zabrani funkcionisanje
				console.log(data);

				this.rideNotificationService.hubConnection
					.invoke("AcceptRide", data, rideRequest.connectionId)
					.then(() => {
						console.log("Ride accepted, created and client notified.");
						sessionStorage.setItem("activeRideId", JSON.stringify(data.id));
						sessionStorage.setItem("waitTime", JSON.stringify(data.waitTime));
						sessionStorage.setItem("rideDuration", JSON.stringify(data.rideDuration));
						this.router.navigate(["/ridetimer"]);
					})
					.catch(err => console.error(err));
			},
			error: () => {
				console.log("failed to create ride ");
			}
		});
	}
}
