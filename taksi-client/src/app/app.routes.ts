import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EditComponent } from "./components/edit/edit.component";
import { VerificationComponent } from "./components/verification/verification.component";
import { NewrideuserComponent } from "./components/newrideuser/newrideuser.component";
import { RidehistoryComponent } from "./components/ridehistory/ridehistory.component";
import { RidetimerComponent } from "./components/ridetimer/ridetimer.component";
import { ChatComponent } from "./components/chat/chat.component";
import { AcceptrideComponent } from "./components/acceptride/acceptride.component";

//JUMP: todo only admin can see admin etc
export const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "dashboard", component: DashboardComponent },
	{ path: "edit", component: EditComponent },
	{ path: "verification", component: VerificationComponent },
	{ path: "newrideuser", component: NewrideuserComponent },
	{ path: "history", component: RidehistoryComponent },
	{ path: "ridetimer", component: RidetimerComponent },
	{ path: "chat", component: ChatComponent },
	{ path: "accept", component: AcceptrideComponent },
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "**", redirectTo: "login" }
];
