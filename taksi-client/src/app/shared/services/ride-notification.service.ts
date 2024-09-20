import * as signalR from "@microsoft/signalr";
import { Injectable } from "@angular/core";
import { RideRequest } from "../models/rides/ride-request.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class RideNotificationService {
	public hubConnection: signalR.HubConnection;
	private countdownSource = new BehaviorSubject<number>(0);
	countdown$ = this.countdownSource.asObservable();
	public drivers: string[] = [];
	public users: string[] = [];
	public id: string = "";

	private countdownSourceRide = new BehaviorSubject<number>(0);
	countdownride$ = this.countdownSourceRide.asObservable();
	constructor() {
		const storedUser = sessionStorage.getItem("userData");
		this.id = storedUser ? JSON.parse(storedUser).id : null;
		this.hubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7172/rideHub").build();
		this.registerHandlers();
	}

	private registerHandlers() {
		// Listen for updates to the driver list
		this.hubConnection.on("UpdateDriverList", (driverList: string[]) => {
			this.drivers = driverList;
			console.log("Updated drivers:", this.drivers);
		});

		// Listen for updates to the user list
		this.hubConnection.on("UpdateUserList", (userList: string[]) => {
			this.users = userList;
			console.log("Updated users:", this.users);
		});
	}

	private async startConnection1() {
		try {
			await this.hubConnection.start();
			console.log("SignalR connection started successfully.");
		} catch (err) {
			console.error("SignalR connection failed:", err);
			setTimeout(() => this.startConnection(), 5000); // Retry every 5 seconds
		}
	}

	private async ensureConnectionStarted() {
		if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
			try {
				console.log("Attempting to start SignalR connection...");
				await this.hubConnection.start();
				console.log("SignalR connection successfully re-established.");
			} catch (err) {
				console.error("Error starting SignalR connection:", err);
				throw err; // Handle failure here (retry mechanism can be added)
			}
		}
	}

	public async registerDriver(driverName: string) {
		await this.ensureConnectionStarted();
		try {
			await this.hubConnection.invoke("RegisterDriver", driverName);
			console.log("Driver registered successfully:", driverName);
		} catch (err) {
			console.error("Error registering driver:", err);
		}
	}
	public async registerUser(userName: string) {
		await this.ensureConnectionStarted();
		try {
			await this.hubConnection.invoke("RegisterUser", userName);
			console.log("User registered successfully:", userName);
		} catch (err) {
			console.error("Error registering user:", err);
		}
	}

	startConnection() {
		this.hubConnection
			.start()
			.then(() => {
				console.log("SignalR connection started");
				const storedUser = sessionStorage.getItem("userData");
				let id = storedUser ? JSON.parse(storedUser).id : null;
				let idz: string = id ? id.toString() : "";

				this.registerUser(idz);

				this.hubConnection.invoke("GetConnectionId").then((id: string) => {
					console.log("Connection ID:", id);
					sessionStorage.setItem("connectionId", id);
				});
			})
			.catch(err => console.error("Error while starting SignalR connection:", err));
	}

	startConnectionAsDriver() {
		this.hubConnection
			.start()
			.then(() => {
				const storedUser = sessionStorage.getItem("userData");
				let id = storedUser ? JSON.parse(storedUser).id : null;
				let idz: string = id ? id.toString() : "";

				console.log("SignalR connection started as driver");
				//this.registerDriver(idz);

				this.joinDriverGroup();
			})
			.catch(err => console.error("Error while starting SignalR connection:", err));
	}

	/////////////////
	///
	public addStartCountdownListener(): void {
		this.hubConnection.on("ReceiveStartCountdown", (minutes: number) => {
			this.startCountdown(minutes);
		});
	}

	public addStartCountdownUpdateListener(): void {
		this.hubConnection.on("ReceiveCountdownUpdate", (minutes: number) => {
			this.startCountdownUpdate(minutes);
		});
	}

	public addStartRideCountdownUpdateListener(): void {
		this.hubConnection.on("ReceiveCountdownUpdate", (minutes: number) => {
			this.startRideCountdownUpdate(minutes);
		});
	}

	private startRideCountdownUpdate(minutes: number): void {
		//let remainingTime = minutes * 60; // Convert minutes to seconds

		this.countdownSourceRide.next(minutes);
	}

	private startCountdownUpdate(minutes: number): void {
		//let remainingTime = minutes * 60; // Convert minutes to seconds

		this.countdownSource.next(minutes);
	}

	private startCountdown(minutes: number): void {
		let remainingTime = minutes * 60; // Convert minutes to seconds
		const interval = setInterval(() => {
			if (remainingTime > 0) {
				remainingTime--;
				this.countdownSource.next(remainingTime);
			} else {
				clearInterval(interval);
			}
		}, 1000);
	}

	public joinRideGroup(rideId: number): void {
		this.hubConnection
			.invoke("JoinRideGroup", rideId)
			.catch(err => console.error("Error while joining ride group: " + err));
	}

	///

	joinDriverGroup() {
		this.hubConnection
			.invoke("JoinDriverGroup")
			.then(() => console.log("Joined the drivers group successfully."))
			.catch(err => console.error("Error joining drivers group: ", err));
	}

	onRideAccepted(callback: (rideRequest: any) => void) {
		this.hubConnection.on("ReceiveRideAccepted", rideRequest => {
			callback(rideRequest);
		});
	}

	onRideRequest(callback: (rideRequest: RideRequest) => void) {
		this.hubConnection.on("ReceiveRideRequest", callback);
	}
	//////

	// public registerDriver(driverName: string): void {
	// 	this.hubConnection.invoke("RegisterDriver", driverName).catch(err => console.error(err));
	// }

	// Method to register a user with their username
	// public registerUser(userName: string): void {
	// 	this.hubConnection.invoke("RegisterUser", userName).catch(err => console.error(err));
	// }
	////

	sendMessageToDriver(driverName: string, message: string) {
		this.hubConnection.invoke("SendMessageToDriver", driverName, message);
	}

	sendMessageToUser(userName: string, message: string) {
		this.hubConnection.invoke("SendMessageToUser", userName, message);
	}

	//one receive
	onReceiveMessage(callback: (sender: string, message: string) => void) {
		this.hubConnection.on("ReceiveMessage", callback);
	}

	onUpdateDriverList(callback: (drivers: string[]) => void) {
		this.hubConnection.on("UpdateDriverList", callback);
	}

	onUpdateUserList(callback: (users: string[]) => void) {
		this.hubConnection.on("UpdateUserList", callback);
	}

	public async SendMessageToDriver(receiverName: string, message: string) {
		await this.ensureConnectionStarted();
		try {
			await this.hubConnection.invoke("SendMessageToDriver", receiverName, message);
			console.log("Message sent to:", receiverName);
		} catch (err) {
			console.error("Error sending message:", err);
		}
	}

	public async SendMessageToUser(receiverName: string, message: string) {
		await this.ensureConnectionStarted();
		try {
			await this.hubConnection.invoke("SendMessageToUser", receiverName, message);
			console.log("Message sent to:", receiverName);
		} catch (err) {
			console.error("Error sending message:", err);
		}
	}
}
