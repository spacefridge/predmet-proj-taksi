import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../environment/environment ";
import { Observable } from "rxjs";
import { RideRequest } from "../models/rides/ride-request.model";
import { WholeUser } from "../models/whole-user.model";
import { Ride } from "../models/rides/ride.model";
import { RideWithId } from "../models/rides/ride-with-id.model";

@Injectable({
	providedIn: "root"
})
export class RideService {
	apiBaseUrl: string = "";
	constructor(private router: Router, private http: HttpClient) {
		this.apiBaseUrl = environment.config.ApiBaseUrl;
	}

	request(rideRequest: RideRequest): Observable<string> {
		const url = `${this.apiBaseUrl}api/rides/request`;

		const params: RideRequest = {
			startAddress: rideRequest.startAddress,
			endAddress: rideRequest.endAddress,
			userId: rideRequest.userId,
			price: rideRequest.price,
			waitTime: rideRequest.waitTime,
			connectionId: rideRequest.connectionId
		};

		return this.http.post<string>(url, params);
	}

	//JUMP: restrict requests only to owners

	getAllRides(): Observable<RideWithId[]> {
		const url = `${this.apiBaseUrl}api/rides/all`;
		return this.http.get<RideWithId[]>(url, {});
	}

	getAllRidesUser(idu: number): Observable<RideWithId[]> {
		const url = `${this.apiBaseUrl}api/rides/alluser/${idu}`;
		return this.http.get<RideWithId[]>(url, {});
	}

	getAllRidesDriver(idd: number): Observable<RideWithId[]> {
		const url = `${this.apiBaseUrl}api/rides/alldriver/${idd}`;
		return this.http.get<RideWithId[]>(url, {});
	}

	getRideById(id: number): Observable<RideWithId> {
		const url = `${this.apiBaseUrl}api/rides/${id}`;
		return this.http.get<RideWithId>(url, {});
	}

	createRide(ride: Ride): Observable<RideWithId> {
		const url = `${this.apiBaseUrl}api/rides`;
		return this.http.post<RideWithId>(url, ride);
	}

	UpdateRideStatus(id: number, status: number): Observable<Ride> {
		const url = `${this.apiBaseUrl}api/rides/${id}/${status}`;
		return this.http.put<Ride>(url, {});
	}
}
