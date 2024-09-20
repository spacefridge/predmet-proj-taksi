import { Component, OnInit } from "@angular/core";
import { RideNotificationService } from "../../shared/services/ride-notification.service";
import { CommonModule } from "@angular/common";
import { FormControlName, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
	selector: "app-chat",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormsModule],
	templateUrl: "./chat.component.html",
	styleUrl: "./chat.component.scss"
})
export class ChatComponent implements OnInit {
	messageInput: string = "";
	selectedDriver: string | null = null;
	selectedUser: string | null = null;
	messages: { sender: string; text: string }[] = [];
	userType: number = -1;
	idid: string = "";

	constructor(public chatService: RideNotificationService) {
		const storedUser = sessionStorage.getItem("userData");
		this.userType = storedUser ? JSON.parse(storedUser).userType : null;
		let id = storedUser ? JSON.parse(storedUser).id : null;
		let idz: string = id ? id.toString() : "";

		if (this.userType == 1) {
			this.chatService.registerDriver(idz);
		}
		if (this.userType == 2) {
			this.chatService.registerUser(idz);
		}
	}

	ngOnInit() {
		//this.chatService.startConnection();
		this.chatService.hubConnection.on("ReceiveMessage", (sender: string, message: string) => {
			this.messages.push({ sender, text: message });
			console.log("Message received:", { sender, message });
		});
	}
	selectDriver(driver: string) {
		this.selectedDriver = driver;
		console.log(`Driver selected: ${driver}`);
	}
	selectUser(user: string) {
		this.selectedUser = user;
		console.log(`User selected: ${user}`);
	}

	sendMessage() {
		if (this.selectedDriver && this.messageInput.trim()) {
			console.log("sent to driver");
			this.chatService.SendMessageToDriver(this.selectedDriver, this.messageInput);
			this.messageInput = ""; // Clear input field
		}
		if (this.selectedUser && this.messageInput.trim()) {
			console.log("sent to User");
			this.chatService.SendMessageToUser(this.selectedUser, this.messageInput);
			this.messageInput = ""; // Clear input field
		}
	}
}
