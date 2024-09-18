import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AuthGuard } from "./route-guard/route-authorization.guard";
import { DriverComponent } from "./components/driver/driver.component";
import { UserComponent } from "./components/user/user.component";

//JUMP: todo only admin can see admin etc
export const routes: Routes = [
	{ path: "login", component: LoginComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "admin", component: AdminComponent },
	{ path: "driver", component: DriverComponent },
	{ path: "user", component: UserComponent },
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "**", redirectTo: "login" }
];
